import { useEffect, useRef, useState } from 'react';
import {
  registerAudioElement,
  unregisterAudioElement,
  playAudioDirect,
  isAudioSwitching,
  setAudioErrorHandler,
} from '../lib/preview';

// Internal deck for prev/next. Track picking happens in
// Discography / Eras / Tarot / Muses via cueSong, player just follows.
// Volume via hardware buttons, no in-app volume UI.
const baseTracks = [
  { title: 'Video Games', slug: 'video-games', era: 'BORN TO DIE', year: '2012', duration: '4:42', src: '/audio/video-games.mp3', local: '/audio/video-games.mp3', source: 'LOCAL' },
  { title: 'West Coast', slug: 'west-coast', era: 'ULTRAVIOLENCE', year: '2014', duration: '4:16', src: '/audio/west-coast.mp3', local: '/audio/west-coast.mp3', source: 'LOCAL' },
  { title: 'Mariners Apartment Complex', slug: 'mariners-apartment-complex', era: 'NFR!', year: '2019', duration: '4:06', src: '/audio/mariners-apartment-complex.mp3', local: '/audio/mariners-apartment-complex.mp3', source: 'LOCAL' },
  { title: 'Sweet', slug: 'sweet', era: 'OCEAN BLVD', year: '2023', duration: '3:22', src: '/audio/sweet.mp3', local: '/audio/sweet.mp3', source: 'LOCAL' },
  { title: 'Honeymoon', slug: 'honeymoon', era: 'HONEYMOON', year: '2015', duration: '5:50', src: '/audio/honeymoon.mp3', local: '/audio/honeymoon.mp3', source: 'LOCAL' },
  { title: 'Love', slug: 'love', era: 'LUST FOR LIFE', year: '2017', duration: '4:32', src: '/audio/love.mp3', local: '/audio/love.mp3', source: 'LOCAL' },
  { title: 'White Dress', slug: 'white-dress', era: 'CHEMTRAILS', year: '2021', duration: '5:33', src: '/audio/white-dress.mp3', local: '/audio/white-dress.mp3', source: 'LOCAL' },
  { title: 'A&W', slug: 'a-w', era: 'OCEAN BLVD', year: '2023', duration: '7:13', src: '/audio/a-w.mp3', local: '/audio/a-w.mp3', source: 'LOCAL' },
  { title: 'Ride', slug: 'ride', era: 'PARADISE', year: '2012', duration: '4:49', src: '/audio/ride.mp3', local: '/audio/ride.mp3', source: 'LOCAL' },
];

function formatTime(sec) {
  if (!isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function AudioPlayer({ isPlaying, setIsPlaying, currentTrack, setCurrentTrack }) {
  const audioRef = useRef(null);

  const [tracks] = useState(baseTracks);
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const toastedRef = useRef(null);
  const barRef = useRef(null);

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
  const matchDeck = (base) => tracks.findIndex((t) => t.title.toLowerCase() === base || base.includes(t.title.toLowerCase()) || t.title.toLowerCase().includes(base));
  const reqBase = currentTrack && !currentTrack.src ? cleanTitle(currentTrack.title).toLowerCase() : null;
  const reqPlayable = !currentTrack || currentTrack.src || (reqBase && matchDeck(reqBase) !== -1);
  const displayTitle = reqPlayable ? cleanTitle(currentTrack?.title || activeTrack.title) : activeTrack.title;
  const displayEra = reqPlayable ? (currentTrack?.era || activeTrack.era) : activeTrack.era;
  const effectiveSrc = currentTrack?.src || activeTrack.src;

  useEffect(() => {
    if (audioRef.current) {
      registerAudioElement(audioRef.current);
      if (effectiveSrc && !audioRef.current.src) {
        audioRef.current.src = effectiveSrc;
      }
    }
    return () => {
      unregisterAudioElement();
    };
  }, []);

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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !effectiveSrc) return;
    const cur = audio.currentSrc || audio.src || '';
    const curTail = cur.split('/').pop()?.split('?')[0];
    const tgtTail = effectiveSrc.split('/').pop()?.split('?')[0];
    if (curTail !== tgtTail || !cur) {
      playAudioDirect(effectiveSrc);
    }
  }, [effectiveSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      if (audio.paused && !isAudioSwitching()) {
        const p = audio.play();
        if (p && typeof p.catch === 'function') {
          p.catch((err) => {
            if (err.name !== 'AbortError') {
              console.warn('[AudioPlayer] isPlaying effect error:', err);
            }
          });
        }
      }
    } else {
      if (!audio.paused && !isAudioSwitching()) {
        audio.pause();
      }
    }
  }, [isPlaying]);

  const trackIndexRef = useRef(trackIndex);
  const tracksRef = useRef(tracks);
  useEffect(() => { trackIndexRef.current = trackIndex; }, [trackIndex]);
  useEffect(() => { tracksRef.current = tracks; }, [tracks]);

  const selectAndPlay = (n) => {
    const t = tracks[n];
    if (!t) return;
    setError(null);
    setCurrentTime(0);
    setTrackIndex(n);
    setCurrentTrack(t);
    setIsPlaying(true);
    playAudioDirect(t.src);
  };
  const selectAndPlayRef = useRef(selectAndPlay);
  useEffect(() => { selectAndPlayRef.current = selectAndPlay; });

  // bersihkan sisa posisi drag versi lama (localStorage), sekali saja
  useEffect(() => {
    try { localStorage.removeItem('lg-player-pos'); } catch {}
  }, []);

  // Keyboard shortcuts: Space (play/pause), Ctrl/Alt + ArrowRight (next), Ctrl/Alt + ArrowLeft (prev)
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;

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

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
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
      if (audio.src && !audio.src.endsWith('/')) {
        console.warn('[AudioPlayer] Audio load error for', audio.src);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
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
    } else {
      if (!audio.src && effectiveSrc) {
        audio.src = effectiveSrc;
      }
      setIsPlaying(true);
      const p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch((err) => {
          if (err.name !== 'AbortError') {
            console.warn('[AudioPlayer] togglePlay error:', err);
          }
        });
      }
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
      <audio ref={audioRef} preload="auto" playsInline />
      <div className="h-[76px]" aria-hidden />

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <div className="pointer-events-auto relative w-full max-w-[560px]">
          {error && (
            <div className="absolute -top-9 left-1/2 flex max-w-full -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#1A1A1A]/95 px-3 py-1.5 font-mono text-[10px] tracking-wide text-parchment/80 shadow-lg">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
              <span className="truncate">{error}</span>
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
              <div className="block w-full truncate font-mono text-[10px] tabular-nums tracking-wide text-parchment/50">
                {formatTime(currentTime)} / {duration ? formatTime(duration) : '--:--'} · {displayEra}
              </div>
            </div>

            <div className="flex shrink-0 items-center">
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
            className="mx-6 -mt-0.5 cursor-pointer py-1"
            title="Seek"
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
