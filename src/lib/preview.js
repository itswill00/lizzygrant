// Shared audio resolver — single source of truth for every tap-to-play
// on the site (Timeline, Muses, Tarot, Discography, AudioPlayer).
//
// ORDER: iTunes Search API -> Deezer -> unplayable.
// No bundled audio ships with this repo. Everything streams from the rights
// holders' own preview endpoints.
//
// MATCHING IS STRICT: a track only plays if the title genuinely matches.
// A wrong song is worse than no song.

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

// ---------------------------------------------------------------------------
// Title normalisation
// ---------------------------------------------------------------------------

const DASHES = /[\u2010-\u2015\u2212]/g;

// Strips the noise that differs between our tracklist and store metadata:
// featured-artist credits, remaster/edition tags, punctuation, diacritics.
export function normTitle(raw) {
  if (!raw) return '';
  return raw
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(DASHES, '-')
    .replace(/[\u2018\u2019\u0060\u00b4]/g, "'")
    .toLowerCase()
    .replace(/\s*[([][^)\]]*\b(?:feat|ft|featuring|with)\b[^)\]]*[)\]]/g, '')
    .replace(/\s+-\s+(?:feat|ft|featuring)\.?.*$/, '')
    .replace(/\s*[([][^)\]]*\b(?:remaster(?:ed)?|deluxe|bonus|explicit|radio edit|single version|album version)\b[^)\]]*[)\]]/g, '')
    .replace(/\s+-\s+(?:remaster(?:ed)?|deluxe|bonus track|explicit|radio edit|single version|album version)\b.*$/, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9*' ]+/g, ' ')
    .replace(/'/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Store metadata sometimes censors profanity ("F****d My Way Up to the Top").
// Turn asterisk runs into wildcards so they still match the real title.
function titleRegex(normalised) {
  const escaped = normalised.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('^' + escaped.replace(/\\\*+/g, '[a-z]*') + '$');
}

function isLanaArtist(artistName) {
  const a = (artistName || '').toLowerCase();
  // A Lana Del Rey release — not a feature credit on someone else's track.
  return /^lana del rey\b/.test(a);
}

// Exact-after-normalisation only. No "startsWith" fuzziness: that is what
// previously let "Cherry" resolve to "Cherry Blossom".
export function pickMatch(results, baseTitle) {
  const target = normTitle(baseTitle);
  if (!target) return null;
  const targetRe = titleRegex(target);

  const scored = (results || [])
    .filter((r) => r && r.previewUrl && isLanaArtist(r.artistName))
    .map((r) => {
      const cand = normTitle(r.trackName);
      if (!cand) return null;
      if (cand === target) return { r, score: 3 };
      if (titleRegex(cand).test(target)) return { r, score: 2 }; // censored metadata
      if (targetRe.test(cand)) return { r, score: 2 };
      return null;
    })
    .filter(Boolean);

  if (!scored.length) return null;
  scored.sort((a, b) => b.score - a.score);
  return scored[0].r;
}

// ---------------------------------------------------------------------------
// Network plumbing: one request per track, memoised, with backoff.
// ---------------------------------------------------------------------------

const streamPreviewCache = new Map(); // normalised title -> { src, source, full }
const inflight = new Map();
const CACHE_KEY = 'lg.preview.v3';

// Warm from sessionStorage so a reload doesn't re-hit the APIs
// (iTunes rate-limits hard after ~50 requests).
try {
  const raw = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(CACHE_KEY);
  if (raw) for (const [k, v] of Object.entries(JSON.parse(raw))) streamPreviewCache.set(k, v);
} catch {}

let persistTimer = null;
function persist() {
  if (persistTimer) return;
  persistTimer = setTimeout(() => {
    persistTimer = null;
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(streamPreviewCache)));
    } catch {}
  }, 400);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, signal, timeoutMs = 8000) {
  const ctrl = new AbortController();
  let timedOut = false;
  const onAbort = () => ctrl.abort();
  if (signal) {
    if (signal.aborted) throw Object.assign(new Error('aborted'), { name: 'AbortError' });
    signal.addEventListener('abort', onAbort, { once: true });
  }
  const timer = setTimeout(() => { timedOut = true; ctrl.abort(); }, timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (res.status === 403 || res.status === 429) {
      const err = new Error('rate-limited');
      err.rateLimited = true;
      throw err;
    }
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const text = await res.text();
    if (!text.trim().startsWith('{')) throw new Error('non-json response');
    return JSON.parse(text);
  } catch (e) {
    // A timeout is a retryable transport failure, not a user cancellation.
    if (timedOut && e && e.name === 'AbortError') {
      throw Object.assign(new Error('timeout'), { timedOut: true });
    }
    throw e;
  } finally {
    clearTimeout(timer);
    if (signal) signal.removeEventListener('abort', onAbort);
  }
}

