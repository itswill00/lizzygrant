import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryFrames, galleryEras } from '../data/gallery';

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null); // index into filtered

  const filtered = useMemo(
    () => (filter === 'all' ? galleryFrames : galleryFrames.filter((f) => f.era === filter)),
    [filter]
  );

  // keyboard nav for lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((i) => (i + 1) % filtered.length);
      if (e.key === 'ArrowLeft') setLightbox((i) => (i - 1 + filtered.length) % filtered.length);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, filtered.length]);

  const frame = lightbox !== null ? filtered[lightbox] : null;

  return (
    <section id="gallery" className="relative mx-auto max-w-[1400px] overflow-x-hidden px-3 py-8 sm:px-4 sm:py-12 md:px-6 md:py-16">
      <div className="mb-6 sm:mb-8">
        <div className="font-mono text-[10px] tracking-[0.2em] text-cherry sm:text-[11px] sm:tracking-[0.25em]">07 — CONTACT SHEET</div>
        <h2 className="mt-1.5 font-display text-[26px] font-bold leading-none tracking-[-0.02em] text-espresso dark:text-parchment sm:mt-2 sm:text-[34px] md:text-[48px]">
          EVERY FRAME <span className="font-light italic text-typewriter text-[20px] sm:text-[26px] md:text-[34px]">filed & numbered</span>
        </h2>
        <p className="mt-2 max-w-[640px] font-body text-[12.5px] leading-relaxed text-typewriter dark:text-parchment/60 sm:mt-3 sm:text-[13px]">
          The proof prints — {galleryFrames.length} frames from Bowery ballrooms to Dublin, 2011 → 2025.
          Tap any frame for the loupe. Photographs: Wikimedia Commons contributors.
        </p>
      </div>

      {/* era filter */}
      <div className="mb-5 flex flex-wrap gap-1.5 sm:mb-6 sm:gap-2">
        {galleryEras.map((e) => (
          <button
            key={e.id}
            onClick={() => { setFilter(e.id); setLightbox(null); }}
            className={`rounded-full border px-3.5 py-2 font-mono text-[11px] tracking-[0.1em] transition-all duration-300 active:scale-95 ${
              filter === e.id
                ? 'border-cherry bg-cherry text-white shadow-[0_4px_12px_rgba(158,27,27,0.25)]'
                : 'border-[#D4AF37]/20 bg-white text-typewriter hover:bg-[#F7F4EB] dark:border-[#F7F4EB]/10 dark:bg-noir-soft'
            }`}
          >
            {e.label}
          </button>
        ))}
        <span className="ml-auto hidden self-center font-mono text-[10px] tracking-[0.14em] text-typewriter/60 sm:block">
          {filtered.length} FRAMES
        </span>
      </div>

      {/* masonry contact sheet */}
      <motion.div layout className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((f, i) => (
            <motion.figure
              layout
              key={f.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.35 }}
              onClick={() => setLightbox(i)}
              className="group mb-3 break-inside-avoid cursor-pointer rounded-lg border border-[#D4AF37]/15 bg-white p-1.5 pb-2 shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)] dark:border-[#F7F4EB]/10 dark:bg-noir-soft sm:mb-4"
            >
              <div className="relative overflow-hidden rounded-md bg-parchment-dark">
                <img
                  src={f.thumb}
                  alt={`Lana Del Rey — ${f.caption}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute left-1.5 top-1.5 rounded-full bg-black/55 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.12em] text-white backdrop-blur-sm">
                  FR.{String(galleryFrames.indexOf(f) + 1).padStart(2, '0')}
                </span>
              </div>
              <figcaption className="flex items-center justify-between gap-2 px-1 pt-1.5">
                <span className="truncate font-mono text-[9px] tracking-[0.08em] text-typewriter">{f.caption}</span>
                <span className="shrink-0 font-mono text-[9px] font-bold tracking-[0.1em] text-cherry">{f.year}</span>
              </figcaption>
            </motion.figure>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* lightbox loupe */}
      <AnimatePresence>
        {frame && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setLightbox(null)}
              className="fixed inset-0 z-[70] bg-[#1A1A1A]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed inset-x-3 bottom-4 top-4 z-[71] mx-auto flex max-w-[900px] flex-col overflow-hidden rounded-xl border border-[#D4AF37]/20 bg-[#FFFEFB] shadow-[0_20px_60px_rgba(0,0,0,0.4)] dark:border-[#F7F4EB]/10 dark:bg-noir sm:inset-x-6 sm:bottom-8 sm:top-8"
              role="dialog"
              aria-label={`Frame: ${frame.caption}`}
            >
              <div className="relative flex min-h-0 flex-1 items-center justify-center bg-[#1A1A1A] p-3 sm:p-6">
                <img
                  src={frame.full}
                  alt={`Lana Del Rey — ${frame.caption}`}
                  className="max-h-full max-w-full rounded-md object-contain shadow-2xl"
                />
                <button onClick={() => setLightbox(null)} aria-label="Close" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 font-mono text-white backdrop-blur hover:bg-black/70 active:scale-95">
                  ✕
                </button>
                <button onClick={() => setLightbox((lightbox - 1 + filtered.length) % filtered.length)} aria-label="Previous frame" className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 font-mono text-white backdrop-blur hover:bg-black/70 active:scale-95">
                  ←
                </button>
                <button onClick={() => setLightbox((lightbox + 1) % filtered.length)} aria-label="Next frame" className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 font-mono text-white backdrop-blur hover:bg-black/70 active:scale-95">
                  →
                </button>
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 font-mono text-[10px] tracking-[0.15em] text-white backdrop-blur-sm">
                  FRAME {lightbox + 1} / {filtered.length}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <div className="truncate font-display text-[14px] font-bold text-espresso dark:text-parchment sm:text-[16px]">
                    {frame.caption}
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.12em] text-typewriter">
                    {frame.year} • {frame.credit} • CC-BY-SA
                  </div>
                </div>
                <span className="rounded-full bg-cherry px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-white">
                  {frame.year}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
