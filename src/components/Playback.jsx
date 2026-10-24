import { useEffect, useState, useSyncExternalStore } from 'react';
import { cueSong, fullSongLinks } from '../lib/preview';

// ---------------------------------------------------------------------------
// Shared progress store. AudioPlayer publishes; every track row subscribes.
// Kept tiny and module-level so we don't have to lift state through App.
// ---------------------------------------------------------------------------
let progressSnapshot = { currentTime: 0, duration: 0 };
const progressListeners = new Set();

export function publishProgress(currentTime, duration) {
  if (progressSnapshot.currentTime === currentTime && progressSnapshot.duration === duration) return;
  progressSnapshot = { currentTime, duration };
  for (const fn of progressListeners) fn();
}

export function useProgress() {
  return useSyncExternalStore(
    (cb) => {
      progressListeners.add(cb);
      return () => progressListeners.delete(cb);
    },
    () => progressSnapshot,
    () => progressSnapshot
  );
}

// Shared per-track playback state. Every track row on the site asks this hook
// "am I the one playing?" so a tap gives instant feedback instead of leaving
// the user guessing during the 1-3s lookup.
export function useTrackState(currentTrack, isPlaying) {
  const activeTitle = currentTrack?.title || null;

  const stateFor = (title) => {
    if (!activeTitle) return 'idle';
    if (!sameTrack(activeTitle, title)) return 'idle';
    if (currentTrack?.loading) return 'loading';
    if (currentTrack?.unplayable) return 'unplayable';
    return isPlaying ? 'playing' : 'paused';
  };

  return stateFor;
}

// Track titles arrive decorated differently per surface ("Ride",
// "Ride / Paradise (2012)", "A&W"), so compare on the normalised base.
function sameTrack(a, b) {
  if (!a || !b) return false;
  const norm = (s) =>
    String(s)
      .split('/')[0]
      .replace(/[\.…]+$/, '')
      .replace(/\(.*?\)/g, '')
      .trim()
      .toLowerCase();
  return norm(a) === norm(b);
}

// Three bars that dance while a track plays, stay still when paused.
export function Equalizer({ active, paused, className = '' }) {
  if (!active) return null;
  return (
    <span
      className={`inline-flex items-end gap-[2px] ${className}`}
      aria-hidden="true"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[2px] rounded-full bg-current"
          style={{
            height: '100%',
            transformOrigin: 'bottom',
            animation: paused ? 'none' : `eq-bar 900ms ease-in-out ${i * 140}ms infinite alternate`,
            transform: paused ? 'scaleY(0.35)' : undefined,
          }}
        />
      ))}
    </span>
  );
}

// The one thing the old UI never said out loud: these are 30-second clips.
// After the clip ends, offer the full song instead of silently stopping.
export function PreviewNotice({ currentTrack, isPlaying, duration, currentTime, onFullSong }) {
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    setEnded(false);
  }, [currentTrack?.src]);

  useEffect(() => {
    if (!duration || !currentTime) return;
    setEnded(currentTime >= duration - 0.35);
  }, [currentTime, duration]);

  if (!currentTrack || currentTrack.unplayable) return null;

  const links = currentTrack.fullLinks || fullSongLinks(currentTrack.title);

  return (
    <div className="mx-auto mt-2 flex max-w-[560px] items-center justify-center gap-2 px-2 text-center">
      {ended ? (
        <a
          href={links.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-brass px-3 py-1 font-mono text-[10px] tracking-[0.12em] text-noir shadow-sm transition hover:bg-brass-light active:scale-95"
        >
          CLIP ENDED · FULL SONG →
        </a>
      ) : (
        <span className="font-mono text-[9px] tracking-[0.14em] text-zinc-500/70 dark:text-parchment/40">
          30-SECOND PREVIEW · FULL SONG BELOW
        </span>
      )}
    </div>
  );
}

// A play affordance that reflects loading / playing / paused / unavailable.
export function PlayGlyph({ state, size = 'sm' }) {
  const base = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-8 w-8 text-[11px]';
  if (state === 'loading') {
    return (
      <span className={`flex shrink-0 items-center justify-center rounded-full bg-cherry/15 text-cherry ${base}`}>
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-cherry/30 border-t-cherry" />
      </span>
    );
  }
  if (state === 'unplayable') {
    return (
      <span className={`flex shrink-0 items-center justify-center rounded-full bg-zinc-500/10 text-zinc-500 ${base}`} title="No preview available">
        ✕
      </span>
    );
  }
  if (state === 'playing' || state === 'paused') {
    return (
      <span className={`flex shrink-0 items-center justify-center rounded-full bg-cherry text-white ${base}`}>
        <Equalizer active paused={state === 'paused'} className="h-2.5 w-2.5 text-white" />
      </span>
    );
  }
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-espresso/[0.06] text-espresso transition group-hover:bg-cherry group-hover:text-white dark:bg-white/10 dark:text-parchment ${base}`}>
      ▶
    </span>
  );
}

// Thin rule under a track row that fills while that track plays.
export function TrackProgress({ state, progress }) {
  if (state !== 'playing' && state !== 'paused') return null;
  return (
    <span className="absolute inset-x-2 bottom-0 h-[2px] overflow-hidden rounded-full bg-cherry/10">
      <span
        className="block h-full rounded-full bg-cherry/70"
        style={{ width: `${Math.max(0, Math.min(100, progress * 100))}%` }}
      />
    </span>
  );
}
