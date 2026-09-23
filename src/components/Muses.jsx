import { motion } from 'framer-motion';
import { muses } from '../data/muses';

async function fetchPreviewFor(songTitle) {
  const clean = songTitle.split('(')[0].trim();
  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(`lana del rey ${clean}`)}&entity=song&limit=5`);
    const json = await res.json();
    let m = json.results?.find((r) => r.previewUrl && r.artistName?.toLowerCase().includes('lana'));
    if (m?.previewUrl) return { src: m.previewUrl, source: 'iTUNES' };
  } catch {}
  try {
    const dz = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(`Lana Del Rey ${clean}`)}`);
    const dj = await dz.json();
    const f = dj.data?.[0];
    if (f?.preview) return { src: f.preview, source: 'DEEZER' };
  } catch {}
  return {};
}

export default function Muses({ setCurrentTrack, setIsPlaying }) {
  const playSong = async (song) => {
    const prev = await fetchPreviewFor(song);
    if (setCurrentTrack) {
      setCurrentTrack({
        title: `${song} — MUSES`,
        era: 'MUSES & LOVERS',
        ...(prev.src ? { src: prev.src, source: prev.source } : {}),
      });
    }
    if (setIsPlaying) setIsPlaying(true);
  };

  const scrollEras = () => document.querySelector('#timeline')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="muses" className="relative mx-auto max-w-[1400px] overflow-x-hidden px-3 py-8 sm:px-4 sm:py-12 md:px-6 md:py-16">
      <div className="mb-6 sm:mb-8">
        <div className="font-mono text-[10px] tracking-[0.2em] text-cherry sm:text-[11px] sm:tracking-[0.25em]">05 — MUSES & LOVERS</div>
        <h2 className="mt-1.5 font-display text-[26px] font-bold leading-none tracking-[-0.02em] text-espresso dark:text-parchment sm:mt-2 sm:text-[34px] md:text-[48px]">
          EVERY LOVE <span className="font-light italic text-typewriter text-[20px] sm:text-[26px] md:text-[34px]">left a song</span>
        </h2>
        <p className="mt-2 max-w-[640px] font-body text-[14.5px] leading-[1.75] text-typewriter dark:text-parchment/60 sm:mt-3 sm:text-[15px]">
          Public chapters only, told with care. Song links are <em className="text-espresso dark:text-parchment">fan readings</em> —
          where listeners hear a relationship inside the music — never stated as fact. Tap a song to hear it.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {muses.map((m, idx) => (
          <motion.article
            key={m.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: (idx % 3) * 0.06 }}
            whileHover={{ y: -4 }}
            className="group relative flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#D4AF37]/15 bg-white shadow-[0_6px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] dark:border-[#F7F4EB]/10 dark:bg-noir-soft"
          >
            <div className="flex items-center gap-3 p-3.5 sm:p-4">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-[13px] font-bold tracking-widest text-white shadow-md"
                style={{ background: m.color }}
              >
                {m.initials}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-display text-[15px] font-bold leading-tight text-espresso dark:text-parchment sm:text-[16px]">
                  {m.name}
                </h3>
                <div className="mt-0.5 truncate font-mono text-[10px] tracking-[0.1em] text-typewriter">
                  {m.years} • {m.role}
                </div>
              </div>
            </div>

            <div className="px-3.5 sm:px-4">
              <button
                onClick={scrollEras}
                className="rounded-full border border-[#D4AF37]/20 bg-parchment/60 px-2.5 py-1 font-mono text-[9px] tracking-[0.14em] text-typewriter transition hover:bg-[#F7F4EB] hover:text-espresso dark:border-[#F7F4EB]/10 dark:bg-white/5"
              >
                ERA: {m.era.toUpperCase()} →
              </button>
            </div>

            <p className="flex-1 px-3.5 pt-2.5 font-body text-[14px] leading-[1.75] text-typewriter dark:text-parchment/70 sm:px-4 sm:text-[15px]">
              {m.story}
            </p>

            <div className="p-3.5 sm:p-4">
              <div className="font-mono text-[9px] tracking-[0.18em] text-typewriter/70">SONGS WHISPERED ABOUT • FAN READING</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {m.songs.map((s) => (
                  <button
                    key={s}
                    onClick={() => playSong(s)}
                    className="group/song flex items-center gap-1.5 rounded-full border border-[#D4AF37]/20 bg-white px-3 py-1.5 font-mono text-[11px] tracking-wide text-espresso shadow-sm transition-all duration-300 hover:border-cherry/40 hover:shadow-md active:scale-95 dark:border-[#F7F4EB]/10 dark:bg-noir dark:text-parchment/80"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-espresso text-[8px] text-white transition group-hover/song:bg-cherry dark:bg-parchment dark:text-noir">▶</span>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
