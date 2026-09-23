import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Option B local files (if user drops genuine mp3s into public/audio) — priority if exists
// Option A iTunes Search API — 30s genuine vocal previews (no key, free, legal)
// Deezer as secondary fallback for tracks where iTunes search is flaky (Mariners, A&W, Ride, Sweet)
const baseTracks = [
  { title: 'Video Games', slug: 'video-games', era: 'BORN TO DIE', year: '2012', duration: '4:42', src: '/audio/video-games.mp3', local: '/audio/video-games.mp3', query: 'lana del rey video games', fallbackLocal: '/audio/track1.mp3' },
  { title: 'West Coast', slug: 'west-coast', era: 'ULTRAVIOLENCE', year: '2014', duration: '4:16', src: '/audio/west-coast.mp3', local: '/audio/west-coast.mp3', query: 'lana del rey west coast', fallbackLocal: '/audio/track2.mp3' },
  { title: 'Mariners Apartment Complex', slug: 'mariners-apartment-complex', era: 'NFR!', year: '2019', duration: '4:06', src: '/audio/mariners-apartment-complex.mp3', local: '/audio/mariners-apartment-complex.mp3', query: 'lana del rey mariners apartment complex', fallbackLocal: '/audio/track5.mp3' },
  { title: 'Sweet', slug: 'sweet', era: 'OCEAN BLVD', year: '2023', duration: '3:22', src: '/audio/sweet.mp3', local: '/audio/sweet.mp3', query: 'lana del rey sweet', fallbackLocal: '/audio/track7.mp3' },
  { title: 'Honeymoon', slug: 'honeymoon', era: 'HONEYMOON', year: '2015', duration: '5:50', src: '/audio/honeymoon.mp3', local: '/audio/honeymoon.mp3', query: 'lana del rey honeymoon', fallbackLocal: '/audio/track3.mp3' },
  { title: 'Love', slug: 'love', era: 'LUST FOR LIFE', year: '2017', duration: '4:32', src: '/audio/love.mp3', local: '/audio/love.mp3', query: 'lana del rey love', fallbackLocal: '/audio/track4.mp3' },
  { title: 'White Dress', slug: 'white-dress', era: 'CHEMTRAILS', year: '2021', duration: '5:33', src: '/audio/white-dress.mp3', local: '/audio/white-dress.mp3', query: 'lana del rey white dress', fallbackLocal: '/audio/track6.mp3' },
  { title: 'A&W', slug: 'a-w', era: 'OCEAN BLVD', year: '2023', duration: '7:13', src: '/audio/a-w.mp3', local: '/audio/a-w.mp3', query: 'lana del rey a&w', fallbackLocal: '/audio/track8.mp3' },
];