async function itunesQuery(params, signal) {
  const qs = Object.entries(params).map(([k, v]) => k + '=' + encodeURIComponent(v)).join('&');
  const json = await fetchJson('https://itunes.apple.com/search?' + qs, signal);
  return json.results || [];
}

// Try the album first (fastest, most precise), then fall back to a title search.
async function lookupItunes(base, albumHint, signal) {
  if (albumHint) {
    const byAlbum = await withRetry(
      () => itunesQuery({ term: 'lana del rey ' + albumHint, entity: 'song', attribute: 'albumTerm', limit: 50, country: 'US' }, signal),
      signal
    );
    const hit = pickMatch(byAlbum, base);
    if (hit) return hit;
  }
  const byTitle = await withRetry(
    () => itunesQuery({ term: 'lana del rey ' + base, entity: 'song', limit: 25, country: 'US' }, signal),
    signal
  );
  return pickMatch(byTitle, base);
}

async function lookupDeezer(base, albumHintDeezer, signal) {
  // Deezer's text search is unreliable for short titles ("Cola" returns
  // unrelated songs). When we know the album, resolve the album first and
  // read its tracklist — that path is exact.
  if (albumHintDeezer) {
    const albums = await withRetry(
      () => fetchJson('https://api.deezer.com/search/album?q=' + encodeURIComponent('lana del rey ' + albumHintDeezer) + '&limit=10', signal),
      signal
    );
    const album = (albums.data || []).find(
      (a) => a.artist && /^lana del rey\b/i.test(a.artist.name) && normTitle(a.title) === normTitle(albumHintDeezer)
    ) || (albums.data || []).find(
      (a) => a.artist && /^lana del rey\b/i.test(a.artist.name) && normTitle(a.title).includes(normTitle(albumHintDeezer))
    );

    if (album) {
      const full = await withRetry(() => fetchJson('https://api.deezer.com/album/' + album.id, signal), signal);
      const tracks = (full.tracks && full.tracks.data ? full.tracks.data : []).map((t) => ({
        trackName: t.title,
        artistName: (t.artist && t.artist.name) || (album.artist && album.artist.name),
        previewUrl: t.preview,
      }));
      const hit = pickMatch(tracks, base);
      if (hit) return hit;
    }
  }

  const json = await withRetry(
    () => fetchJson('https://api.deezer.com/search?q=' + encodeURIComponent('lana del rey ' + base) + '&limit=25', signal),
    signal
  );
  const results = (json.data || []).map((d) => ({
    trackName: d.title,
    artistName: d.artist && d.artist.name,
    previewUrl: d.preview,
  }));
  return pickMatch(results, base);
}

async function withRetry(fn, signal) {
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (signal && signal.aborted) throw Object.assign(new Error('aborted'), { name: 'AbortError' });
    try {
      return await fn();
    } catch (e) {
      if (e && e.name === 'AbortError') throw e;
      lastErr = e;
      await sleep((e && e.rateLimited ? 900 : 350) * Math.pow(2, attempt));
    }
  }
  throw lastErr;
}

// Official places to hear the full song. We link out instead of proxying
// audio we have no right to serve.
export function fullSongLinks(title, artist) {
  const q = encodeURIComponent((artist || 'Lana Del Rey') + ' ' + title);
  return {
    spotify: 'https://open.spotify.com/search/' + q,
    youtube: 'https://www.youtube.com/results?search_query=' + q,
    apple: 'https://music.apple.com/us/search?term=' + q,
  };
}

// Canonical base title for lookups. Do NOT truncate at " (" here: that would
// turn "Burnt Norton (Interlude)" into "Burnt Norton". normTitle() already
// strips featured-artist and edition suffixes.
function baseTitle(raw) {
  return (raw || '').replace(/[\.…]+$/, '').trim();
}

/**
 * Resolve a playable preview URL for a track.
 * @param {string} title
 * @param {AbortSignal} [signal]
 * @param {string} [albumHint] album title, improves disambiguation
 * @returns {Promise<{src?: string, source?: string, unplayable?: boolean}>}
 */
export async function fetchExactPreview(title, signal, albumHint) {
  if (!title) return { unplayable: true };
  const base = baseTitle(title);
  const key = normTitle(base);
  if (!key) return { unplayable: true };

  if (streamPreviewCache.has(key)) return streamPreviewCache.get(key);

  // Collapse concurrent requests for the same track.
  if (inflight.has(key)) return inflight.get(key);

  const task = (async () => {
    const providers = [
      { name: 'iTUNES', run: () => lookupItunes(base, albumHint, signal) },
      { name: 'DEEZER', run: () => lookupDeezer(base, albumHint, signal) },
    ];

    for (const provider of providers) {
      try {
        const hit = await provider.run();
        if (hit) {
          const match = { src: hit.previewUrl, source: provider.name };
          streamPreviewCache.set(key, match);
          persist();
          return match;
        }
      } catch (e) {
        if (e && e.name === 'AbortError') throw e;
        console.warn('[Audio] ' + provider.name + ' lookup failed for "' + base + '"', e);
      }
    }

    const miss = { unplayable: true };
    streamPreviewCache.set(key, miss);
    persist();
    return miss;
  })();

  inflight.set(key, task);
  try {
    return await task;
  } finally {
    inflight.delete(key);
  }
}

