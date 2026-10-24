import { useEffect, useRef, useState } from 'react';
import {
  registerAudioElement,
  unregisterAudioElement,
  playAudioDirect,
  isAudioSwitching,
  setAudioErrorHandler,
  cueSong,
  fullSongLinks,
  invalidateBySrc,
  slugify,
} from '../lib/preview';

// Internal deck for prev/next. Track picking happens in
// Discography / Eras / Tarot / Muses via cueSong, player just follows.
// No bundled audio: every track resolves from a streaming API on demand.
const baseTracks = [
  { title: 'Video Games', slug: 'video-games', era: 'BORN TO DIE', year: '2012', duration: '4:42' },
  { title: 'West Coast', slug: 'west-coast', era: 'ULTRAVIOLENCE', year: '2014', duration: '4:16' },
  { title: 'Mariners Apartment Complex', slug: 'mariners-apartment-complex', era: 'NFR!', year: '2019', duration: '4:06' },
  { title: 'Sweet', slug: 'sweet', era: 'OCEAN BLVD', year: '2023', duration: '3:22' },
  { title: 'Honeymoon', slug: 'honeymoon', era: 'HONEYMOON', year: '2015', duration: '5:50' },
  { title: 'Love', slug: 'love', era: 'LUST FOR LIFE', year: '2017', duration: '4:32' },
  { title: 'White Dress', slug: 'white-dress', era: 'CHEMTRAILS', year: '2021', duration: '5:33' },
  { title: 'A&W', slug: 'a-w', era: 'OCEAN BLVD', year: '2023', duration: '7:13' },
  { title: 'Ride', slug: 'ride', era: 'PARADISE', year: '2012', duration: '4:49' },
];