function formatTime(sec) {
  if (!isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// helper: check if local file exists via HEAD (no download)
async function localExists(url) {
  try {
    const r = await fetch(url, { method: 'HEAD' });
    return r.ok;
  } catch {
    return false;
  }
}

export default function AudioPlayer({ isPlaying, setIsPlaying, currentTrack, setCurrentTrack }) {
  const audioRef = useRef(null);
  // refs to fix double-click race: play() right after load() aborts, and
  // pause event during src switch was resetting isPlaying to false
  const switchingRef = useRef(false);
  const autoplayRef = useRef(false);
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

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
  const [sourceInfo, setSourceInfo] = useState('LOCAL'); // internal only, never shown

  // auto-dismiss error toast so it never blocks the deck
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 3500);
    return () => clearTimeout(t);
  }, [error]);

  // On mount: Option B priority — if public/audio/{slug}.mp3 exists (genuine), use it; else Option A iTunes 30s preview (legal)
  useEffect(() => {
    let cancelled = false;
    async function hydrate() {
      const hydrated = await Promise.all(
        baseTracks.map(async (t) => {
          // 1) Option B: local genuine file in public/audio/{slug}.mp3 — priority if exists
          if (await localExists(t.local)) {
            return { ...t, src: t.local, source: 'LOCAL' };
          }
          // 2) Option A: iTunes Search API — genuine 30s vocal preview (recommended)
          try {
            const itRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(t.query)}&entity=song&limit=5`);
            const itJson = await itRes.json();
            let match = itJson.results?.find(
              (r) => r.previewUrl && r.trackName?.toLowerCase().includes(t.title.toLowerCase()) && r.artistName?.toLowerCase().includes('lana')
            );
            if (!match) {
              match = itJson.results?.find((r) => r.previewUrl && r.artistName?.toLowerCase().includes('lana') && r.previewUrl.includes('audio-ssl'));
            }
            if (match?.previewUrl) {
              return { ...t, src: match.previewUrl, source: 'iTUNES', previewTitle: match.trackName };
            }
          } catch {}

          // 2) Secondary: Deezer (also genuine, CORS *)
          try {
            const dzRes = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(t.query)}`);
            const dzJson = await dzRes.json();
            const found = dzJson.data?.find((x) => x.title.toLowerCase().includes(t.title.toLowerCase()) && x.artist?.name?.toLowerCase().includes('lana')) || dzJson.data?.[0];
            if (found?.preview) {
              return { ...t, src: found.preview, source: 'DEEZER' };
            }
          } catch {}

          // 4) Final fallback: local trimmed stem (guaranteed to exist)
          if (await localExists(t.local)) {
            return { ...t, src: t.local, source: 'LOCAL' };
          }
          if (await localExists(t.fallbackLocal)) {
            return { ...t, src: t.fallbackLocal, source: 'LOCAL' };
          }
          return t;
        })
      );
      if (!cancelled) {
        setTracks(hydrated);
        // update sourceInfo to reflect first track's source
        if (hydrated[0]?.source) setSourceInfo(hydrated[0].source);
      }
    }
    hydrate();
    return () => { cancelled = true; };
  }, []);

  const activeTrack = tracks[trackIndex];
  const displayTitle = currentTrack?.title || activeTrack.title;
  const displayEra = currentTrack?.era || activeTrack.era;
  // custom preview from Timeline (Kill Kill, Ride, etc) wins over deck index
  const effectiveSrc = currentTrack?.src || activeTrack.src;
  const effectiveSource = currentTrack?.source || activeTrack.source || 'LOCAL';

  useEffect(() => {
    if (effectiveSource) setSourceInfo(effectiveSource);
  }, [effectiveSource]);

  useEffect(() => {
    if (!currentTrack) return;
    const base = currentTrack.title.split(' —')[0].trim().toLowerCase();
    // only auto-map to deck index when there's NO custom src (deck songs).
    // custom Timeline previews (Kill Kill etc) keep current index and play their own src.
    if (currentTrack.src) return;
    const idx = tracks.findIndex((t) => t.title.toLowerCase() === base || base.includes(t.title.toLowerCase()) || t.title.toLowerCase().includes(base));
    if (idx !== -1 && idx !== trackIndex) setTrackIndex(idx);
  }, [currentTrack, tracks, trackIndex]);

  // single unified src sync — replaces 2 competing effects that caused glitch.
  // never calls play() immediately after load(); waits for canplay instead.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !effectiveSrc) return;
    const cur = audio.currentSrc || audio.src || '';
    const curTail = cur.split('/').pop()?.split('?')[0];
    const tgtTail = effectiveSrc.split('/').pop()?.split('?')[0];
    const same = curTail === tgtTail || (tgtTail && cur.includes(tgtTail));
    if (!same) {
      switchingRef.current = true;
      // remember intent: if user wanted music, autoplay on canplay
      if (isPlayingRef.current) autoplayRef.current = true;
      audio.src = effectiveSrc;
      audio.load();
      setCurrentTime(0);
    }
  }, [effectiveSrc]);

  // play/pause toggle for SAME src — if src is switching, defer to canplay
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      if (switchingRef.current) {
        autoplayRef.current = true;
        return;
      }
      setError(null);
      const p = audio.play();
      if (p && typeof p.then === 'function') {
        p.catch(() => {
          setError('Tap Play to start — browser blocked autoplay.');
          setIsPlaying(false);
        });
      }
    } else {
      autoplayRef.current = false;
      audio.pause();
    }
  }, [isPlaying, setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

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
    const onCanPlay = () => {
      // src finished loading — if user wanted autoplay (track switch), play once here.
      // this is the fix for "klik 2x": previously play() was called right after
      // load() when data wasn't ready, promise aborted, isPlaying reset to false.
      if (autoplayRef.current) {
        autoplayRef.current = false;
        const p = audio.play();
        if (p && typeof p.then === 'function') {
          p.then(() => {
            switchingRef.current = false;
            setIsPlaying(true);
          }).catch(() => {
            switchingRef.current = false;
            setError('Tap Play to start — browser blocked autoplay.');
            setIsPlaying(false);
          });
        } else {
          switchingRef.current = false;
        }
      } else {
        switchingRef.current = false;
      }
    };
    const onPlaying = () => {
      switchingRef.current = false;
      autoplayRef.current = false;
      setIsPlaying(true);
    };
    const onEnded = () => {
      // auto-next keeps playing without extra click
      autoplayRef.current = true;
      switchingRef.current = true;
      setTrackIndex((i) => {
        const n = (i + 1) % tracks.length;
        setCurrentTrack(tracks[n]);
        return n;
      });
      setCurrentTime(0);
      setIsPlaying(true);
    };
    const onError = () => {
      // try fallbackLocal if current is remote and fails
      const cur = tracks[trackIndex];
      if (cur?.fallbackLocal && !audio.src.includes('/audio/track')) {
        audio.src = cur.fallbackLocal;
        audio.load();
        const p = audio.play();
        if (p) p.catch(() => {
          setError('Audio stream unavailable — try another track.');
          setIsPlaying(false);
        });
        setError('Stream failed — switching to local tape…');
        return;
      }
      setError('Audio stream unavailable — try another track or check connection.');
      setIsPlaying(false);
    };
    const onPlay = () => {
      // ignore programmatic blip during switch; real playing confirmed via onPlaying/canplay
      if (!switchingRef.current) setIsPlaying(true);
    };
    const onPause = () => {
      // ignore transient pause fired by load()/src change — otherwise it kills autoplay
      // and forces the user to click Play twice
      if (switchingRef.current || autoplayRef.current) return;
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [isSeeking, setIsPlaying, setCurrentTrack, tracks, trackIndex]);

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) audioRef.current.currentTime = val;
  };

  const selectAndPlay = (n) => {
    // one-click track switch: flag intent BEFORE changing src so canplay auto-plays.
    // previously setIsPlaying(true) was a no-op when already true, so new src never played.
    autoplayRef.current = true;
    switchingRef.current = true;
    setError(null);
    setCurrentTime(0);
    setTrackIndex(n);
    setCurrentTrack(tracks[n]);
    setIsPlaying(true);
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
        src={activeTrack.src}
        preload="metadata"
        crossOrigin="anonymous"
        playsInline
      />

      <div className={`sm:hidden ${minimized ? 'h-[56px]' : mobileExpanded ? 'h-[248px]' : 'h-[76px]'}`} />
      <div className="hidden h-[150px] sm:block lg:h-[170px]" />

      <div className="fixed inset-x-2 bottom-2 z-50 mx-auto w-full max-w-[520px] sm:bottom-4 sm:max-w-[620px] lg:bottom-6 lg:max-w-[680px]">
        <AnimatePresence>
          {!minimized ? (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="overflow-hidden rounded-xl border border-[#F7F4EB]/10 bg-[#1A1A1A] shadow-[0_16px_40px_rgba(0,0,0,0.35)] dark:border-[#F7F4EB]/10 sm:shadow-[0_20px_48px_rgba(0,0,0,0.4)]"
            >
              <div className="hidden items-center justify-between gap-2 bg-[#22201E] px-2.5 py-1.5 sm:flex sm:px-3">
                <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${isPlaying && !error ? 'bg-brass animate-pulse' : 'bg-cherry'}`} />
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

              <div className="flex items-center gap-2 p-2.5 sm:gap-4 sm:p-4">
                <div className="hidden h-[64px] w-[90px] shrink-0 items-center justify-center gap-1.5 rounded-md border border-white/10 bg-[#2a2a2a] p-2 shadow-inner sm:flex sm:h-[72px] sm:w-[110px] sm:gap-2">
                  <div className={`h-7 w-7 rounded-full border border-white/15 bg-[#1f1f1f] p-0.5 sm:h-8 sm:w-8 ${reelsSpin ? 'animate-tape-reel' : ''}`}>
                    <div className="h-full w-full rounded-full" style={{ background: `repeating-conic-gradient(from 0deg, #3a3a3a 0 45deg, #2a2a2a 45deg 90deg)` }} />
                  </div>
                  <div className="h-1 flex-1 rounded-full bg-white/10" />
                  <div className={`h-7 w-7 rounded-full border border-white/15 bg-[#1f1f1f] p-0.5 sm:h-8 sm:w-8 ${reelsSpin ? 'animate-tape-reel' : ''}`} style={{ animationDirection: 'reverse' }}>
                    <div className="h-full w-full rounded-full" style={{ background: `repeating-conic-gradient(from 0deg, #3a3a3a 0 45deg, #2a2a2a 45deg 90deg)` }} />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-display text-[13px] font-semibold leading-tight text-parchment sm:text-[16px]" title={displayTitle}>
                        {displayTitle}
                      </div>
                      <div className="hidden truncate font-mono text-[10px] tracking-[0.12em] text-brass-light sm:block sm:text-[12px] sm:tracking-[0.15em]">
                        LANA DEL REY • {displayEra}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 sm:hidden">
                        <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                          <div className="absolute left-0 top-0 h-full bg-brass" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="font-mono text-[9px] tabular-nums text-white/40">{formatTime(currentTime)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setMobileExpanded((v) => !v)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 font-mono text-[12px] text-white/70 hover:bg-white/10 active:scale-95 sm:hidden"
                      aria-label={mobileExpanded ? 'Collapse player' : 'Expand player'}
                    >
                      {mobileExpanded ? '▾' : '▴'}
                    </button>
                    <button
                      onClick={() => setMinimized(true)}
                      className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 font-mono text-[10px] text-white/60 hover:bg-white/10 active:scale-95 sm:flex"
                      aria-label="Hide player"
                    >
                      ✕
                    </button>
                  </div>

                  <div className={`mt-2 items-center gap-2 sm:mt-2.5 sm:gap-2.5 ${mobileExpanded ? 'flex' : 'hidden'} sm:flex`}>
                    <span className="font-mono text-[9px] tabular-nums text-parchment/50 sm:text-[10px]">
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
                        className="h-1.5 w-full appearance-none rounded-full bg-white/10 accent-brass [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brass"
                        aria-label="Seek"
                      />
                      <div className="pointer-events-none absolute left-0 h-1.5 rounded-full bg-brass" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="font-mono text-[9px] tabular-nums text-parchment/50 sm:text-[10px]">
                      {duration ? formatTime(duration) : '0:30'}
                    </span>
                  </div>
                </div>

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
                    onClick={() => setIsPlaying(!isPlaying)}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-brass text-noir shadow-md hover:bg-brass-light active:scale-95 sm:h-12 sm:w-12"
                  >
                    <span className="text-[15px] sm:text-[18px]">{isPlaying ? '❚❚' : '▶'}</span>
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
              </div>

              <div className={`items-center gap-2 border-t border-white/5 bg-[#232120] px-3 py-2 sm:gap-3 sm:px-4 ${mobileExpanded ? 'flex' : 'hidden'} sm:flex`}>
                <button
                  onClick={() => setIsMuted((m) => !m)}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-[14px] text-white hover:bg-white/10"
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

              <div className={`border-t border-white/5 bg-[#1f1e1c] px-3 py-2.5 sm:px-4 ${mobileExpanded ? 'block' : 'hidden'} sm:block`}>
                <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] tracking-[0.15em] text-white/40">
                  <span>CHOOSE A TRACK</span>
                  <span className='text-white/20'>8 TRACKS</span>
                </div>
                <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-2">
                  <style>{`[scrollbar-width:none]::-webkit-scrollbar{display:none}`}</style>
                  {tracks.map((t, i) => (
                    <button
                      key={t.title}
                      onClick={() => selectAndPlay(i)}
                      className={`shrink-0 rounded-full border px-3.5 py-2 font-mono text-[11px] tracking-wide transition sm:px-4 sm:text-[12px] ${
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
            </motion.div>
          ) : (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={() => setMinimized(false)}
              className="ml-auto flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-[#1A1A1A]/80 px-3 py-2.5 text-parchment shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-md transition-all duration-300 hover:bg-[#232120]/90 hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)] active:scale-[0.98] dark:border-[#F7F4EB]/10 sm:px-4"
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