// ---------------------------------------------------------------------------
// Direct playback against a single module-level <audio> element.
// Lets us call .play() synchronously inside the user gesture, which keeps
// mobile browsers from blocking playback.
// ---------------------------------------------------------------------------

let activeAudioElement = null;
let isSwitchingSrc = false;
let audioErrorHandler = null;

export function setAudioErrorHandler(fn) { audioErrorHandler = fn; }

function reportAudioError(msg) {
  console.warn('[Audio]', msg);
  if (audioErrorHandler) { try { audioErrorHandler(msg); } catch {} }
}

export function registerAudioElement(element) { activeAudioElement = element; }
export function unregisterAudioElement() { activeAudioElement = null; }
export function isAudioSwitching() { return isSwitchingSrc; }

function tail(src) {
  return (src || '').split('/').pop()?.split('?')[0];
}

export function playAudioDirect(src) {
  if (!activeAudioElement || !src) {
    reportAudioError(!activeAudioElement ? 'No audio element, tap again' : 'No src for ' + src);
    return;
  }
  const audio = activeAudioElement;
  try {
    const cur = audio.currentSrc || audio.src || '';
    if (tail(cur) !== tail(src) || !cur) {
      isSwitchingSrc = true;
      audio.src = src;
      try { audio.load(); } catch {}
      try { audio.currentTime = 0; } catch {}
    }
    const p = audio.play();
    if (p && typeof p.then === 'function') {
      p.then(() => { isSwitchingSrc = false; })
        .catch((err) => {
          isSwitchingSrc = false;
          if (err.name === 'NotAllowedError') {
            reportAudioError('Tap again to allow audio, browser blocked autoplay');
          } else if (err.name === 'AbortError') {
            // benign: a newer tap superseded this one
          } else {
            reportAudioError('Play failed (' + err.name + '): ' + tail(src));
          }
        });
    } else {
      isSwitchingSrc = false;
    }
  } catch (err) {
    isSwitchingSrc = false;
    reportAudioError('Play error: ' + (err.message || err));
  }
}

export function pauseAudioDirect() {
  if (!activeAudioElement) return;
  try { activeAudioElement.pause(); } catch {}
}

// ---------------------------------------------------------------------------
// Cue a song on the cassette deck.
// ---------------------------------------------------------------------------

let cueAbort = null;

/**
 * @returns {boolean} true when playback started synchronously (cache hit).
 */
export function cueSong(title, era, setCurrentTrack, setIsPlaying, albumHint) {
  const cleanTitle = (title || '').replace(/[\.…]+$/, '').trim();
  if (!cleanTitle) return false;

  if (cueAbort) { try { cueAbort.abort(); } catch {} cueAbort = null; }

  const key = normTitle(baseTitle(cleanTitle));
  const cached = streamPreviewCache.get(key);

  if (cached && cached.src) {
    // 1. Start inside the active user gesture.
    playAudioDirect(cached.src);
    // 2. Synchronously update React state.
    if (setCurrentTrack) {
      setCurrentTrack({
        title: cleanTitle,
        era,
        src: cached.src,
        source: cached.source,
        fullLinks: fullSongLinks(cleanTitle),
      });
    }
    if (setIsPlaying) setIsPlaying(true);
    return true;
  }

  if (cached && cached.unplayable) {
    if (setCurrentTrack) {
      setCurrentTrack({ title: cleanTitle, era, src: null, unplayable: true, fullLinks: fullSongLinks(cleanTitle) });
    }
    if (setIsPlaying) setIsPlaying(false);
    return false;
  }

  // Cold lookup — async, abortable so rapid taps don't race.
  const controller = new AbortController();
  cueAbort = controller;

  if (setCurrentTrack) {
    setCurrentTrack({ title: cleanTitle, era, src: null, loading: true, fullLinks: fullSongLinks(cleanTitle) });
  }

  fetchExactPreview(cleanTitle, controller.signal, albumHint)
    .then((prev) => {
      if (controller.signal.aborted) return;
      cueAbort = null;
      if (prev && prev.src) {
        playAudioDirect(prev.src);
        if (setCurrentTrack) {
          setCurrentTrack({
            title: cleanTitle,
            era,
            src: prev.src,
            source: prev.source,
            fullLinks: fullSongLinks(cleanTitle),
          });
        }
        if (setIsPlaying) setIsPlaying(true);
      } else {
        if (setCurrentTrack) {
          setCurrentTrack({ title: cleanTitle, era, src: null, unplayable: true, fullLinks: fullSongLinks(cleanTitle) });
        }
        if (setIsPlaying) setIsPlaying(false);
      }
    })
    .catch(() => {
      if (controller.signal.aborted) return;
      cueAbort = null;
    });

  return false;
}
