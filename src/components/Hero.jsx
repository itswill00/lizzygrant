import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tilt, Magnetic, FloatingVinyl } from './Fx';

const quotes = [
  { text: '"We were born to die."', ref: '— Born to Die, 2012' },
  { text: '"I was a cult leader, but I was really a kindergarten teacher."', ref: '— Interview, 2014' },
  { text: '"My pussy tastes like Pepsi Cola."', ref: '— Cola, Paradise' },
  { text: '"Don\'t you remember? You used to be so sweet."', ref: '— Shades of Cool' },
  { text: '"God, I love my baby like I love diamonds."', ref: '— Serial Killer (Unreleased)' },
  { text: '"I\'m your man."', ref: '— Mariners Apartment Complex, NFR!' },
  { text: '"Will you still love me when I\'m no longer young and beautiful?"', ref: '— Young and Beautiful' },
];

export default function Hero({ isPlaying, setIsPlaying, currentTrack, setCurrentTrack }) {
  const [qIndex, setQIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setQIndex((i) => (i + 1) % quotes.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="hero" className="relative overflow-x-hidden border-b border-espresso/10 dark:border-parchment/10">
      {/* background paper gradient */}
      <div className="absolute inset-0 -z-10 bg-parchment dark:bg-noir" />
      <div className="absolute inset-0 -z-10 opacity-[0.04]" style={{
        backgroundImage: `repeating-linear-gradient(90deg, #22201E 0 1px, transparent 1px 40px), repeating-linear-gradient(0deg, #22201E 0 1px, transparent 1px 40px)`
      }} />

      {/* ambient blobs — static (animating huge blurs janks mobile GPUs) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-cherry/5 blur-[60px] dark:bg-cherry/10 sm:h-[600px] sm:w-[600px] sm:blur-[80px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-brass/10 blur-[60px] dark:bg-brass/5 sm:h-[500px] sm:w-[500px] sm:blur-[80px]"
      />
      {/* floating vinyl 3D object behind collage */}
      <FloatingVinyl size={280} className="-left-24 top-16 hidden opacity-50 md:block lg:left-auto lg:-right-10 lg:top-8 lg:opacity-70" />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-3 py-6 sm:gap-8 sm:px-4 sm:py-10 md:px-6 md:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-10">
        {/* LEFT - Typography */}
        <div className="relative min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="inline-flex max-w-full items-center gap-1.5 overflow-hidden border border-espresso/15 bg-white px-2 py-1 text-[9px] font-mono tracking-[0.14em] text-typewriter shadow-sm dark:border-parchment/15 dark:bg-noir-soft dark:text-parchment/60 sm:gap-2 sm:px-3 sm:py-1 sm:text-[10px] sm:tracking-[0.2em]"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cherry" />
            <span className="truncate">ARCHIVAL CASE FILE № 001 — RESTRICTED</span>
            <span className="hidden shrink-0 sm:inline">• CATALOGUED ANAHEIM → LAKE PLACID</span>
          </motion.div>

          <div className="mt-4 sm:mt-6">
            <h1 className="font-display font-black leading-[0.85] tracking-[-0.03em] text-espresso dark:text-parchment">
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">LIZZY</span>
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl -mt-1 md:-mt-2">
                GRANT<span className="align-super text-[0.32em] font-normal tracking-[0.18em] sm:text-[0.35em] sm:tracking-[0.2em]">:</span>
              </span>
              <span className="block font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light italic tracking-[-0.02em] text-cherry -mt-1 sm:-mt-1.5 lg:-mt-1">
                THE ARCHIVES
              </span>
            </h1>

            {/* red underline stamp */}
            <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-3">
              <div className="hidden h-px flex-1 max-w-[200px] bg-cherry/30 dark:bg-brass/30 sm:block sm:max-w-[280px]" />
              <span className="rounded-full border border-cherry/20 bg-cherry/5 px-2.5 py-1 font-mono text-[9px] tracking-[0.14em] text-cherry dark:border-brass/20 dark:bg-brass/5 dark:text-brass sm:px-3 sm:text-[10px] sm:tracking-[0.2em]">
                EST. 1985 — NEW YORK • VOLUME I–VIII
              </span>
            </div>
          </div>

          <div className="mt-6 max-w-[560px] border-l-2 border-brass/40 pl-3 dark:border-brass/30 sm:mt-8 sm:pl-5">
            <p className="font-body text-[13px] leading-relaxed text-typewriter dark:text-parchment/70 sm:text-[14px]">
              An atmospheric anthology of a girl who turned Americana into mythology.
              <span className="font-semibold text-espresso dark:text-parchment"> Trailer parks to Chateau Marmont, </span>
              8mm grain to 70s editorial — from the first Kill Kill demo in 2008 to the tunnel under Ocean Blvd.
              Curated as a scrapbook, told as a film.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
              <span className="rounded-full border border-[#D4AF37]/15 bg-white px-2.5 py-1 font-mono text-[9px] tracking-widest text-typewriter dark:border-[#F7F4EB]/10 dark:bg-noir-soft sm:px-3 sm:text-[10px]">CINEMATIC MELANCHOLY</span>
              <span className="rounded-full border border-[#D4AF37]/15 bg-white px-2.5 py-1 font-mono text-[9px] tracking-widest text-typewriter dark:border-[#F7F4EB]/10 dark:bg-noir-soft sm:px-3 sm:text-[10px]">RETRO AMERICANA</span>
              <span className="rounded-full border border-[#D4AF37]/15 bg-white px-2.5 py-1 font-mono text-[9px] tracking-widest text-typewriter dark:border-[#F7F4EB]/10 dark:bg-noir-soft sm:px-3 sm:text-[10px]">70S EDITORIAL</span>
            </div>
          </div>

          {/* rotating quote - CLS locked: fixed min-h so buttons never jitter */}
          <div className="mt-6 flex min-h-[148px] max-w-[560px] flex-col rounded-lg border border-[#D4AF37]/15 bg-white p-4 shadow-[0_6px_16px_rgba(0,0,0,0.06)] dark:border-[#F7F4EB]/10 dark:bg-noir-soft sm:mt-8 sm:min-h-[148px] sm:p-5">
            <div className="mb-2 flex shrink-0 items-center gap-2 font-mono text-[9px] tracking-[0.18em] text-cherry sm:text-[10px] sm:tracking-[0.2em]">
              <span className="inline-block h-px w-4 bg-cherry/40 sm:w-6" />
              ROTATING LYRIC • ARCHIVAL TRANSCRIPT
            </div>
            {/* fixed height text stage — all quotes occupy same space, no layout shift */}
            <div className="relative flex h-[84px] flex-col justify-center sm:h-[72px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={qIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <p className="font-display text-[18px] italic leading-tight text-espresso dark:text-parchment sm:text-[20px] md:text-[22px]">
                    {quotes[qIndex].text}
                  </p>
                  <p className="mt-1 font-mono text-[10px] tracking-widest text-typewriter dark:text-parchment/60 sm:text-[11px]">
                    {quotes[qIndex].ref}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-auto flex shrink-0 gap-1.5 pt-3">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setQIndex(i)}
                  className={`h-1 rounded-full transition-all ${i === qIndex ? 'w-5 bg-cherry sm:w-6' : 'w-1 bg-espresso/15 dark:bg-parchment/15'}`}
                  aria-label={`Quote ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
            <Magnetic strength={0.18}>
              <a
                href="#timeline"
                onClick={(e) => { e.preventDefault(); document.querySelector('#timeline')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cherry px-5 py-3.5 font-mono text-[12px] tracking-[0.14em] text-white shadow-[0_4px_14px_rgba(158,27,27,0.2)] transition-all duration-300 ease-out hover:tracking-[0.16em] hover:bg-cherry-light hover:shadow-[0_8px_20px_rgba(158,27,27,0.3)] active:scale-[0.98] sm:w-auto sm:px-6 sm:py-3 sm:tracking-[0.15em]"
              >
                ENTER THE ERAS <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">—</span> 2005 → 2024
              </a>
            </Magnetic>
            <Magnetic strength={0.18}>
              <a
                href="#vault"
                onClick={(e) => { e.preventDefault(); document.querySelector('#vault')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#D4AF37]/20 bg-white px-5 py-3.5 font-mono text-[12px] tracking-[0.14em] text-espresso shadow-sm transition-all duration-300 ease-out hover:tracking-[0.16em] hover:bg-[#FFFEFB] hover:border-[#D4AF37]/30 hover:shadow-[0_6px_16px_rgba(0,0,0,0.07)] active:scale-[0.98] dark:border-[#F7F4EB]/15 dark:bg-noir-soft dark:text-parchment dark:hover:bg-white/10 sm:w-auto sm:px-6 sm:py-3 sm:tracking-[0.15em]"
              >
                OPEN SECRET VAULT <span className="transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
              </a>
            </Magnetic>
          </div>

          <p className="mt-3 hidden font-script text-[14px] text-typewriter dark:text-parchment/50 sm:block sm:text-[15px]">
            * hand-annotated by E.W.G — “keep the tapes running” ✎
          </p>
          <p className="mt-3 font-script text-[12px] text-typewriter/70 dark:text-parchment/50 sm:hidden">
            * E.W.G — “keep the tapes running” ✎
          </p>
        </div>

        {/* RIGHT - single main polaroid on mobile, layered collage on md+ */}
        <div className="relative flex min-w-0 flex-col gap-4 sm:gap-5 lg:pl-6">
          <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[420px] md:block md:h-[480px] lg:h-[520px]">
            {/* card 1 - main, 3D tilt on desktop pointers */}
            <Tilt
              max={6}
              className="relative w-full md:absolute md:left-1/2 md:top-2 md:w-[88%] md:-translate-x-1/2"
            >
            <motion.div
              initial={{ rotate: -2, y: 20, opacity: 0 }}
              animate={{ rotate: -1.5, y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="relative w-full rounded-lg paper border border-[#D4AF37]/15 p-2 pb-8 shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-shadow duration-300 hover:shadow-[0_16px_32px_rgba(0,0,0,0.16)] dark:border-[#F7F4EB]/10 sm:p-3 sm:pb-10"
            >
              <div className="tape -top-2 left-4 hidden rotate-[-4deg] sm:block sm:-top-3 sm:left-6" />
              <div className="tape -top-2 right-4 hidden rotate-[5deg] sm:block sm:-top-3 sm:right-6" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#2E4057]">
                <img
                  src="https://commons.wikimedia.org/wiki/Special:FilePath/Lana%20Del%20Rey%20at%20Irving%20Plaza%208.jpg?width=800"
                  alt="Lana Del Rey — Born to Die era, vintage editorial portrait, Irving Plaza 2012"
                  className="h-full w-full object-cover"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='1.2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`
                }} />
                <div className="absolute bottom-1.5 left-1.5 rounded-full bg-white/90 px-1.5 py-0.5 font-mono text-[7px] tracking-widest text-espresso sm:bottom-2 sm:left-2 sm:px-2 sm:text-[9px]">
                  BORN TO DIE — 2012 • TAKE 04
                </div>
              </div>
              <div className="absolute bottom-1.5 left-2 right-2 flex items-end justify-between sm:bottom-3 sm:left-3 sm:right-3">
                <span className="font-script text-[13px] leading-none text-espresso dark:text-parchment sm:text-[17px]">chemtrails & cherry chapstick —</span>
                <span className="font-mono text-[8px] tracking-[0.15em] text-typewriter sm:text-[9px]">FIG. 07</span>
              </div>
            </motion.div>
            </Tilt>

            {/* card 2 - desktop only layer; mobile stays single-polaroid for breathing room */}
            <motion.div
              initial={{ rotate: 3, y: 20, opacity: 0 }}
              animate={{ rotate: 2, y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="hidden rounded-lg paper border border-[#D4AF37]/15 p-2 pb-7 shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-all duration-300 hover:rotate-[-0.8deg] hover:shadow-[0_12px_24px_rgba(0,0,0,0.14)] md:absolute md:-bottom-1 md:right-1 md:block md:w-[52%] lg:-right-4"
            >
              <div className="tape -top-2 left-1/2 hidden w-12 -translate-x-1/2 rotate-[2deg] md:block" />
              <div className="aspect-[3/4] overflow-hidden rounded-md bg-[#8B7355]">
                <img
                  src="https://commons.wikimedia.org/wiki/Special:FilePath/Lana%20Del%20Rey%20live%20in%20Seattle%20%2802%29.jpg?width=400"
                  alt="Lana Del Rey — Ultraviolence era candid, Seattle 2014"
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="mt-2 text-center font-script text-[13px] text-espresso dark:text-parchment">ultraviolence babe ♡</p>
            </motion.div>

            {/* stamp badge - desktop only */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: -12 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
              className="hidden rounded-full border-2 border-cherry bg-white px-3 py-1.5 shadow-md dark:bg-noir-soft md:absolute md:left-0 md:top-[44%] md:block"
            >
              <div className="text-center leading-none">
                <div className="font-display text-[9px] font-bold tracking-[0.18em] text-cherry sm:text-[11px] sm:tracking-[0.2em]">ARCHIVED</div>
                <div className="font-mono text-[6px] tracking-[0.18em] text-typewriter sm:text-[7px] sm:tracking-[0.2em]">AUTHENTIC • 2011</div>
              </div>
            </motion.div>

            {/* brass pin - hide on very small */}
            <div className="absolute left-1/2 top-[52%] hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-brass shadow-md dark:border-noir sm:block" />
          </div>

          {/* Cassette player hero widget - hidden on mobile (<768px) to avoid duplication with fixed mini-bar */}
          <div className="paper relative hidden rounded-lg border border-[#D4AF37]/15 p-3 shadow-[0_8px_20px_rgba(0,0,0,0.06)] dark:border-[#F7F4EB]/10 sm:p-4 md:block">
            <div className="tape -top-3 left-4 hidden rotate-[-2deg] sm:block" />
            <div className="flex items-center justify-between gap-2">
              <div className="truncate font-mono text-[9px] tracking-[0.14em] text-typewriter sm:text-[10px] sm:tracking-[0.2em]">AMBIENT ARCHIVE PLAYER — SIDE A</div>
              <span className="shrink-0 rounded-full bg-cherry px-1.5 py-0.5 font-mono text-[8px] tracking-widest text-white sm:px-2 sm:text-[9px]">REC ●</span>
            </div>

            {/* cassette visual - stack on tiny screens */}
            <div className="mt-3 flex flex-col gap-3 rounded-lg border border-[#F7F4EB]/10 bg-[#1A1A1A] p-3 text-parchment shadow-inner xs:flex-row xs:items-center xs:gap-3 sm:gap-4">
              <div className="flex flex-1 items-center gap-2 sm:gap-3">
                {/* reels - smaller on mobile */}
                <div className="flex shrink-0 gap-1.5 sm:gap-2">
                  <div className={`h-7 w-7 rounded-full border-2 border-parchment/20 bg-[#2a2a2a] p-1 sm:h-9 sm:w-9 ${isPlaying ? 'animate-tape-reel' : ''}`}>
                    <div className="h-full w-full rounded-full border border-parchment/10 bg-parchment/5" style={{
                      backgroundImage: `repeating-conic-gradient(from 0deg, transparent 0 30deg, rgba(255,255,255,0.08) 30deg 60deg)`
                    }} />
                  </div>
                  <div className={`h-7 w-7 rounded-full border-2 border-parchment/20 bg-[#2a2a2a] p-1 sm:h-9 sm:w-9 ${isPlaying ? 'animate-tape-reel' : ''}`} style={{ animationDirection: 'reverse' }}>
                    <div className="h-full w-full rounded-full border border-parchment/10 bg-parchment/5" style={{
                      backgroundImage: `repeating-conic-gradient(from 0deg, transparent 0 30deg, rgba(255,255,255,0.08) 30deg 60deg)`
                    }} />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-mono text-[11px] tracking-widest text-brass-light sm:text-[12px]">
                    {currentTrack?.title || 'Video Games — Born to Die'}
                  </div>
                  <div className="truncate font-mono text-[9px] tracking-[0.12em] text-parchment/60 sm:text-[10px] sm:tracking-[0.15em]">
                    LANA DEL REY • {currentTrack?.era || 'BORN TO DIE / PARADISE'}
                  </div>
                  <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-parchment/10">
                    <motion.div
                      className="h-full bg-brass"
                      animate={{ width: isPlaying ? ['0%', '100%'] : '42%' }}
                      transition={{ duration: isPlaying ? 30 : 0, ease: 'linear', repeat: isPlaying ? Infinity : 0 }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full bg-brass text-noir shadow-md transition hover:bg-brass-light active:scale-95 sm:h-11 sm:w-11"
              >
                <span className="text-[16px] leading-none sm:text-[18px]">{isPlaying ? '❚❚' : '▶'}</span>
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[9px] tracking-widest text-typewriter sm:text-[10px]">
              <span>DOLBY B • 90 MIN • CAT. LG-001</span>
              <button
                onClick={() => setCurrentTrack({ title: 'Select a song from the eras', era: 'ARCHIVE — TAP PLAY' })}
                className="text-cherry hover:underline"
              >
                BROWSE ERAS ↓
              </button>
            </div>
            <div className="mt-2 hidden font-script text-[12px] text-typewriter/70 dark:text-parchment/50 sm:block">
              curated static — press play for the room tone of the archives
            </div>
          </div>
        </div>
      </div>

      {/* bottom paper edge */}
      <div className="h-2 w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_12px,rgba(0,0,0,0.03)_12px,rgba(0,0,0,0.03)_13px)] dark:opacity-20 sm:h-3" />
    </section>
  );
}
