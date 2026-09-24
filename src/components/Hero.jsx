import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tilt, Magnetic, FloatingVinyl } from './Fx';
import SafeImage from './SafeImage';
import { eras } from '../data/eras';

const quotes = [
  { text: '"We were born to die."', ref: '— ‘Born to Die’ · Born to Die (2012)' },
  { text: '"I\'m so used to writing for myself. I do it because I feel like I have to."', ref: '— Interview · NPR (2014)' },
  { text: '"My baby lives in shades of blue. Blue eyes and jazz and attitude."', ref: '— ‘Shades of Cool’ · Ultraviolence (2014)' },
  { text: '"I\'m your man."', ref: '— ‘Mariners Apartment Complex’ · NFR! (2019)' },
  { text: '"Will you still love me when I\'m no longer young and beautiful?"', ref: '— ‘Young and Beautiful’ · Paradise (2013)' },
  { text: '"It\'s you, it\'s you, it\'s all for you."', ref: '— ‘Video Games’ · Born to Die (2012)' },
  { text: '"I\'ve got my red dress on tonight."', ref: '— ‘Blue Jeans’ · Born to Die (2012)' },
];

export default function Hero({ onNavigate }) {
  const [qIndex, setQIndex] = useState(0);
  // swipeable era deck: 8 frames, one myth
  const [heroIndex, setHeroIndex] = useState(1); // Born to Die default
  const [heroDir, setHeroDir] = useState(1);
  const [deckPaused, setDeckPaused] = useState(false);
  const heroEra = eras[heroIndex];

  const paginateDeck = (dir) => {
    setHeroDir(dir);
    setHeroIndex((i) => (i + dir + eras.length) % eras.length);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setQIndex((i) => (i + 1) % quotes.length), 3200);
    return () => clearInterval(id);
  }, []);

  // gentle auto-rotate; resets on every manual swipe, pauses on hover/touch/focus, off for reduced motion
  useEffect(() => {
    if (deckPaused) return;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
    const id = setInterval(() => paginateDeck(1), 6500);
    return () => clearInterval(id);
  }, [heroIndex, deckPaused]);

  return (
    <section id="hero" className="relative overflow-x-hidden border-b border-espresso/10 dark:border-parchment/10">
      {/* background paper gradient */}
      <div className="absolute inset-0 -z-10 bg-parchment dark:bg-noir" />
      <div className="absolute inset-0 -z-10 opacity-[0.04]" style={{
        backgroundImage: `repeating-linear-gradient(90deg, #22201E 0 1px, transparent 1px 40px), repeating-linear-gradient(0deg, #22201E 0 1px, transparent 1px 40px)`
      }} />

      {/* ambient blobs, static (animating huge blurs janks mobile GPUs) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-cherry/5 blur-[60px] dark:bg-cherry/10 sm:h-[600px] sm:w-[600px] sm:blur-[80px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-brass/10 blur-[60px] dark:bg-brass/5 sm:h-[500px] sm:w-[500px] sm:blur-[80px]"
      />
      {/* floating vinyl 3D object behind collage */}
      <FloatingVinyl size={280} className="-left-24 top-16 hidden opacity-50 md:block lg:left-auto lg:-right-6 xl:-right-10 lg:top-8 lg:opacity-60 xl:opacity-70" />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-12 md:py-16 lg:grid-cols-12 lg:gap-10 lg:items-start lg:px-6 xl:px-8">
        {/* LEFT - Typography */}
        <div className="relative min-w-0 lg:col-span-7 xl:col-span-7">
          <div className="font-sans text-[10px] tracking-[0.2em] text-cherry dark:text-brass-light sm:text-[11px] sm:tracking-[0.08em]">01 · COVER</div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mt-2 inline-flex max-w-full items-center gap-1.5 overflow-hidden rounded-full border border-espresso/15 bg-white px-2.5 py-1 text-[9px] font-sans tracking-[0.14em] text-zinc-500 shadow-sm dark:border-parchment/15 dark:bg-noir-soft dark:text-parchment/60 sm:gap-2 sm:px-3 sm:text-[10px] sm:tracking-[0.2em]"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cherry" />
            <span className="truncate">ARCHIVAL CASE FILE № 001 · RESTRICTED</span>
            <span className="hidden shrink-0 sm:inline">/ CATALOGUED LAKE PLACID → NEW YORK</span>
          </motion.div>

          <div className="mt-4 sm:mt-6">
            <h1 className="font-display font-black leading-[0.9] tracking-[-0.03em] text-espresso dark:text-parchment">
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">LIZZY</span>
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl -mt-1 md:-mt-2">
                GRANT<span className="align-super text-[0.32em] font-normal tracking-[0.08em] sm:text-[0.35em] sm:tracking-[0.2em]">:</span>
              </span>
              <span className="block font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light italic tracking-[-0.02em] text-cherry dark:text-brass-light -mt-1 sm:-mt-1.5 lg:-mt-1">
                THE ARCHIVES
              </span>
            </h1>

            {/* red underline stamp */}
            <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-3">
              <div className="hidden h-px flex-1 max-w-[200px] bg-cherry/30 dark:bg-brass/30 sm:block sm:max-w-[280px]" />
              <span className="rounded-full border border-cherry/20 bg-cherry/5 px-2.5 py-1 font-sans text-[9px] tracking-[0.14em] text-cherry dark:border-brass/20 dark:bg-brass/5 dark:text-brass sm:px-3 sm:text-[10px] sm:tracking-[0.2em]">
                EST. 1985 · NEW YORK / VOLUME I–VIII
              </span>
            </div>
          </div>

          <div className="mt-6 max-w-[640px] border-l-2 border-brass/40 pl-3 dark:border-brass/30 sm:mt-8 sm:pl-5">
            <p className="font-body text-[15px] leading-[1.75] text-zinc-600 dark:text-parchment/75 sm:text-[16px]">
              An atmospheric anthology of a girl who turned Americana into mythology.
              <span className="font-semibold text-espresso dark:text-parchment"> Trailer parks to Chateau Marmont, </span>
              8mm grain to 70s editorial, from the first Kill Kill demo in 2008 to the tunnel under Ocean Blvd.
              Curated as a scrapbook, told as a film.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
              <span className="rounded-full border border-[#D4AF37]/15 bg-white px-2.5 py-1 font-sans text-[10px] tracking-widest text-zinc-600 dark:border-[#F7F4EB]/10 dark:bg-noir-soft sm:px-3 sm:text-[10px]">CINEMATIC MELANCHOLY</span>
              <span className="rounded-full border border-[#D4AF37]/15 bg-white px-2.5 py-1 font-sans text-[10px] tracking-widest text-zinc-600 dark:border-[#F7F4EB]/10 dark:bg-noir-soft sm:px-3 sm:text-[10px]">RETRO AMERICANA</span>
              <span className="rounded-full border border-[#D4AF37]/15 bg-white px-2.5 py-1 font-sans text-[10px] tracking-widest text-zinc-600 dark:border-[#F7F4EB]/10 dark:bg-noir-soft sm:px-3 sm:text-[10px]">70S EDITORIAL</span>
            </div>
          </div>

          {/* rotating quote - generous height so descenders never clip */}
          <div className="mt-6 flex min-h-[170px] max-w-[640px] flex-col justify-between rounded-2xl border border-[#D4AF37]/15 bg-white p-4 shadow-[0_6px_16px_rgba(0,0,0,0.06)] dark:border-[#F7F4EB]/10 dark:bg-noir-soft sm:mt-8 sm:min-h-[165px] sm:p-5 lg:min-h-[180px]">
            <div className="mb-2 flex shrink-0 items-center gap-2 font-sans text-[10px] tracking-[0.08em] text-cherry dark:text-brass-light sm:text-[10px] sm:tracking-[0.2em]">
              <span className="inline-block h-px w-4 bg-cherry/40 sm:w-6" />
              ROTATING LYRIC / ARCHIVAL TRANSCRIPT
            </div>
            {/* text stage, flexible and centered */}
            <div className="relative flex min-h-[92px] sm:min-h-[86px] lg:min-h-[96px] flex-col justify-center py-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={qIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <p className="font-display text-[17px] italic leading-snug text-espresso dark:text-parchment sm:text-[19px] md:text-[20px] lg:text-[21px]">
                    {quotes[qIndex].text}
                  </p>
                  <p className="mt-1 font-sans text-[11px] tracking-widest text-zinc-600 dark:text-parchment/75 sm:text-[11px]">
                    {quotes[qIndex].ref}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex shrink-0 gap-1.5 pt-2">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setQIndex(i)}
                  className={`min-h-[24px] min-w-[24px] flex items-center justify-center rounded-full transition-all ${i === qIndex ? 'w-6 bg-cherry sm:w-6' : 'w-6 bg-espresso/15 dark:bg-parchment/15'}`}
                  aria-label={`Quote ${i + 1}`}
                >
                  <span className={`h-1 rounded-full transition-all ${i === qIndex ? 'w-5 bg-white sm:w-6' : 'w-1 bg-espresso/30 dark:bg-parchment/30'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
            <Magnetic strength={0.18}>
              <a
                href="/eras"
                onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('/eras'); } }}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-cherry px-5 py-3.5 font-sans text-[12px] tracking-[0.14em] text-white shadow-[0_4px_14px_rgba(158,27,27,0.2)] transition-colors duration-300 ease-out hover:bg-cherry-light hover:shadow-[0_8px_20px_rgba(158,27,27,0.3)] active:scale-[0.98] sm:w-auto sm:px-6 sm:py-3 sm:tracking-[0.08em]"
              >
                ENTER THE ERAS <span aria-hidden>·</span> 2005 → 2025
              </a>
            </Magnetic>
            <Magnetic strength={0.18}>
              <a
                href="/vault"
                onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate('/vault'); } }}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#D4AF37]/20 bg-white px-5 py-3.5 font-sans text-[12px] tracking-[0.14em] text-espresso shadow-sm transition-colors duration-300 ease-out hover:bg-[#FFFEFB] hover:border-[#D4AF37]/30 hover:shadow-[0_6px_16px_rgba(0,0,0,0.07)] active:scale-[0.98] dark:border-[#F7F4EB]/15 dark:bg-noir-soft dark:text-parchment dark:hover:bg-white/10 sm:w-auto sm:px-6 sm:py-3 sm:tracking-[0.08em]"
              >
                OPEN SECRET VAULT <span>↗</span>
              </a>
            </Magnetic>
          </div>

          <p className="mt-3 hidden font-body italic text-[14px] text-zinc-500 dark:text-parchment/50 sm:block sm:text-[15px]">
            * hand-annotated by E.W.G, “keep the tapes running” ✎
          </p>
          <p className="mt-3 font-body italic text-[13px] text-zinc-500/70 dark:text-parchment/50 sm:hidden">
            * E.W.G, “keep the tapes running” ✎
          </p>
        </div>

        {/* RIGHT - single main polaroid below lg, layered collage on lg+ */}
        <div className="relative flex min-w-0 flex-col gap-4 sm:gap-5 lg:col-span-5">
          <div className="relative mx-auto w-full max-w-[560px] lg:mx-0 lg:max-w-none lg:h-[580px]">
            {/* card 1 - main, 3D tilt on desktop pointers */}
            <Tilt
              max={6}
              className="relative z-20 mb-6 w-full sm:mb-7 lg:absolute lg:left-0 lg:top-2 lg:mb-0 lg:w-[65%] lg:translate-x-0"
            >
            <motion.div
              initial={{ rotate: -2, y: 20, opacity: 0 }}
              animate={{ rotate: -1.5, y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="relative w-full rounded-2xl paper border border-[#D4AF37]/15 p-2 pb-8 shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-shadow duration-300 hover:shadow-[0_16px_32px_rgba(0,0,0,0.16)] dark:border-[#F7F4EB]/10 sm:p-3 sm:pb-10"
            >
              <div className="tape -top-2 left-4 hidden rotate-[-4deg] sm:block sm:-top-3 sm:left-6" />
              <div className="tape -top-2 right-4 hidden rotate-[5deg] sm:block sm:-top-3 sm:right-6" />
              {/* swipeable era deck, drag, arrows, or dots */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.55}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) paginateDeck(1);
                  else if (info.offset.x > 60) paginateDeck(-1);
                }}
                onMouseEnter={() => setDeckPaused(true)}
                onMouseLeave={() => setDeckPaused(false)}
                onFocus={() => setDeckPaused(true)}
                onBlur={() => setDeckPaused(false)}
                onTouchStart={() => setDeckPaused(true)}
                onTouchEnd={() => setTimeout(() => setDeckPaused(false), 4000)}
                className="relative aspect-[4/3] cursor-grab touch-pan-y overflow-hidden rounded-md bg-[#2E4057] active:cursor-grabbing"
                role="region"
                aria-roledescription="carousel"
                aria-label={`Era photographs, frame ${heroIndex + 1} of ${eras.length}: ${heroEra.title}`}
              >
                <AnimatePresence mode="wait" custom={heroDir} initial={false}>
                  <motion.div
                    key={heroEra.id}
                    custom={heroDir}
                    initial={{ x: heroDir * 70, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: heroDir * -70, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="absolute inset-0"
                  >
                    <SafeImage
                      src={heroEra.image}
                      alt={heroEra.imageAlt}
                      loading={heroIndex === 1 ? 'eager' : 'lazy'}
                      fetchPriority={heroIndex === 1 ? 'high' : undefined}
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='1.2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`
                }} />
                <div className="absolute bottom-1.5 left-1.5 rounded-full bg-white/90 px-2 py-0.5 font-sans text-[10px] tracking-widest text-espresso sm:bottom-2 sm:left-2 sm:text-[10px]">
                  {heroEra.year} / ARCHIVE
                </div>
                {/* arrows */}
                <button
                  onClick={() => paginateDeck(-1)}
                  aria-label="Previous era photo"
                  className="absolute left-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 font-sans text-[15px] text-espresso shadow-md transition hover:bg-white active:scale-90 sm:left-2"
                >
                  ←
                </button>
                <button
                  onClick={() => paginateDeck(1)}
                  aria-label="Next era photo"
                  className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 font-sans text-[15px] text-espresso shadow-md transition hover:bg-white active:scale-90 sm:right-2"
                >
                  →
                </button>
              </motion.div>
              <div className="absolute bottom-1.5 left-2 right-2 flex items-end justify-between gap-2 sm:bottom-3 sm:left-3 sm:right-3">
                <span className="truncate font-body italic text-[13px] leading-none text-espresso dark:text-parchment sm:text-[17px]">{heroEra.title.toLowerCase()}</span>
                <span className="shrink-0 font-sans text-[10px] tracking-[0.08em] text-zinc-600 sm:text-[10px]">FIG. {String(heroIndex + 1).padStart(2, '0')}/{String(eras.length).padStart(2, '0')}</span>
              </div>
            </motion.div>
            </Tilt>
            {/* dots, below card on mobile/tablet, absolute on lg+ */}
            <div className="flex justify-center gap-1 mt-3 lg:absolute lg:bottom-0 lg:left-1/2 lg:z-30 lg:mt-0 lg:-translate-x-1/2">
              {eras.map((e, i) => (
                <button
                  key={e.id}
                  onClick={() => { setHeroDir(i > heroIndex ? 1 : -1); setHeroIndex(i); }}
                  aria-label={`Go to ${e.title}`}
                  className={`flex min-h-[24px] min-w-[24px] items-center justify-center rounded-full transition-all ${i === heroIndex ? 'bg-zinc-900 dark:bg-white' : 'bg-transparent'}`}
                >
                  <span className={`h-1.5 rounded-full transition-all ${i === heroIndex ? 'w-5 bg-cherry' : 'w-1.5 bg-zinc-300 dark:bg-white/20'}`} />
                </button>
              ))}
            </div>

            {/* card 2 - desktop only layer; mobile stays single-polaroid for breathing room */}
            <motion.div
              initial={{ rotate: 3, y: 20, opacity: 0 }}
              animate={{ rotate: 2, y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="hidden rounded-2xl paper border border-[#D4AF37]/15 p-2 pb-7 shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-all duration-300 hover:rotate-[-0.8deg] hover:shadow-[0_12px_24px_rgba(0,0,0,0.14)] lg:absolute lg:bottom-4 lg:right-0 lg:block lg:w-[38%]"
            >
              <div className="tape -top-2 left-1/2 hidden w-12 -translate-x-1/2 rotate-[2deg] lg:block" />
              <div className="aspect-[3/4] overflow-hidden rounded-md bg-[#8B7355]">
                <SafeImage
                  src="https://commons.wikimedia.org/wiki/Special:FilePath/Lana%20Del%20Rey%20live%20in%20Seattle%20%2802%29.jpg?width=400"
                  alt="Lana Del Rey, Ultraviolence era candid, Seattle 2014"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="mt-2 text-center font-body italic text-[13px] text-espresso dark:text-parchment">ultraviolence babe ♡</p>
            </motion.div>

            {/* stamp badge - desktop only */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: -12 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
              className="hidden rounded-full border-2 border-cherry bg-white px-3 py-1.5 shadow-md dark:bg-noir-soft lg:absolute lg:left-0 lg:top-[44%] lg:block"
            >
              <div className="text-center leading-none">
                <div className="font-display text-[11px] font-bold tracking-[0.08em] text-cherry dark:text-brass-light sm:text-[11px] sm:tracking-[0.2em]">ARCHIVED</div>
                <div className="font-sans text-[9px] tracking-[0.08em] text-zinc-600 sm:text-[9px] sm:tracking-[0.2em]">AUTHENTIC / 2011</div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* bottom paper edge */}
      <div className="h-2 w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_12px,rgba(0,0,0,0.03)_12px,rgba(0,0,0,0.03)_13px)] dark:opacity-20 sm:h-3" />
    </section>
  );
}
