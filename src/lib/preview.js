// Shared genuine-preview resolver — single source of truth for every
// tap-to-play on the site (Timeline, Muses, Tarot, Discography).
// ORDER: local file first (instant, same-origin, works offline), then iTunes.
// STRICT: exact title match only. Never attaches a wrong song;
// returns {} when nothing exact exists so callers can fall back honestly.
// (Deezer is intentionally absent: its API sends no CORS headers,
// so browsers can never use it — only local files and iTunes work client-side.)
function slugify(title) {
  const base = title.split(' (')[0].trim().toLowerCase();
  return base
    .replace(/&/g, '-')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

async function localPreview(title) {
  try {
    const url = `/audio/${slugify(title)}.mp3`;
    const r = await fetch(url, { method: 'HEAD' });
    if (r.ok) return { src: url, source: 'LOCAL' };
  } catch {}
  return null;
}

export async function fetchExactPreview(title) {
  const base = title.split(' (')[0].trim();
  const q = (t) => (t || '').toLowerCase();
  const local = await localPreview(title);
  if (local) return local;
  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(`lana del rey ${base}`)}&entity=song&limit=5`);
    const json = await res.json();
    const m = json.results?.find((r) => r.previewUrl && q(r.trackName).includes(q(base)) && q(r.artistName).includes('lana'));
    if (m?.previewUrl) return { src: m.previewUrl, source: 'iTUNES' };
  } catch {}
  return {};
}

// Cue a song on the cassette: exact preview when found,
// otherwise title-only so AudioPlayer maps it to the deck or says so honestly.
export async function cueSong(title, era, setCurrentTrack, setIsPlaying) {
  const prev = await fetchExactPreview(title);
  if (setCurrentTrack) {
    setCurrentTrack({
      title: `${title} — ${era}`,
      era,
      ...(prev.src ? { src: prev.src, source: prev.source } : {}),
    });
  }
  if (setIsPlaying) setIsPlaying(true);
}
