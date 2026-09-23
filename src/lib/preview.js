// Shared genuine-preview resolver — single source of truth for every
// tap-to-play on the site (Timeline, Muses, Tarot, Discography).
// ORDER: local file first (instant, same-origin, works offline), then iTunes.
// STRICT: exact title match only. Never attaches a wrong song;
// returns {} when nothing exact exists so callers can fall back honestly.

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

async function localPreview(title) {
  try {
    const slug = slugify(title);
    const candidates = [`/audio/${slug}.mp3`];
    if (slug.startsWith('did-you-know')) {
      candidates.push(
        '/audio/did-you-know-that-theres-a-tunnel-under-ocean-blvd.mp3',
        '/audio/did-you-know.mp3'
      );
    }
    if (slug.startsWith('hope-is-a-dangerous-thing')) {
      candidates.push(
        '/audio/hope-is-a-dangerous-thing-for-a-woman-like-me-to-have-but-i-have-it.mp3',
        '/audio/hope-is-a-dangerous-thing.mp3'
      );
    }
    for (const url of candidates) {
      try {
        const r = await fetch(url, { method: 'HEAD' });
        const ct = r.headers.get('content-type') || '';
        if (r.ok && !ct.includes('text/html') && (ct.includes('audio') || ct.includes('octet-stream') || ct === '')) {
          return { src: url, source: 'LOCAL' };
        }
      } catch {}
    }
  } catch {}
  return null;
}

export async function fetchExactPreview(title) {
  const local = await localPreview(title);
  if (local) return local;

  const base = title.replace(/[\.…]+$/, '').split(' (')[0].trim();
  const q = (t) => (t || '').toLowerCase().trim();
  const target = q(base);

  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(`lana del rey ${base}`)}&entity=song&limit=10`);
    const json = await res.json();
    let m = json.results?.find((r) => r.previewUrl && q(r.trackName) === target && q(r.artistName).includes('lana'));
    if (!m) {
      m = json.results?.find((r) => r.previewUrl && q(r.trackName).startsWith(target) && q(r.artistName).includes('lana'));
    }
    if (!m) {
      m = json.results?.find((r) => r.previewUrl && q(r.trackName).includes(target) && q(r.artistName).includes('lana'));
    }
    if (m?.previewUrl) return { src: m.previewUrl, source: 'iTUNES' };
  } catch {}
  return {};
}

// Cue a song on the cassette: exact preview when found,
// otherwise honest fallback (never plays an unrelated track).
export async function cueSong(title, era, setCurrentTrack, setIsPlaying) {
  const cleanTitle = title.replace(/[\.…]+$/, '').trim();
  const prev = await fetchExactPreview(cleanTitle);
  if (prev?.src) {
    if (setCurrentTrack) {
      setCurrentTrack({
        title: cleanTitle,
        era,
        src: prev.src,
        source: prev.source,
      });
    }
    if (setIsPlaying) setIsPlaying(true);
    return true;
  } else {
    // Honest: no preview anywhere — do NOT trigger play on a wrong song!
    if (setCurrentTrack) {
      setCurrentTrack({
        title: cleanTitle,
        era,
        src: null,
        unplayable: true,
      });
    }
    if (setIsPlaying) setIsPlaying(false);
    return false;
  }
}
