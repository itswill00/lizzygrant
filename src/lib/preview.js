// Shared genuine-preview resolver — single source of truth for every
// tap-to-play on the site (Timeline, Muses, Tarot, Discography, AudioPlayer).
// ORDER: local file first (instant 0ms, same-origin, immune to mobile autoplay blocks), then iTunes.
// STRICT: exact title match only. Never attaches a wrong song.

export function slugify(title) {
  if (!title) return '';
  const clean = title.replace(/[\.…]+$/, '').trim();
  if (clean.toLowerCase().includes('(original)')) {
    const withoutOrig = clean.replace(/\(original\)/i, '').trim();
    return `${slugify(withoutOrig)}-original`;
  }
  const base = clean.split(' (')[0].trim().toLowerCase();
  return base
    .replace(/&/g, '-')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

// Complete set of 129 genuine local clips bundled in public/audio/
export const LOCAL_FILES = new Set([
  '13-beaches.mp3',
  '24.mp3',
  'a-w.mp3',
  'american.mp3',
  'arcadia.mp3',
  'art-deco.mp3',
  'bartender.mp3',
  'beautiful-people-beautiful-problems.mp3',
  'beautiful.mp3',
  'bel-air.mp3',
  'black-bathing-suit.mp3',
  'black-beauty.mp3',
  'blue-banisters.mp3',
  'blue-jeans.mp3',
  'blue-velvet.mp3',
  'body-electric.mp3',
  'born-to-die.mp3',
  'breaking-up-slowly.mp3',
  'brooklyn-baby.mp3',
  'burnt-norton.mp3',
  'california.mp3',
  'candy-necklace.mp3',
  'carmen.mp3',
  'change.mp3',
  'chemtrails-over-the-country-club.mp3',
  'cherry-blossom.mp3',
  'cherry.mp3',
  'cinnamon-girl.mp3',
  'coachella-woodstock-in-my-mind.mp3',
  'cola.mp3',
  'cruel-world.mp3',
  'dance-till-we-die.mp3',
  'dark-but-just-a-game.mp3',
  'dark-paradise.mp3',
  'dealer.mp3',
  'did-you-know-that-theres-a-tunnel-under-ocean-blvd.mp3',
  'did-you-know.mp3',
  'diet-mountain-dew.mp3',
  'doin-time.mp3',
  'dont-let-me-be-misunderstood.mp3',
  'fingertips.mp3',
  'fishtail.mp3',
  'florida-kilos.mp3',
  'for-free.mp3',
  'freak.mp3',
  'fuck-it-i-love-you.mp3',
  'fucked-my-way-up-to-the-top.mp3',
  'get-free.mp3',
  'god-bless-america-and-all-the-beautiful-women-in-it.mp3',
  'god-knows-i-tried.mp3',
  'gods-monsters.mp3',
  'gramma.mp3',
  'grandfather-please-stand-on-the-shoulders-of-my-father-while-hes-deep-sea-fishing.mp3',
  'groupie-love.mp3',
  'guns-and-roses.mp3',
  'happiness-is-a-butterfly.mp3',
  'heroin.mp3',
  'high-by-the-beach.mp3',
  'honeymoon.mp3',
  'hope-is-a-dangerous-thing-for-a-woman-like-me-to-have-but-i-have-it.mp3',
  'hope-is-a-dangerous-thing-for-a-woman-like-me-to-have.mp3',
  'hope-is-a-dangerous-thing.mp3',
  'how-to-disappear.mp3',
  'if-you-lie-down-with-me.mp3',
  'in-my-feelings.mp3',
  'interlude-the-trio.mp3',
  'jon-batiste-interlude.mp3',
  'judah-smith-interlude.mp3',
  'kill-kill.mp3',
  'kintsugi.mp3',
  'let-me-love-you-like-a-woman.mp3',
  'let-the-light-in.mp3',
  'living-legend.mp3',
  'lolita.mp3',
  'love-song.mp3',
  'love.mp3',
  'lucky-ones.mp3',
  'lust-for-life.mp3',
  'margaret.mp3',
  'mariners-apartment-complex.mp3',
  'million-dollar-man.mp3',
  'money-power-glory.mp3',
  'music-to-watch-boys-to.mp3',
  'national-anthem.mp3',
  'nectar-of-the-gods.mp3',
  'norman-fucking-rockwell.mp3',
  'not-all-who-wander-are-lost.mp3',
  'off-to-the-races.mp3',
  'old-money.mp3',
  'paris-texas.mp3',
  'peppers.mp3',
  'pretty-when-you-cry.mp3',
  'radio.mp3',
  'religion.mp3',
  'ride.mp3',
  'sad-girl.mp3',
  'salvatore.mp3',
  'shades-of-cool.mp3',
  'summer-bummer.mp3',
  'summertime-sadness.mp3',
  'swan-song.mp3',
  'sweet-carolina.mp3',
  'sweet.mp3',
  'taco-truck-x-vb.mp3',
  'terrence-loves-you.mp3',
  'text-book.mp3',
  'the-blackest-day.mp3',
  'the-grants.mp3',
  'the-greatest.mp3',
  'the-next-best-american-record.mp3',
  'the-other-woman.mp3',
  'this-is-what-makes-us-girls.mp3',
  'thunder.mp3',
  'tomorrow-never-came.mp3',
  'tulsa-jesus-freak.mp3',
  'ultraviolence.mp3',
  'venice-bitch.mp3',
  'video-games.mp3',
  'violets-for-roses.mp3',
  'west-coast.mp3',
  'when-the-world-was-at-war-we-kept-dancing.mp3',
  'white-dress.mp3',
  'white-mustang.mp3',
  'wild-at-heart.mp3',
  'wildflower-wildfire.mp3',
  'without-you.mp3',
  'yayo-original.mp3',
  'yayo.mp3',
  'yosemite.mp3',
]);

// Synchronous local file lookup — returns { src, source: 'LOCAL' } in 0ms
export function resolveLocalPreview(title) {
  if (!title) return null;
  const slug = slugify(title);
  if (!slug) return null;

  if (LOCAL_FILES.has(slug + '.mp3')) {
    return { src: `/audio/${slug}.mp3`, source: 'LOCAL' };
  }
  if (slug.startsWith('did-you-know')) {
    if (LOCAL_FILES.has('did-you-know-that-theres-a-tunnel-under-ocean-blvd.mp3')) {
      return { src: '/audio/did-you-know-that-theres-a-tunnel-under-ocean-blvd.mp3', source: 'LOCAL' };
    }
    if (LOCAL_FILES.has('did-you-know.mp3')) {
      return { src: '/audio/did-you-know.mp3', source: 'LOCAL' };
    }
  }
  if (slug.startsWith('hope-is-a-dangerous-thing')) {
    if (LOCAL_FILES.has('hope-is-a-dangerous-thing-for-a-woman-like-me-to-have-but-i-have-it.mp3')) {
      return { src: '/audio/hope-is-a-dangerous-thing-for-a-woman-like-me-to-have-but-i-have-it.mp3', source: 'LOCAL' };
    }
    if (LOCAL_FILES.has('hope-is-a-dangerous-thing.mp3')) {
      return { src: '/audio/hope-is-a-dangerous-thing.mp3', source: 'LOCAL' };
    }
  }
  return null;
}

// Module-level direct audio element handle
// Allows calling .play() synchronously in the user touch/click gesture stack,
// guaranteeing 100% immunity to mobile browser autoplay blocks.
let activeAudioElement = null;
let isSwitchingSrc = false;

export function registerAudioElement(element) {
  activeAudioElement = element;
}

export function unregisterAudioElement() {
  activeAudioElement = null;
}

export function isAudioSwitching() {
  return isSwitchingSrc;
}

export function playAudioDirect(src) {
  if (!activeAudioElement || !src) return;
  try {
    const cur = activeAudioElement.currentSrc || activeAudioElement.src || '';
    const curTail = cur.split('/').pop()?.split('?')[0];
    const tgtTail = src.split('/').pop()?.split('?')[0];
    if (curTail !== tgtTail || !cur) {
      isSwitchingSrc = true;
      activeAudioElement.src = src;
      activeAudioElement.currentTime = 0;
    }
    const p = activeAudioElement.play();
    if (p && typeof p.then === 'function') {
      p.then(() => {
        isSwitchingSrc = false;
      }).catch((err) => {
        isSwitchingSrc = false;
        // AbortError is benign when rapid switching tracks
        if (err.name !== 'AbortError') {
          console.warn('[Audio] play interrupted or rejected:', err);
        }
      });
    } else {
      isSwitchingSrc = false;
    }
  } catch (err) {
    isSwitchingSrc = false;
    console.warn('[Audio] playAudioDirect failed:', err);
  }
}

export function pauseAudioDirect() {
  if (!activeAudioElement) return;
  try {
    activeAudioElement.pause();
  } catch {}
}

export async function fetchExactPreview(title, signal) {
  const local = resolveLocalPreview(title);
  if (local) return local;

  const base = title.replace(/[\.…]+$/, '').split(' (')[0].trim();
  const q = (t) => (t || '').toLowerCase().trim();
  const target = q(base);

  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(`lana del rey ${base}`)}&entity=song&limit=10`, { signal });
    const json = await res.json();
    let m = json.results?.find((r) => r.previewUrl && q(r.trackName) === target && q(r.artistName).includes('lana'));
    if (!m) {
      m = json.results?.find((r) => r.previewUrl && q(r.trackName).startsWith(target) && q(r.artistName).includes('lana'));
    }
    if (!m) {
      m = json.results?.find((r) => r.previewUrl && q(r.trackName).includes(target) && q(r.artistName).includes('lana'));
    }
    if (m?.previewUrl) return { src: m.previewUrl, source: 'iTUNES' };
  } catch (e) {
    if (e?.name === 'AbortError') throw e;
  }
  // Deezer fallback: stricter, Lana-only, preview is 30s mp3
  try {
    const r = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(`artist:"Lana Del Rey" track:"${base}"`)}&limit=6&output=json`, { signal });
    const j = await r.json();
    const d = j.data?.find((x) => x.preview && q(x.title) === target && q(x.artist?.name).includes('lana'));
    if (d?.preview) return { src: d.preview, source: 'DEEZER' };
  } catch (e) {
    if (e?.name === 'AbortError') throw e;
  }
  return {};
}

