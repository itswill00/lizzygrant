import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useDragControls, useMotionValue } from 'framer-motion';
import {
  registerAudioElement,
  unregisterAudioElement,
  playAudioDirect,
} from '../lib/preview';

// Option B local genuine vocal clips (bundled in public/audio) — permanent priority
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

// persisted dock position (draggable player)
const POS_KEY = 'lg-player-pos';
function loadPos() {
  try {
    const raw = localStorage.getItem(POS_KEY);
    if (!raw) return { x: 0, y: 0, saved: false };
    const p = JSON.parse(raw);
    const vw = window.innerWidth || 400;
    const vh = window.innerHeight || 700;
    const x = Math.max(-(vw - 160), Math.min(vw - 160, +p.x || 0));
    const y = Math.max(-(vh - 260), Math.min(0, +p.y || 0));
    return { x, y, saved: x !== 0 || y !== 0 };
  } catch {
    return { x: 0, y: 0, saved: false };
  }
}

export default function AudioPlayer({ isPlaying, setIsPlaying, currentTrack, setCurrentTrack }) {
  const audioRef = useRef(null);

  const [tracks, setTracks] = useState(baseTracks);
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    try {
      const mq = window.matchMedia('(min-width: 640px)');
      const sync = () => setIsDesktop(mq.matches);
      sync();
      mq.addEventListener('change', sync);
      return () => mq.removeEventListener('change', sync);
    } catch { setIsDesktop(window.innerWidth >= 640); return undefined; }
  }, []);

  const showExtras = isDesktop || mobileExpanded;
  const controls = useDragControls();
  const boundsRef = useRef(null);
  const [initialPos] = useState(loadPos);
  const x = useMotionValue(initialPos.x);
  const y = useMotionValue(initialPos.y);
  const savePos = () => {
    try {
      localStorage.setItem(POS_KEY, JSON.stringify({ x: Math.round(x.get()), y: Math.round(y.get()) }));
    } catch {}
  };
  const resetPos = () => {
    x.set(0); y.set(0);
    try { localStorage.removeItem(POS_KEY); } catch {}
  };
  const toastedRef = useRef(null);

  // auto-dismiss error toast
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 3500);
    return () => clearTimeout(t);
  }, [error]);

  const cleanTitle = (raw) => (raw ? raw.split(' —')[0].trim() : '');
  const activeTrack = tracks[trackIndex];
  const matchDeck = (base) => tracks.findIndex((t) => t.title.toLowerCase() === base || base.includes(t.title.toLowerCase()) || t.title.toLowerCase().includes(base));
  const reqBase = currentTrack && !currentTrack.src ? cleanTitle(currentTrack.title).toLowerCase() : null;
  const reqPlayable = !currentTrack || currentTrack.src || (reqBase && matchDeck(reqBase) !== -1);
  const displayTitle = reqPlayable ? cleanTitle(currentTrack?.title || activeTrack.title) : activeTrack.title;
  const displayEra = reqPlayable ? (currentTrack?.era || activeTrack.era) : activeTrack.era;
  const effectiveSrc = currentTrack?.src || activeTrack.src;

  // Register direct audio element for gesture-immune synchronous playback
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

  // Update cassette deck index when currentTrack changes
  useEffect(() => {
    if (!currentTrack) return;
    if (currentTrack.unplayable) {
      if (toastedRef.current !== currentTrack.title) {
        toastedRef.current = currentTrack.title;
        setError('Archived demo unreleased — no audio available in archive');
      }
      return;
    }
    const base = cleanTitle(currentTrack.title).toLowerCase();
    const idx = matchDeck(base);
    if (idx !== -1 && idx !== trackIndex) {
      setTrackIndex(idx);
    }
  }, [currentTrack, tracks, trackIndex]);

  // Sync audio.src when effectiveSrc changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !effectiveSrc) return;
    const cur = audio.currentSrc || audio.src || '';
    const curTail = cur.split('/').pop()?.split('?')[0];
    const tgtTail = effectiveSrc.split('/').pop()?.split('?')[0];
    if (curTail !== tgtTail || !cur) {
      audio.src = effectiveSrc;
      audio.currentTime = 0;
      if (isPlaying) {
        const p = audio.play();
        if (p && typeof p.catch === 'function') {
          p.catch((err) => {
            if (err.name !== 'AbortError') {
              console.warn('[AudioPlayer] switch play error:', err);
            }
          });
        }
      }
    }
  }, [effectiveSrc, isPlaying]);

  // Sync play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      if (audio.paused) {
        if (!audio.src && effectiveSrc) {
          audio.src = effectiveSrc;
        }
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
      if (!audio.paused) {
        audio.pause();
      }
    }
  }, [isPlaying, effectiveSrc]);

  // Volume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!isSeeking) setCurrentTime(audio.currentTime);
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
      if (audio.ended) return;
      setIsPlaying(false);
    };
    const onEnded = () => {
      const nextIdx = (trackIndex + 1) % tracks.length;
      selectAndPlay(nextIdx);
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
  }, [isSeeking, setIsPlaying, tracks, trackIndex]);

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) audioRef.current.currentTime = val;
  };

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

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const reelsSpin = isPlaying && !error;

  return (
    <>
      <audio
        ref={audioRef}
        preload="auto"
        playsInline
      />

      <div className={`sm:hidden ${minimized ? 'h-[56px]' : mobileExpanded ? 'h-[290px]' : 'h-[100px]'}`} />
      <div className={`hidden sm:block ${minimized ? 'h-[56px]' : 'h-[300px]'}`} />

      <div ref={boundsRef} className="pointer-events-none fixed inset-0 z-50">
        <AnimatePresence>
          {!minimized ? (
            <motion.div
              drag={isDesktop}
              dragListener={false}
              dragControls={controls}
              dragConstraints={boundsRef}
              dragMomentum={false}
              dragElastic={0.08}
              onDragEnd={savePos}
              style={isDesktop ? { x, y } : undefined}
              initial={initialPos.saved && isDesktop ? { opacity: 0 } : { y: 80, opacity: 0 }}
              animate={{ opacity: 1, y: isDesktop ? initialPos.y : 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="pointer-events-auto absolute bottom-2 left-2 right-2 overflow-hidden rounded-2xl border border-[#F7F4EB]/10 bg-[#1A1A1A] shadow-[0_16px_40px_rgba(0,0,0,0.35)] dark:border-[#F7F4EB]/10 pb-[env(safe-area-inset-bottom,0px)] sm:bottom-4 sm:left-0 sm:right-0 sm:mx-auto sm:w-full sm:max-w-[620px] sm:shadow-[0_20px_48px_rgba(0,0,0,0.4)] lg:bottom-6 lg:max-w-[680px]"
            >
              {/* drag grip — mobile only (desktop uses top bar) */}
              <div
                onPointerDown={(e) => controls.start(e)}
                onDoubleClick={resetPos}
                title="Double-tap to reset position"
                className="flex touch-none cursor-grab justify-center pb-1 pt-2 active:cursor-grabbing sm:hidden"
              >
                <span className="h-1 w-14 rounded-full bg-white/15" />
              </div>
              <div
                onPointerDown={(e) => controls.start(e)}
                onDoubleClick={resetPos}
                title="Drag to reposition / Double-click to reset"
                className="hidden cursor-grab touch-none select-none items-center justify-between gap-2 bg-[#22201E] px-3 py-1.5 active:cursor-grabbing sm:flex"
              >
                <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isPlaying && !error ? 'bg-brass' : 'bg-cherry'}`} />
                  <span className="truncate font-mono text-[9px] tracking-[0.12em] text-parchment/60 sm:text-[10px] sm:tracking-[0.2em]">
                    ARCHIVE CASSETTE DECK — {isPlaying ? 'PLAYING' : 'STANDBY'}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => setMinimized(true)}
                    className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[9px] tracking-widest text-white/60 hover:bg-white/10 active:scale-95 sm:text-[10px]"
                    aria-label="Minimize player"
                  >
                    — HIDE
                  </button>
                </div>
              </div>

              {/* subtle error toast — auto-dismisses, never blocks UI */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="mx-2.5 mt-2 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 font-mono text-[10px] tracking-wide text-parchment/80 backdrop-blur sm:mx-3 sm:text-[11px]"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                    <span className="truncate">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* mini row — mobile pretty, desktop full */}
              <div className="relative flex items-center gap-2 p-2.5 sm:gap-4 sm:p-4">
                {/* cassette window — desktop only */}
                <div className="hidden h-[64px] w-[90px] shrink-0 items-center justify-center gap-1.5 rounded-md border border-white/10 bg-[#2a2a2a] p-2 shadow-inner sm:flex sm:h-[72px] sm:w-[110px] sm:gap-2">
                  <div className={`h-7 w-7 rounded-full border border-white/15 bg-[#1f1f1f] p-0.5 sm:h-8 sm:w-8 ${reelsSpin ? 'animate-tape-reel' : ''}`}>
                    <div className="h-full w-full rounded-full" style={{ background: `repeating-conic-gradient(from 0deg, #3a3a3a 0 45deg, #2a2a2a 45deg 90deg)` }} />
                  </div>
                  <div className="h-1 flex-1 rounded-full bg-white/10" />
                  <div className={`h-7 w-7 rounded-full border border-white/15 bg-[#1f1f1f] p-0.5 sm:h-8 sm:w-8 ${reelsSpin ? 'animate-tape-reel' : ''}`} style={{ animationDirection: 'reverse' }}>
                    <div className="h-full w-full rounded-full" style={{ background: `repeating-conic-gradient(from 0deg, #3a3a3a 0 45deg, #2a2a2a 45deg 90deg)` }} />
                  </div>
                </div>

                {/* live reel thumb — mobile only */}
                <div className={`h-10 w-10 shrink-0 rounded-full border border-brass/30 bg-[#1f1f1f] p-1 shadow-[0_0_12px_rgba(212,175,55,0.25)] sm:hidden ${reelsSpin ? 'animate-tape-reel' : ''}`}>
                  <div className="h-full w-full rounded-full" style={{ background: `repeating-conic-gradient(from 0deg, #3a3a3a 0 45deg, #242424 45deg 90deg)` }} />
                </div>

                {/* title toggles expand — mobile only */}
                <button
                  onClick={() => setMobileExpanded((v) => !v)}
                  aria-expanded={mobileExpanded}
                  aria-label={mobileExpanded ? 'Collapse player' : 'Expand player'}
                  className="flex min-w-0 flex-1 items-center gap-1.5 text-left sm:hidden"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[13px] font-semibold leading-tight text-parchment" title={displayTitle}>
                      {displayTitle}
                    </span>
                    <span className="block truncate font-mono text-[10px] tracking-[0.12em] text-brass-light">
                      LANA DEL REY / {displayEra}
                    </span>
                  </span>
                </button>

                {/* desktop title */}
                <div className="hidden min-w-0 flex-1 sm:block">
                  <div className="truncate font-display text-[16px] font-semibold leading-tight text-parchment" title={displayTitle}>
                    {displayTitle}
                  </div>
                  <div className="truncate font-mono text-[12px] tracking-[0.15em] text-brass-light">
                    LANA DEL REY / {displayEra}
                  </div>
                </div>

                {/* transport */}
                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={prev}
                    aria-label="Previous"
                    className={`${mobileExpanded ? 'flex' : 'hidden'} h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[12px] text-white hover:bg-white/10 active:scale-95 sm:flex sm:h-11 sm:w-11`}
                    title="Previous track"
                  >
                    ⏮
                  </button>
                  <button
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-brass text-noir shadow-[0_4px_14px_rgba(212,175,55,0.35)] hover:bg-brass-light active:scale-95 sm:h-12 sm:w-12"
                  >
                    <span className="text-[16px] sm:text-[18px]">{isPlaying ? '❚❚' : '▶'}</span>
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[12px] text-white hover:bg-white/10 active:scale-95 sm:h-11 sm:w-11"
                    title="Next track"
                  >
                    ⏭
                  </button>
                </div>

                {/* hairline progress — mobile only */}
                <div className="absolute inset-x-3 bottom-1 h-[3px] overflow-hidden rounded-full bg-white/10 sm:hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-brass-dark via-brass to-brass-light" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* extras — smooth expand on mobile, always open on desktop */}
              <AnimatePresence initial={false}>
                {showExtras && (
                  <motion.div
                    key="extras"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    {/* seek */}
                    <div className="flex items-center gap-2 px-2.5 pb-2.5 pt-1 sm:gap-2.5 sm:px-4 sm:pt-0">
                      <span className="font-mono text-[10px] tabular-nums text-parchment/50">
                        {formatTime(currentTime)}
                      </span>
                      <div className="relative flex flex-1 items-center">
                        <input
                          type="range"
                          min={0}
                          max={duration || 30}
                          step={0.1}
                          value={isFinite(currentTime) ? currentTime : 0}
                          onChange={handleSeek}
                          onMouseDown={() => setIsSeeking(true)}
                          onMouseUp={() => setIsSeeking(false)}
                          onTouchStart={() => setIsSeeking(true)}
                          onTouchEnd={() => setIsSeeking(false)}
                          className="h-2 w-full appearance-none rounded-full bg-white/10 accent-brass [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brass"
                          aria-label="Seek"
                        />
                        <div className="pointer-events-none absolute left-0 h-2 rounded-full bg-brass" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="font-mono text-[10px] tabular-nums text-parchment/50">
                        {duration ? formatTime(duration) : '0:30'}
                      </span>
                    </div>

                    {/* volume */}
                    <div className="flex items-center gap-2 border-t border-white/5 bg-[#232120] px-3 py-2.5 sm:gap-3 sm:px-4">
                      <button
                        onClick={() => setIsMuted((m) => !m)}
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-[15px] text-white hover:bg-white/10 active:scale-95"
                      >
                        {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔈' : '🔊'}
                      </button>
                      <div className="flex flex-1 items-center gap-2">
                        <span className="font-mono text-[10px] tracking-widest text-white/40">VOL</span>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={isMuted ? 0 : volume}
                          onChange={(e) => {
                            const v = parseFloat(e.target.value);
                            setVolume(v);
                            if (v > 0) setIsMuted(false);
                          }}
                          className="h-1.5 flex-1 appearance-none rounded-full bg-white/10 accent-white [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                          aria-label="Volume"
                        />
                        <span className="w-8 text-right font-mono text-[10px] tabular-nums text-white/50">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
                      </div>
                    </div>

                    {/* track pills */}
                    <div className="border-t border-white/5 bg-[#1f1e1c] px-3 py-2.5 sm:px-4">
                      <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] tracking-[0.15em] text-white/40">
                        <span>CHOOSE A TRACK</span>
                        <span className="text-white/20">{tracks.length} TRACKS</span>
                      </div>
                      <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2">
                        <style>{`[scrollbar-width:none]::-webkit-scrollbar{display:none}`}</style>
                        {tracks.map((t, i) => (
                          <button
                            key={t.title}
                            onClick={() => selectAndPlay(i)}
                            className={`shrink-0 rounded-full border px-3.5 py-2 font-mono text-[11px] tracking-wide transition active:scale-95 sm:px-4 sm:text-[12px] ${
                              i === trackIndex
                                ? 'border-brass bg-brass text-noir'
                                : 'border-white/10 bg-white/5 text-parchment/60 hover:bg-white/10'
                            }`}
                          >
                            {t.title}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* hide — mobile only */}
                    <button
                      onClick={() => setMinimized(true)}
                      className="flex w-full items-center justify-center border-t border-white/5 py-2.5 font-mono text-[10px] tracking-[0.2em] text-white/40 transition hover:text-white/70 sm:hidden"
                    >
                      — HIDE PLAYER —
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => setMinimized(false)}
              className="absolute bottom-2 right-2 flex max-w-[calc(100%-1rem)] items-center gap-2 rounded-full border border-white/10 bg-[#1A1A1A]/80 px-3 py-2.5 text-parchment shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all duration-300 hover:bg-[#232120]/90 hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)] active:scale-[0.98] dark:border-[#F7F4EB]/10 sm:bottom-4 sm:right-4 sm:px-4 pointer-events-auto"
            >
              <span className={`h-6 w-6 shrink-0 rounded-full border border-white/15 bg-[#2a2a2a] p-1 sm:h-7 sm:w-7 ${reelsSpin ? 'animate-tape-reel' : ''}`}>
                <span className="block h-full w-full rounded-full bg-white/10" />
              </span>
              <span className="min-w-0 truncate font-mono text-[10px] tracking-[0.12em] sm:text-[11px] sm:tracking-[0.15em]">
                {isPlaying ? '♫ PLAYING' : 'CASSETTE'} — {displayTitle}
              </span>
              <span className="shrink-0 rounded-full bg-brass px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-noir sm:px-2 sm:text-[10px]">EXPAND</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
