import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { vaultItems } from '../data/vault';

export default function Vault() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="vault" className="relative overflow-x-hidden bg-espresso/[0.02] py-8 dark:bg-parchment/[0.02] sm:py-12 md:py-16">
      <div className="absolute left-0 right-0 top-0 h-2 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,#22201E_10px,#22201E_11px)] opacity-5 dark:opacity-10 sm:h-3" />

      <div className="mx-auto max-w-[1400px] px-3 sm:px-4 md:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="font-mono text-[10px] tracking-[0.2em] text-cherry sm:text-[11px] sm:tracking-[0.25em]">03 — SECRET VAULT</div>
            <h2 className="mt-1.5 font-display text-[26px] font-bold leading-none tracking-[-0.02em] text-espresso dark:text-parchment sm:mt-2 sm:text-[34px] md:text-[48px]">
              UNRELEASED <span className="font-light italic text-typewriter"> & LORE</span>
              <span className="ml-1.5 align-super rounded-full border border-cherry px-1.5 py-0.5 font-mono text-[8px] tracking-[0.15em] text-cherry sm:ml-2 sm:px-2 sm:text-[10px] sm:tracking-[0.2em]">{vaultItems.length} FILES</span>
            </h2>
            <p className="mt-2 max-w-[560px] font-body text-[12.5px] leading-relaxed text-typewriter dark:text-parchment/60 sm:mt-3 sm:text-[13px]">
              Archival case files — cassette tapes, poetry broadsides, and interview lore.
              Each card is a <em className="text-espresso dark:text-parchment">tape to peel</em>. Tap <span className="font-mono text-cherry">INSPECT</span> to open the file.
            </p>
          </div>
          <div className="hidden rounded-lg border border-[#D4AF37]/15 bg-white px-4 py-3 font-mono text-[11px] leading-relaxed tracking-wide text-typewriter shadow-[0_4px_12px_rgba(0,0,0,0.04)] dark:border-[#F7F4EB]/10 dark:bg-noir-soft sm:block">
            <div className="font-semibold tracking-[0.15em] text-espresso dark:text-parchment">ACCESS INSTRUCTIONS</div>
            Hover to lift • Tap INSPECT to open<br />
            <span className="text-cherry">Red stamp = rarity</span> • Brass = poetry
          </div>
          <div className="rounded-lg border border-dashed border-[#D4AF37]/20 bg-parchment-dark/40 px-3 py-2 font-mono text-[10px] tracking-wide text-typewriter shadow-sm dark:border-[#F7F4EB]/10 dark:bg-noir sm:hidden">
            TAP INSPECT TO OPEN • {vaultItems.length} FILES
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vaultItems.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.04 }}
              whileHover={{ y: -4, rotate: idx % 2 === 0 ? 0.7 : -0.7 }}
              onClick={() => setSelected(item)}
              className="group relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-lg border border-[#D4AF37]/15 bg-white shadow-[0_6px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] active:scale-[0.99] dark:border-[#F7F4EB]/10 dark:bg-noir-soft"
            >
              <div className="flex items-center justify-between gap-2 border-b border-dashed border-[#D4AF37]/15 bg-parchment-dark/50 px-2.5 py-2 dark:border-[#F7F4EB]/10 dark:bg-noir sm:px-3">
                <span className="truncate font-mono text-[9px] tracking-[0.12em] text-typewriter sm:text-[10px] sm:tracking-[0.2em]">
                  {item.catalog} • {item.type}
                </span>
                <span
                  className="shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-[0.12em] text-white sm:px-2 sm:text-[9px] sm:tracking-[0.15em]"
                  style={{ background: item.color }}
                >
                  {item.stamp}
                </span>
              </div>

              <div className="relative bg-[#1A1A1A] p-2.5 sm:p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-14 shrink-0 items-center justify-center rounded-md border border-white/10 bg-[#2a2a2a] shadow-inner sm:h-10 sm:w-16">
                    <div className="flex gap-1.5 sm:gap-2">
                      <span className="h-4 w-4 rounded-full border border-white/15 bg-white/5 sm:h-5 sm:w-5" style={{ backgroundImage: `repeating-conic-gradient(from 0deg, transparent 0 60deg, rgba(255,255,255,0.12) 60deg 120deg)` }} />
                      <span className="h-4 w-4 rounded-full border border-white/15 bg-white/5 sm:h-5 sm:w-5" style={{ backgroundImage: `repeating-conic-gradient(from 0deg, transparent 0 60deg, rgba(255,255,255,0.09) 60deg 120deg)` }} />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="h-1 w-full rounded-full bg-white/10">
                      <div className="h-full w-[68%] rounded-full bg-white/30" />
                    </div>
                    <div className="mt-1 flex gap-1">
                      <span className="h-1 flex-1 rounded-full bg-brass/60" />
                      <span className="h-1 flex-1 rounded-full bg-white/10" />
                      <span className="h-1 w-5 rounded-full bg-cherry/60 sm:w-6" />
                    </div>
                  </div>
                  <span className="hidden font-mono text-[9px] tracking-widest text-white/40 sm:block">SIDE A</span>
                </div>
                <div className="mt-2 rounded-md bg-[#FFFEFB] px-2 py-1 shadow-sm sm:py-1.5">
                  <div className="truncate font-mono text-[10px] font-bold tracking-[0.06em] text-espresso sm:text-[11px] sm:tracking-[0.08em]">
                    LANA DEL REY — {item.title.toUpperCase()}
                  </div>
                  <div className="truncate font-mono text-[9px] tracking-wide text-typewriter sm:text-[10px]">
                    {item.year}
                  </div>
                </div>
              </div>

              <div className="relative aspect-[16/10] w-full overflow-hidden bg-parchment-dark">
                <img
                  src={item.image}
                  alt={item.imageAlt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-1.5 left-2 rounded-full bg-white/90 px-1.5 py-0.5 font-mono text-[7px] tracking-widest text-espresso shadow sm:bottom-2 sm:left-2">POLAROID • LIVE</div>
              </div>

              <div className="flex flex-1 flex-col p-3 sm:p-4">
                <h3 className="font-display text-[15px] font-bold leading-tight text-espresso dark:text-parchment sm:text-[16px]">
                  {item.title}
                </h3>
                <p className="mt-1.5 line-clamp-3 flex-1 font-body text-[12.5px] leading-relaxed text-typewriter dark:text-parchment/70 sm:mt-2 sm:line-clamp-4 sm:text-[13px]">
                  {item.description}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-dashed border-[#D4AF37]/15 pt-2.5 dark:border-[#F7F4EB]/10 sm:mt-4 sm:pt-3">
                  <span className="font-mono text-[9px] tracking-[0.12em] text-typewriter sm:text-[10px] sm:tracking-[0.15em]">
                    FILE {item.id} / {vaultItems.length}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(item);
                    }}
                    className="rounded-full bg-cherry px-3 py-1 font-mono text-[10px] tracking-[0.12em] text-white shadow-sm transition-all duration-300 hover:bg-cherry-light hover:shadow-md active:scale-95 sm:px-3.5 sm:tracking-[0.15em]"
                  >
                    INSPECT →
                  </button>
                </div>
              </div>

              <div className="pointer-events-none absolute right-0 top-0 hidden h-8 w-8 overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity sm:block">
                <div className="absolute right-0 top-0 h-8 w-8 translate-x-1 -translate-y-1 rotate-45 bg-gradient-to-br from-white to-parchment-dark shadow-sm dark:from-white/10 dark:to-white/5" />
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 border-t border-[#D4AF37]/15 pt-4 dark:border-[#F7F4EB]/10 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3 sm:pt-6">
          <span className="text-center font-mono text-[9px] tracking-[0.14em] text-typewriter sm:text-[10px] sm:tracking-[0.2em]">END OF VAULT • {vaultItems.length} FILES DISPLAYED • TAP ANY FILE TO INSPECT</span>
          <span className="hidden h-3 w-px bg-espresso/10 dark:bg-parchment/10 sm:block" />
          <button onClick={() => document.querySelector('#tarot')?.scrollIntoView({ behavior: 'smooth' })} className="font-mono text-[10px] tracking-[0.12em] text-cherry hover:underline sm:text-[11px] sm:tracking-[0.15em]">
            DRAW A LYRIC TAROT ↓
          </button>
        </div>
      </div>

      {/* Vault Detail Modal — actual inspect functionality */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-[70] bg-[#1A1A1A]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed inset-x-3 bottom-3 top-3 z-[71] mx-auto flex max-w-[640px] flex-col overflow-hidden rounded-xl border border-[#D4AF37]/20 bg-[#FFFEFB] shadow-[0_20px_60px_rgba(0,0,0,0.35)] dark:border-[#F7F4EB]/10 dark:bg-noir sm:inset-auto sm:left-1/2 sm:top-1/2 sm:max-h-[85vh] sm:w-[92%] sm:-translate-x-1/2 sm:-translate-y-1/2"
            >
              <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-parchment-dark">
                <img src={selected.image} alt={selected.imageAlt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <span className="rounded-full bg-white/90 px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-espresso shadow">{selected.catalog}</span>
                  <span className="rounded-full px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-white shadow" style={{ background: selected.color }}>{selected.stamp}</span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 font-mono text-white backdrop-blur hover:bg-black/70"
                  aria-label="Close"
                >
                  ✕
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <div className="font-mono text-[10px] tracking-[0.18em] text-white/80">{selected.type} • {selected.year}</div>
                  <h3 className="mt-1 font-display text-[22px] font-bold leading-tight text-white drop-shadow sm:text-[26px]">{selected.title}</h3>
                </div>
              </div>
              <div className="flex flex-1 flex-col overflow-y-auto p-4 sm:p-6">
                <p className="font-body text-[14px] leading-relaxed text-typewriter dark:text-parchment/70">{selected.description}</p>
                <div className="mt-4 rounded-lg border border-[#D4AF37]/15 bg-parchment/40 p-3 dark:border-[#F7F4EB]/10 dark:bg-white/5">
                  <div className="font-mono text-[10px] tracking-[0.18em] text-typewriter">ARCHIVAL NOTE</div>
                  <p className="mt-1 font-script text-[13px] leading-snug text-typewriter/80 dark:text-parchment/60">
                    Filed under {selected.type} • {selected.catalog}. Photograph: {selected.imageAlt}. This is a fan-made archival entry — not official, just reverent.
                  </p>
                </div>
                <div className="mt-6 flex gap-2">
                  <button onClick={() => setSelected(null)} className="flex-1 rounded-lg border border-[#D4AF37]/20 bg-white px-4 py-3 font-mono text-[11px] tracking-[0.14em] text-espresso transition hover:bg-[#F7F4EB] dark:border-[#F7F4EB]/15 dark:bg-noir-soft dark:text-parchment">
                    CLOSE FILE ✕
                  </button>
                  <button
                    onClick={() => {
                      setSelected(null);
                      setTimeout(() => document.querySelector('#tarot')?.scrollIntoView({ behavior: 'smooth' }), 120);
                    }}
                    className="flex-1 rounded-lg bg-cherry px-4 py-3 font-mono text-[11px] tracking-[0.14em] text-white transition hover:bg-cherry-light"
                  >
                    DRAW TAROT →
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
