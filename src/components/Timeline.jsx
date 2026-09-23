import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eras } from '../data/eras';

export default function Timeline({ setCurrentTrack, setIsPlaying }) {
  const [activeId, setActiveId] = useState(eras[1].id); // Born to Die default
  const active = eras.find((e) => e.id === activeId) || eras[0];
  const scrollRef = useRef(null);

  return (
    <section id="timeline" className="relative mx-auto max-w-[1400px] overflow-x-hidden px-3 py-8 sm:px-4 sm:py-12 md:px-6 md:py-16">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8 sm:gap-4">
        <div className="min-w-0">
          <div className="font-mono text-[10px] tracking-[0.2em] text-cherry sm:text-[11px] sm:tracking-[0.25em]">02 — INTERACTIVE CHRONOLOGY</div>
          <h2 className="mt-1.5 font-display text-[28px] font-bold leading-none tracking-[-0.02em] text-espresso dark:text-parchment sm:mt-2 sm:text-[36px] md:text-[52px]">
            THE ERAS <span className="font-light italic text-typewriter text-[22px] sm:text-[28px] md:text-[36px]">— {eras.length} chapters</span>
          </h2>
          <p className="mt-2 max-w-[640px] font-body text-[12.5px] leading-relaxed text-typewriter dark:text-parchment/60 sm:mt-3 sm:text-[13px]">
            Each era is an aesthetic world. Tap the timeline to enter. Songs are <em className="text-espresso dark:text-parchment">archival previews</em> — select one to cue the cassette.
          </p>
        </div>
        <div className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-typewriter md:flex">
          <span className="h-2 w-2 rounded-full bg-cherry animate-pulse" />
          {eras.length} ERAS CATALOGUED • 2005 → PRESENT
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[300px_1fr]">
        {/* Timeline nav - horizontal on mobile, vertical on desktop */}
        <div className="relative min-w-0">
          {/* vertical line - desktop only */}
          <div className="absolute bottom-6 left-[11px] top-6 hidden w-px bg-espresso/10 dark:bg-parchment/10 lg:block" />
          
          {/* mobile hint */}
          <div className="mb-2 flex items-center gap-2 font-mono text-[9px] tracking-[0.15em] text-typewriter/70 sm:text-[10px] lg:hidden">
            <span>← SWIPE TO EXPLORE →</span>
            <span className="h-px flex-1 bg-espresso/10 dark:bg-parchment/10" />
          </div>

          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scroll-smooth pb-3 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0"
            style={{ scrollbarWidth: 'none' }}
          >
            <style>{`.snap-x::-webkit-scrollbar{display:none}`}</style>
            {eras.map((era) => {
              const isActive = era.id === activeId;
              return (
                <button
                  key={era.id}
                  onClick={() => setActiveId(era.id)}
                  className={`group relative flex shrink-0 snap-start items-center gap-2.5 rounded-lg border px-2.5 py-2.5 text-left transition-all duration-300 ease-out sm:gap-3 sm:px-3 sm:py-3 lg:w-full ${
                    isActive
                      ? 'border-cherry bg-cherry text-white shadow-[0_4px_12px_rgba(158,27,27,0.2)]'
                      : 'border-[#D4AF37]/15 bg-white hover:border-[#D4AF37]/30 hover:bg-[#FFFEFB] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:border-[#F7F4EB]/10 dark:bg-noir-soft dark:hover:bg-noir'
                  } min-w-[148px] sm:min-w-[170px] lg:min-w-0`}
                >
                  {/* dot - desktop only */}
                  <span
                    className={`hidden h-[10px] w-[10px] shrink-0 rounded-full border-2 lg:block ${
                      isActive ? 'border-white bg-white' : 'border-cherry bg-parchment dark:bg-noir'
                    }`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className={`block font-mono text-[9px] tracking-[0.12em] sm:text-[10px] sm:tracking-[0.15em] ${isActive ? 'text-white/80' : 'text-typewriter'}`}>
                      {era.year}
                    </span>
                    <span className={`block font-display text-[12px] font-semibold leading-tight sm:text-[13px] ${isActive ? 'text-white' : 'text-espresso dark:text-parchment'}`}>
                      {era.title}
                    </span>
                    <span className={`hidden truncate text-[11px] lg:block ${isActive ? 'text-white/70' : 'text-typewriter'}`}>
                      {era.subtitle}
                    </span>
                  </span>
                  {isActive && <span className="hidden text-white lg:block">→</span>}
                </button>
              );
            })}
          </div>

          <div className="mt-3 hidden rounded-lg border border-dashed border-[#D4AF37]/20 bg-parchment-dark/40 p-3 shadow-sm dark:border-[#F7F4EB]/10 dark:bg-noir-soft/50 lg:block">
            <div className="font-mono text-[10px] tracking-[0.2em] text-typewriter">CURATOR NOTE</div>
            <p className="mt-1 font-script text-[13px] leading-snug text-typewriter dark:text-parchment/70">
              Click any era — the board updates like a lightbox. The cassette follows you.
            </p>
          </div>
        </div>

        {/* Detail stage */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="paper relative min-w-0 overflow-hidden rounded-lg border border-[#D4AF37]/15 shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:border-[#F7F4EB]/10"
          >
            {/* top bar - stack on mobile */}
            <div className="flex flex-col gap-2.5 border-b border-espresso/10 bg-white px-3 py-3 dark:border-parchment/10 dark:bg-noir-soft sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-5">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="rounded-full bg-cherry px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-white sm:px-2.5 sm:text-[10px] sm:tracking-[0.15em]">
                  {active.year}
                </span>
                <span className="font-mono text-[9px] tracking-[0.14em] text-typewriter sm:text-[10px] sm:tracking-[0.2em]">
                  MOOD — {active.mood}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {active.palette.map((c) => (
                  <span key={c} className="h-4 w-4 rounded-full border border-black/5 shadow-sm sm:h-5 sm:w-5" style={{ background: c }} title={c} />
                ))}
              </div>
            </div>

            <div className="grid gap-5 p-3 sm:gap-6 sm:p-5 md:p-7 lg:grid-cols-[1.4fr_0.9fr]">
              <div className="min-w-0">
                <h3 className="font-display text-[24px] font-bold leading-none tracking-[-0.02em] text-espresso dark:text-parchment sm:text-[30px] md:text-[36px]">
                  {active.title}
                  <span className="mt-1 block font-body text-[13px] font-normal italic tracking-normal text-cherry sm:text-[14px]">
                    {active.subtitle}
                  </span>
                </h3>

                <div className="mt-3 border-l-2 border-brass/40 pl-3 dark:border-brass/30 sm:mt-4 sm:pl-4">
                  <p className="font-script text-[13px] leading-snug text-cherry/80 dark:text-brass/80 sm:text-[15px]">
                    {active.curatorNote}
                  </p>
                </div>

                <p className="mt-3 font-body text-[13px] leading-relaxed text-typewriter dark:text-parchment/70 sm:mt-4 sm:text-[13.5px]">
                  {active.description}
                </p>

                <div className="mt-4 sm:mt-5">
                  <div className="font-mono text-[9px] tracking-[0.18em] text-typewriter sm:text-[10px] sm:tracking-[0.2em]">AESTHETIC DOSSIER</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="inline-flex max-w-full rounded-full border border-espresso/10 bg-parchment-dark px-2.5 py-1.5 font-mono text-[10px] leading-snug tracking-wide text-espresso dark:border-parchment/10 dark:bg-noir dark:text-parchment/70 sm:px-3 sm:text-[11px]">
                      {active.aesthetic}
                    </span>
                  </div>
                </div>
              </div>

              {/* Songs / moodboard */}
              <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
                <div className="rounded-lg border border-[#D4AF37]/15 bg-parchment-dark/40 p-2.5 shadow-sm dark:border-[#F7F4EB]/10 dark:bg-noir/40 sm:p-3">
                  <div className="font-mono text-[9px] tracking-[0.18em] text-typewriter sm:text-[10px] sm:tracking-[0.2em]">NOTABLE CUTS — TAP TO CUE CASSETTE</div>
                  <div className="mt-2.5 flex flex-col gap-2 sm:mt-3">
                    {active.songs.map((s) => (
                      <button
                        key={s.title}
                        onClick={async () => {
                          // fetch genuine 30s preview for this exact song title (no more "fake" mismatch)
                          let preview = null;
                          try {
                            const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(`lana del rey ${s.title}`)}&entity=song&limit=5`);
                            const json = await res.json();
                            let m = json.results?.find((r) => r.previewUrl && r.trackName.toLowerCase().includes(s.title.toLowerCase().split(' (')[0].toLowerCase()) && r.artistName.toLowerCase().includes('lana'));
                            if (!m) m = json.results?.find((r) => r.previewUrl && r.artistName.toLowerCase().includes('lana'));
                            if (m?.previewUrl) preview = m.previewUrl;
                          } catch {}
                          if (preview) {
                            setCurrentTrack({ title: `${s.title} — ${active.title}`, era: active.title.toUpperCase(), src: preview, source: 'iTUNES' });
                          } else {
                            // fallback: try Deezer, then just display title with local fallback in AudioPlayer
                            try {
                              const dz = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(`Lana Del Rey ${s.title}`)}`);
                              const dj = await dz.json();
                              const f = dj.data?.find((x) => x.title.toLowerCase().includes(s.title.toLowerCase().split(' (')[0].toLowerCase()) && x.artist.name.toLowerCase().includes('lana')) || dj.data?.[0];
                              if (f?.preview) {
                                setCurrentTrack({ title: `${s.title} — ${active.title}`, era: active.title.toUpperCase(), src: f.preview, source: 'DEEZER' });
                              } else {
                                setCurrentTrack({ title: `${s.title} — ${active.title}`, era: active.title.toUpperCase() });
                              }
                            } catch {
                              setCurrentTrack({ title: `${s.title} — ${active.title}`, era: active.title.toUpperCase() });
                            }
                          }
                          setIsPlaying(true);
                        }}
                        className="group flex items-center gap-2.5 rounded-lg border border-[#D4AF37]/15 bg-white px-2.5 py-2.5 text-left shadow-sm transition-all duration-300 hover:border-[#D4AF37]/30 hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)] active:scale-[0.99] dark:border-[#F7F4EB]/10 dark:bg-noir-soft sm:gap-3 sm:px-3"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-espresso text-[11px] text-white group-hover:bg-cherry dark:bg-parchment dark:text-noir dark:group-hover:bg-cherry dark:group-hover:text-white sm:h-8 sm:w-8 sm:text-[12px]">
                          ▶
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-[12px] font-semibold leading-tight text-espresso dark:text-parchment sm:text-[13px]">
                            {s.title}
                          </span>
                          <span className="block truncate font-mono text-[9px] tracking-wide text-typewriter sm:text-[10px]">
                            {s.note} • {s.duration}
                          </span>
                        </span>
                        <span className="hidden font-mono text-[10px] tracking-widest text-cherry sm:block sm:opacity-0 sm:group-hover:opacity-100">
                          PLAY
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Polaroid mini - accurate photography */}
                <div className="paper relative border border-espresso/5 p-2 pb-6 shadow-md sm:p-2 sm:pb-7">
                  <div className="tape -top-2 left-1/2 hidden w-12 -translate-x-1/2 rotate-[1deg] sm:block" />
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-typewriter/5">
                    <img
                      src={active.image}
                      alt={active.imageAlt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                      <div className="font-display text-[12px] font-bold tracking-[0.12em] text-white drop-shadow sm:text-[14px]">{active.title.toUpperCase()}</div>
                      <div className="font-mono text-[8px] tracking-[0.14em] text-white/85 sm:text-[9px]">{active.year} • {active.subtitle}</div>
                    </div>
                    <div className="absolute right-2 top-2 rounded-full bg-white/90 px-1.5 py-0.5 font-mono text-[7px] tracking-widest text-espresso shadow sm:text-[8px]">
                      FIG. {String(eras.findIndex((e) => e.id === active.id) + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="absolute bottom-1 left-2 right-2 flex justify-between gap-2 font-mono text-[7px] tracking-[0.1em] text-typewriter sm:bottom-1.5 sm:left-3 sm:right-3 sm:text-[8px]">
                    <span className="truncate">REF. {active.id.toUpperCase()} • {active.imageCredit}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* bottom perforated edge - stack on mobile */}
            <div className="flex flex-col gap-1 border-t border-dashed border-espresso/10 px-3 py-2.5 dark:border-parchment/10 sm:flex-row sm:items-center sm:gap-2 sm:px-5">
              <span className="font-mono text-[8px] tracking-[0.12em] text-typewriter sm:text-[9px] sm:tracking-[0.2em]">FILED UNDER: {active.title.toUpperCase()} / CAT. {active.id.toUpperCase()}</span>
              <span className="font-mono text-[8px] tracking-[0.15em] text-cherry sm:ml-auto sm:text-[9px] sm:tracking-[0.2em]">● ANALOG MASTER</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
