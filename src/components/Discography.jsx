import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { discography } from '../data/discography';
import { cueSong } from '../lib/preview';

export default function Discography({ setCurrentTrack, setIsPlaying }) {
  const [openId, setOpenId] = useState('born-to-die');
  const totalTracks = discography.reduce((n, a) => n + a.tracks.length, 0);
  const totalSingles = discography.reduce((n, a) => n + a.tracks.filter((t) => t.s).length, 0);

  return (
    <section id="discography" className="relative mx-auto max-w-[1400px] overflow-x-hidden px-3 py-8 sm:px-4 sm:py-12 md:px-6 md:py-16">
      <div className="mb-6 sm:mb-8">
        <div className="font-mono text-[10px] tracking-[0.2em] text-cherry sm:text-[11px] sm:tracking-[0.25em]">08 — COMPLETE DISCOGRAPHY</div>
        <h2 className="mt-1.5 font-display text-[26px] font-bold leading-none tracking-[-0.02em] text-espresso dark:text-parchment sm:mt-2 sm:text-[34px] md:text-[48px]">
          EVERY RECORD <span className="font-light italic text-typewriter text-[20px] sm:text-[26px] md:text-[34px]">every track</span>
        </h2>
        <p className="mt-2 max-w-[640px] font-body text-[14.5px] leading-[1.75] text-typewriter dark:text-parchment/60 sm:mt-3 sm:text-[15px]">
          {discography.length} releases • {totalTracks} tracks • {totalSingles} singles.
          Expand a record for the full standard tracklist — tap any track to hear its 30-second preview.
          Dots mark official singles.
        </p>
      </div>

      <div className="mx-auto flex max-w-[900px] flex-col gap-2.5 sm:gap-3">
        {discography.map((album, ai) => {
          const open = openId === album.id;
          return (
            <motion.article
              key={album.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: Math.min(ai * 0.03, 0.2) }}
              className={`overflow-hidden rounded-lg border bg-white shadow-[0_6px_16px_rgba(0,0,0,0.05)] transition-shadow dark:bg-noir-soft ${
                open ? 'border-[#D4AF37]/30 shadow-[0_10px_28px_rgba(0,0,0,0.1)]' : 'border-[#D4AF37]/15 dark:border-[#F7F4EB]/10'
              }`}
            >
              <button
                onClick={() => setOpenId(open ? null : album.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 p-3 text-left sm:gap-4 sm:p-4"
              >
                <span
                  className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-md text-white shadow-md sm:h-14 sm:w-14"
                  style={{ background: `linear-gradient(135deg, ${album.palette[0]}, ${album.palette[1]})` }}
                >
                  <span className="font-display text-[13px] font-bold leading-none sm:text-[15px]">{album.year.slice(2)}</span>
                  <span className="font-mono text-[7px] tracking-[0.15em] text-white/80">{album.type}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-[15px] font-bold leading-tight text-espresso dark:text-parchment sm:text-[18px]">
                    {ai + 1}. {album.title}
                  </span>
                  <span className="block truncate font-mono text-[9px] tracking-[0.1em] text-typewriter sm:text-[10px]">
                    {album.year} • {album.producer} • {album.tracks.length} TRACKS
                  </span>
                </span>
                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/20 font-mono text-[13px] text-typewriter"
                >
                  ▾
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key="tracks"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-1 border-t border-dashed border-[#D4AF37]/15 p-2.5 dark:border-[#F7F4EB]/10 sm:grid-cols-2 sm:gap-x-4 sm:p-4">
                      {album.tracks.map((t, i) => (
                        <button
                          key={t.t}
                          onClick={() => cueSong(t.t, album.title.toUpperCase(), setCurrentTrack, setIsPlaying)}
                          className="group flex items-center gap-2.5 rounded-md px-2 py-2 text-left transition hover:bg-parchment-dark/60 active:scale-[0.99] dark:hover:bg-white/5"
                        >
                          <span className="w-6 shrink-0 text-right font-mono text-[10px] tabular-nums text-typewriter/60">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="min-w-0 flex-1 truncate font-body text-[13.5px] text-espresso dark:text-parchment/85 sm:text-[14px]">
                            {t.t}
                          </span>
                          {t.s && (
                            <span className="shrink-0 rounded-full bg-cherry px-1.5 py-0.5 font-mono text-[8px] tracking-[0.1em] text-white">
                              SINGLE
                            </span>
                          )}
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-espresso/[0.06] text-[10px] text-espresso transition group-hover:bg-cherry group-hover:text-white dark:bg-white/10 dark:text-parchment">
                            ▶
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>

      <p className="mx-auto mt-6 max-w-[900px] text-center font-mono text-[10px] tracking-[0.14em] text-typewriter/60">
        STANDARD EDITIONS • PREVIEWS ARE 30S • FULL SONGS BELONG TO THEIR OWNERS
      </p>
    </section>
  );
}