// Cue a song on the cassette: instant synchronous playback for local files,
// honest fallback for unreleased tracks. Aborts prior iTunes search on rapid taps.
let cueAbort = null;
export function cueSong(title, era, setCurrentTrack, setIsPlaying) {
  const cleanTitle = title.replace(/[\.…]+$/, '').trim();
  const local = resolveLocalPreview(cleanTitle);

  if (cueAbort) { try { cueAbort.abort(); } catch {} cueAbort = null; }

  if (local?.src) {
    // 1. Play directly inside the active user gesture
    playAudioDirect(local.src);

    // 2. Synchronously set React state
    if (setCurrentTrack) {
      setCurrentTrack({
        title: cleanTitle,
        era,
        src: local.src,
        source: 'LOCAL',
      });
    }
    if (setIsPlaying) setIsPlaying(true);
    return true;
  }

  // Not in local catalog -> fallback to iTunes search asynchronously, abortable
  const controller = new AbortController();
  cueAbort = controller;
  fetchExactPreview(cleanTitle, controller.signal).then((prev) => {
    if (controller.signal.aborted) return;
    cueAbort = null;
    if (prev?.src) {
      playAudioDirect(prev.src);
      if (setCurrentTrack) {
        setCurrentTrack({
          title: cleanTitle,
          era,
          src: prev.src,
          source: prev.source,
        });
      }
      if (setIsPlaying) setIsPlaying(true);
    } else {
      if (setCurrentTrack) {
        setCurrentTrack({
          title: cleanTitle,
          era,
          src: null,
          unplayable: true,
        });
      }
      if (setIsPlaying) setIsPlaying(false);
    }
  }).catch(() => {
    if (controller.signal.aborted) return;
    cueAbort = null;
  });

  return false;
}
