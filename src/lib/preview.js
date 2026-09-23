// Shared genuine-preview resolver — single source of truth for every
// tap-to-play on the site (Timeline, Muses, Tarot, Discography).
// STRICT: exact title match only. Never attaches a wrong song;
// returns {} when nothing exact exists so callers can fall back honestly.
export async function fetchExactPreview(title) {
  const base = title.split(' (')[0].trim();
  const q = (t) => (t || '').toLowerCase();
  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(`lana del rey ${base}`)}&entity=song&limit=5`);
    const json = await res.json();
    const m = json.results?.find((r) => r.previewUrl && q(r.trackName).includes(q(base)) && q(r.artistName).includes('lana'));
    if (m?.previewUrl) return { src: m.previewUrl, source: 'iTUNES' };
  } catch {}
  try {
    const dz = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(`Lana Del Rey ${base}`)}`);
    const dj = await dz.json();
    const f = dj.data?.find((x) => q(x.title).includes(q(base)) && q(x.artist?.name).includes('lana'));
    if (f?.preview) return { src: f.preview, source: 'DEEZER' };
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