function formatTime(sec) {
  if (!isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Filename portion of an audio URL, ignoring query string. Preview URLs are
// long signed CDN paths, so compare only the last segment.
function tailOf(src) {
  return (src || '').split('/').pop()?.split('?')[0] || '';
}

export default function AudioPlayer({ isPlaying, setIsPlaying, currentTrack, setCurrentTrack }) {
  const audioRef = useRef(null);

  const tracks = baseTracks;
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const [linksOpen, setLinksOpen] = useState(false);
  const toastedRef = useRef(null);
  const barRef = useRef(null);
  const linksRef = useRef(null);
  const retriedRef = useRef(null);
  const currentTrackRef = useRef(currentTrack);
  useEffect(() => { currentTrackRef.current = currentTrack; }, [currentTrack]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 3500);
    return () => clearTimeout(t);
  }, [error]);

  useEffect(() => {
    setAudioErrorHandler((msg) => setError(msg));
    return () => setAudioErrorHandler(null);
  }, []);

  const cleanTitle = (raw) => (raw ? raw.split(' /')[0].trim() : '');
  const activeTrack = tracks[trackIndex];
  const matchDeck = (base) => tracks.findIndex((t) => slugify(t.title) === slugify(base));

  const displayTitle = cleanTitle(currentTrack?.title || activeTrack.title);
  const displayEra = currentTrack?.era || activeTrack.era;
  const effectiveSrc = currentTrack?.src || null;
  const isLoading = Boolean(currentTrack?.loading);
  const fullLinks = currentTrack?.fullLinks || fullSongLinks(displayTitle);

  useEffect(() => {
    if (audioRef.current) registerAudioElement(audioRef.current);
    return () => unregisterAudioElement();
  }, []);

  useEffect(() => {
    if (!linksOpen) return;
    const onDown = (e) => {
      if (linksRef.current && !linksRef.current.contains(e.target)) setLinksOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [linksOpen]);

  useEffect(() => {
    if (!currentTrack) return;
    if (currentTrack.unplayable) {
      if (toastedRef.current !== currentTrack.title) {
        toastedRef.current = currentTrack.title;
        setError('Archived demo unreleased, no audio available in archive');
      }
      return;
    }
    const base = cleanTitle(currentTrack.title).toLowerCase();
    const idx = matchDeck(base);
    if (idx !== -1 && idx !== trackIndex) {
      setTrackIndex(idx);
    }
  }, [currentTrack, tracks, trackIndex]);

  // Single source of truth for transport state.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      if (!effectiveSrc) return;
      if (tailOf(audio.currentSrc || audio.src) !== tailOf(effectiveSrc)) {
        playAudioDirect(effectiveSrc);
      } else if (audio.paused && !isAudioSwitching()) {
        const p = audio.play();
        if (p && typeof p.catch === 'function') {
          p.catch((err) => {
            if (err.name !== 'AbortError') console.warn('[AudioPlayer] resume failed:', err);
          });
        }
      }
    } else if (!audio.paused && !isAudioSwitching()) {
      audio.pause();
    }
  }, [isPlaying, effectiveSrc]);

  const trackIndexRef = useRef(trackIndex);
  const tracksRef = useRef(tracks);
  useEffect(() => { trackIndexRef.current = trackIndex; }, [trackIndex]);
  useEffect(() => { tracksRef.current = tracks; }, [tracks]);

  // Cueing goes through cueSong so lookup + playback share one code path.
  const selectAndPlay = (n) => {
    const t = tracks[n];
    if (!t) return;
    setError(null);
    setCurrentTime(0);
    setDuration(0);
    setTrackIndex(n);
    cueSong(t.title, t.era, setCurrentTrack, setIsPlaying);
  };
  const selectAndPlayRef = useRef(selectAndPlay);
  useEffect(() => { selectAndPlayRef.current = selectAndPlay; });

  // Keyboard shortcuts: Space only when body focused, Ctrl/Alt + Arrow for next/prev
  useEffect(() => {
    const onKeyDown = (e) => {
      const el = document.activeElement;
      if (el && el.closest?.('button,a,[role="slider"],[role="button"],input,textarea,select,[contenteditable]')) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === 'ArrowRight' && (e.metaKey || e.ctrlKey || e.altKey)) {
        e.preventDefault();
        const nextIdx = (trackIndexRef.current + 1) % tracksRef.current.length;
        if (selectAndPlayRef.current) selectAndPlayRef.current(nextIdx);
      } else if (e.code === 'ArrowLeft' && (e.metaKey || e.ctrlKey || e.altKey)) {
        e.preventDefault();
        const prevIdx = (trackIndexRef.current - 1 + tracksRef.current.length) % tracksRef.current.length;
        if (selectAndPlayRef.current) selectAndPlayRef.current(prevIdx);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let raf = 0;
    let last = 0;
    const onTimeUpdate = () => {
      const now = performance.now();
      if (now - last < 200) {
        if (!raf) raf = requestAnimationFrame(() => { raf = 0; last = performance.now(); setCurrentTime(audio.currentTime); });
        return;
      }
      last = now;
      setCurrentTime(audio.currentTime);
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setError(null);
    };
    const onPlaying = () => {
      setIsPlaying(true);
      setError(null);
    };
    const onPause = () => {
      if (audio.ended || isAudioSwitching()) return;
      setIsPlaying(false);
    };
    const onEnded = () => {
      const nextIdx = (trackIndexRef.current + 1) % tracksRef.current.length;
      if (selectAndPlayRef.current) selectAndPlayRef.current(nextIdx);
    };
    const onError = () => {
      const failedSrc = audio.src;
      if (!failedSrc || failedSrc.endsWith('/')) return;
      console.warn('[AudioPlayer] Audio load error for', failedSrc);

      // A dead preview URL (expired CDN token, moved asset) must not stay in
      // the cache, or every future tap on this song fails the same way.
      const track = currentTrackRef.current;
      const key = track ? cleanTitle(track.title) : null;
      invalidateBySrc(failedSrc);

      if (key && retriedRef.current !== key) {
        retriedRef.current = key;
        setError('Preview expired, re-tuning…');
        cueSong(key, track.era, setCurrentTrack, setIsPlaying);
      } else {
        setError('Preview failed to load, open the full song instead');
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [setIsPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    if (effectiveSrc) {
      if (tailOf(audio.currentSrc || audio.src) !== tailOf(effectiveSrc)) {
        playAudioDirect(effectiveSrc);
      } else {
        setIsPlaying(true);
        const p = audio.play();
        if (p && typeof p.catch === 'function') {
          p.catch((err) => {
            if (err.name !== 'AbortError') console.warn('[AudioPlayer] togglePlay failed:', err);
          });
        }
      }
    } else {
      // Nothing cued yet: start the current deck track.
      selectAndPlay(trackIndex);
    }
  };

  const next = () => {
    selectAndPlay((trackIndex + 1) % tracks.length);
  };
  const prev = () => {
    selectAndPlay((trackIndex - 1 + tracks.length) % tracks.length);
  };

  const seekFromBar = (e) => {
    const el = barRef.current;
    const audio = audioRef.current;
    const total = duration || 30;
    if (!el || !audio) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const val = ratio * total;
    setCurrentTime(val);
    try { audio.currentTime = val; } catch {}
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const reelsSpin = isPlaying && !error;

  return (
    <>
      <audio ref={audioRef} preload="metadata" playsInline crossOrigin="anonymous" />
      <div className="h-[76px]" aria-hidden />

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <div className="pointer-events-auto relative w-full max-w-[560px]">
          {error && (
            <div className="absolute -top-9 left-1/2 flex max-w-full -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#1A1A1A]/95 px-3 py-1.5 font-mono text-[10px] tracking-wide text-parchment/80 shadow-lg">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
              <span className="truncate">{error}</span>
            </div>
          )}

          {linksOpen && (
            <div
              ref={linksRef}
              className="absolute -top-11 right-2 flex items-center gap-1 rounded-full border border-white/10 bg-[#1A1A1A]/95 px-2 py-1.5 shadow-lg backdrop-blur-md"
            >
              <span className="pl-1 pr-0.5 font-mono text-[9px] tracking-widest text-parchment/40">FULL</span>
              <a href={fullLinks.spotify} target="_blank" rel="noopener noreferrer" className="rounded-full px-2 py-0.5 font-mono text-[10px] tracking-wide text-parchment/75 hover:text-brass">SPOTIFY</a>
              <span className="text-white/20">·</span>
              <a href={fullLinks.youtube} target="_blank" rel="noopener noreferrer" className="rounded-full px-2 py-0.5 font-mono text-[10px] tracking-wide text-parchment/75 hover:text-brass">YOUTUBE</a>
              <span className="text-white/20">·</span>
              <a href={fullLinks.apple} target="_blank" rel="noopener noreferrer" className="rounded-full px-2 py-0.5 font-mono text-[10px] tracking-wide text-parchment/75 hover:text-brass">APPLE</a>
            </div>
          )}

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#1A1A1A]/90 py-1.5 pl-2 pr-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-md">
            <div className={`h-8 w-8 shrink-0 rounded-full border border-brass/30 bg-[#1f1f1f] p-1 ${reelsSpin ? 'animate-tape-reel' : ''}`}>
              <div className="h-full w-full rounded-full" style={{ background: `repeating-conic-gradient(from 0deg, #3a3a3a 0 45deg, #242424 45deg 90deg)` }} />
            </div>

            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate font-display text-[13px] font-semibold text-parchment" title={displayTitle}>
                {displayTitle}
              </div>
              <div className="block w-full truncate font-mono text-[10px] tabular-nums tracking-wide text-parchment/75">
                {isLoading ? 'tuning the reel…' : `${formatTime(currentTime)} / ${duration ? formatTime(duration) : '--:--'}`} · {displayEra}
              </div>
            </div>

            <div className="flex shrink-0 items-center">
              <button
                onClick={() => setLinksOpen((v) => !v)}
                aria-label="Listen to the full song"
                title="Listen to the full song"
                aria-expanded={linksOpen}
                className={`flex h-9 w-8 items-center justify-center text-[13px] active:scale-95 ${linksOpen ? 'text-brass' : 'text-white/60 hover:text-white'}`}
              >
                ♫
              </button>
              <button
                onClick={prev}
                aria-label="Previous track"
                title="Previous"
                className="flex h-9 w-8 items-center justify-center text-[13px] text-white/60 hover:text-white active:scale-95"
              >
                ⏮
              </button>
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brass text-noir shadow-[0_4px_14px_rgba(212,175,55,0.35)] hover:bg-brass-light active:scale-95"
              >
                <span className="text-[15px]">{isPlaying ? '❚❚' : '▶'}</span>
              </button>
              <button
                onClick={next}
                aria-label="Next track"
                title="Next"
                className="flex h-9 w-8 items-center justify-center text-[13px] text-white/60 hover:text-white active:scale-95"
              >
                ⏭
              </button>
            </div>
          </div>

          <div
            ref={barRef}
            onClick={seekFromBar}
            onKeyDown={(e) => {
              const audio = audioRef.current;
              const total = duration || 0;
              if (!audio || !total) return;
              const step = 5;
              if (e.key === 'ArrowRight') { audio.currentTime = Math.min(total, (audio.currentTime || 0) + step); e.preventDefault(); }
              else if (e.key === 'ArrowLeft') { audio.currentTime = Math.max(0, (audio.currentTime || 0) - step); e.preventDefault(); }
              else if (e.key === 'Home') { audio.currentTime = 0; e.preventDefault(); }
              else if (e.key === 'End') { audio.currentTime = total; e.preventDefault(); }
            }}
            className="mx-6 -mt-0.5 cursor-pointer py-2 sm:py-3"
            title="Seek (Arrow keys work when focused)"
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration || 0)}
            aria-valuenow={Math.round(currentTime || 0)}
            aria-valuetext={`${formatTime(currentTime)} of ${duration ? formatTime(duration) : 'unknown'}`}
          >
            <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-brass-dark via-brass to-brass-light" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
