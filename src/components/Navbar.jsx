import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ darkMode, setDarkMode }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-espresso/10 bg-parchment/80 backdrop-blur-md dark:border-parchment/10 dark:bg-noir/80">
      {/* top archival bar - hide on mobile */}
      <div className="hidden border-b border-espresso/5 bg-espresso/[0.02] dark:border-parchment/5 dark:bg-parchment/[0.02] lg:block">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-1.5 font-mono text-[10px] tracking-[0.2em] text-typewriter dark:text-parchment/50">
          <span>CATALOG № LG-1955—2024 • ARCHIVAL EDITION • VOL. I–VIII</span>
          <span className="flex items-center gap-4">
            <span className="hidden xl:inline">EST. LAKE PLACID, NY • 1985 →</span>
            <span className="h-3 w-px bg-espresso/10 dark:bg-parchment/10" />
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cherry animate-pulse" />
              ARCHIVE LIVE
            </span>
          </span>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2 px-3 py-3 sm:px-4 md:px-6 md:py-4">
        <a href="#" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="hidden h-9 w-9 shrink-0 items-center justify-center border border-espresso/20 bg-white text-center font-display text-[10px] font-semibold leading-none tracking-[0.15em] text-espresso dark:border-parchment/20 dark:bg-noir dark:text-parchment sm:flex">
            <span>LG<br />AR</span>
          </div>
          <div className="min-w-0 leading-none">
            <div className="truncate font-display text-[13px] font-bold tracking-[0.14em] text-espresso dark:text-parchment sm:text-[15px] md:text-[16px]">
              LIZZY GRANT <span className="font-light">: ARCHIVES</span>
            </div>
            <div className="hidden font-mono text-[9px] tracking-[0.2em] text-typewriter dark:text-parchment/60 sm:block sm:text-[10px] sm:tracking-[0.25em]">
              AN ATMOSPHERIC ANTHOLOGY
            </div>
          </div>
        </a>

        {/* desktop nav */}
        <nav className="hidden items-center gap-5 font-mono text-[11px] tracking-[0.15em] text-espresso/70 dark:text-parchment/70 md:flex lg:gap-6">
          <a href="#timeline" className="py-2 hover:text-cherry transition-colors">
            ERAS
          </a>
          <a href="#vault" className="py-2 hover:text-cherry transition-colors">
            SECRET VAULT
          </a>
          <a href="#tarot" className="py-2 hover:text-cherry transition-colors">
            LYRICAL TAROT
          </a>
          <a
            href="#hero"
            className="rounded-full border border-espresso/15 px-3 py-1.5 text-cherry hover:bg-cherry hover:text-white transition-colors dark:border-parchment/15 lg:px-4"
          >
            LISTEN →
          </a>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setDarkMode((v) => !v)}
            aria-label="Toggle dark mode"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-espresso/15 bg-white text-espresso transition hover:bg-espresso hover:text-parchment dark:border-parchment/15 dark:bg-noir-soft dark:text-parchment dark:hover:bg-parchment dark:hover:text-noir sm:h-9 sm:w-9"
          >
            <motion.span
              key={darkMode ? 'moon' : 'sun'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-[14px]"
            >
              {darkMode ? '☾' : '☀'}
            </motion.span>
          </button>

          {/* mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-espresso/15 bg-white text-espresso dark:border-parchment/15 dark:bg-noir-soft dark:text-parchment md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-0.5 w-full bg-current transition-all ${open ? 'top-[5px] rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-[5px] h-0.5 w-full bg-current transition-opacity ${open ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`absolute left-0 h-0.5 w-full bg-current transition-all ${open ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
            </span>
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden rounded-b-lg border-t border-[#D4AF37]/15 bg-parchment/95 shadow-xl backdrop-blur-md dark:border-[#F7F4EB]/10 dark:bg-noir/95 md:hidden"
          >
            <nav className="flex flex-col px-3 py-3 font-mono text-[12px] tracking-[0.15em]">
              <a
                href="#timeline"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-espresso/5 py-3 text-espresso dark:border-parchment/5 dark:text-parchment"
              >
                <span>01 — THE ERAS</span>
                <span className="text-cherry">→</span>
              </a>
              <a
                href="#vault"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-espresso/5 py-3 text-espresso dark:border-parchment/5 dark:text-parchment"
              >
                <span>02 — SECRET VAULT</span>
                <span className="text-cherry">→</span>
              </a>
              <a
                href="#tarot"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-espresso/5 py-3 text-espresso dark:border-parchment/5 dark:text-parchment"
              >
                <span>03 — LYRICAL TAROT</span>
                <span className="text-cherry">→</span>
              </a>
              <a
                href="#hero"
                onClick={() => setOpen(false)}
                className="mt-3 flex items-center justify-center gap-2 rounded-full bg-cherry py-3 text-white"
              >
                LISTEN NOW — SIDE A ▶
              </a>
              <div className="pt-3 text-center font-mono text-[10px] tracking-[0.15em] text-typewriter">
                CATALOG № LG-1955—2024 • TAP ANYWHERE TO CLOSE
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* marquee - smaller on mobile */}
      <div className="overflow-hidden border-y border-cherry/20 bg-cherry py-1 text-parchment sm:py-1.5">
        <motion.div
          className="flex w-max gap-6 whitespace-nowrap font-mono text-[10px] tracking-[0.15em] sm:gap-8 sm:text-[11px] sm:tracking-[0.2em]"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <span>⋆ VIDEO GAMES ⋆ BORN TO DIE ⋆ RIDE ⋆ ULTRAVIOLENCE ⋆ SHADES OF COOL ⋆ HONEYMOON ⋆ LUST FOR LIFE ⋆ NORMAN FUCKING ROCKWELL! ⋆ CHEMTRAILS ⋆ OCEAN BLVD ⋆ </span>
          <span aria-hidden>⋆ VIDEO GAMES ⋆ BORN TO DIE ⋆ RIDE ⋆ ULTRAVIOLENCE ⋆ SHADES OF COOL ⋆ HONEYMOON ⋆ LUST FOR LIFE ⋆ NORMAN FUCKING ROCKWELL! ⋆ CHEMTRAILS ⋆ OCEAN BLVD ⋆ </span>
        </motion.div>
      </div>
    </header>
  );
}
