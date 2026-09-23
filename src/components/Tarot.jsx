import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tarotCards } from '../data/tarot';

export default function Tarot() {
  const [flipped, setFlipped] = useState(null); // id
  const [activeId, setActiveId] = useState(null);

  const active = tarotCards.find((c) => c.id === activeId) || tarotCards[0];
  const isFlipped = (id) => flipped === id;

  return (
    <section id="tarot" className="relative mx-auto max-w-[1400px] overflow-x-hidden px-3 py-8 sm:px-4 sm:py-12 md:px-6 md:py-16">
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <div className="font-mono text-[10px] tracking-[0.2em] text-cherry sm:text-[11px] sm:tracking-[0.25em]">04 — LYRICAL TAROT</div>
          <h2 className="mt-1.5 font-display text-[26px] font-bold leading-none tracking-[-0.02em] text-espresso dark:text-parchment sm:mt-2 sm:text-[34px] md:text-[48px]">
            FLIP A CARD <span className="font-light italic text-typewriter text-[20px] sm:text-[26px] md:text-[34px]">— receive a lyric</span>
          </h2>
          <p className="mt-2 max-w-[640px] font-body text-[12.5px] leading-relaxed text-typewriter dark:text-parchment/60 sm:mt-3 sm:text-[13px]">
            Each card is a vintage tarot reinterpreted through Lana’s lyricism. Tap to flip — the
            <em className="text-espresso dark:text-parchment"> breakdown</em> appears on the back. Draw as many as you like; the deck reshuffles.
          </p>
        </div>
        <button
          onClick={() => {
            setFlipped(null);
            setActiveId(null);
          }}
          className="self-start rounded-full border border-espresso/15 bg-white px-3 py-2 font-mono text-[11px] tracking-[0.12em] text-espresso shadow-sm hover:bg-espresso hover:text-parchment active:scale-95 dark:border-parchment/15 dark:bg-noir-soft dark:text-parchment dark:hover:bg-parchment dark:hover:text-noir sm:self-auto sm:px-4 sm:tracking-[0.15em]"
        >
          RESHUFFLE DECK ↺
        </button>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.7fr_0.9fr]">
        {/* deck grid - 2 cols mobile, 4 cols sm+ */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-4">
          {tarotCards.map((card) => {
            const flippedState = isFlipped(card.id);
            return (
              <div
                key={card.id}
                className="perspective-[1000px] min-w-0"
                style={{ perspective: 1000 }}
              >
                <motion.button
                  onClick={() => {
                    setFlipped(flippedState ? null : card.id);
                    setActiveId(card.id);
                  }}
                  className="relative block h-[196px] w-full text-left [transform-style:preserve-3d] sm:h-[220px] md:h-[260px]"
                  animate={{ rotateY: flippedState ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  style={{ transformStyle: 'preserve-3d' }}
                  aria-label={`Tarot card ${card.name} - ${flippedState ? 'flipped' : 'face down'}`}
                >
                  {/* FRONT (back of tarot) */}
                  <div
                    className="absolute inset-0 flex flex-col overflow-hidden rounded-lg border-2 p-2 shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.2)] [backface-visibility:hidden] sm:p-3"
                    style={{
                      background: `linear-gradient(135deg, #1A1A1A 0%, #2E4057 100%)`,
                      borderColor: flippedState ? 'transparent' : '#D4AF37',
                    }}
                  >
                    {/* brass border inner */}
                    <div className="flex h-full flex-col rounded-md border border-brass/25 p-1.5 sm:p-2">
                      <div className="flex items-center justify-between font-mono text-[8px] tracking-[0.14em] text-brass/70 sm:text-[9px] sm:tracking-[0.2em]">
                        <span>{card.arcana}</span>
                        <span>LG TAROT</span>
                      </div>
                      <div className="flex flex-1 flex-col items-center justify-center text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brass/20 bg-brass/10 text-brass-light sm:h-16 sm:w-16">
                          <span className="font-display text-[18px] sm:text-[22px]">✦</span>
                        </div>
                        <div className="mt-2 font-display text-[9px] font-bold tracking-[0.12em] text-parchment sm:mt-3 sm:text-[11px] sm:tracking-[0.15em]">
                          {card.name.split('—')[0].trim()}
                        </div>
                        <div className="font-mono text-[7px] tracking-[0.14em] text-parchment/50 sm:text-[8px] sm:tracking-[0.2em]">
                          TAP TO REVEAL
                        </div>
                      </div>
                      <div className="hidden text-center font-mono text-[7px] tracking-[0.18em] text-brass/50 sm:block sm:text-[8px] sm:tracking-[0.2em]">
                        • ARCHIVES EDITION •
                      </div>
                    </div>
                  </div>

                  {/* BACK (lyric) */}
                  <div
                    className="absolute inset-0 flex flex-col overflow-hidden rounded-lg border border-[#D4AF37]/20 bg-white p-2 shadow-[0_8px_20px_rgba(0,0,0,0.08)] [backface-visibility:hidden] dark:bg-noir-soft dark:border-[#F7F4EB]/10 sm:p-3"
                    style={{
                      transform: 'rotateY(180deg)',
                      borderColor: card.color,
                    }}
                  >
                    <div className="flex items-center justify-between border-b border-dashed border-espresso/10 pb-1.5 dark:border-parchment/10 sm:pb-2">
                      <span className="rounded-full px-1.5 py-0.5 font-mono text-[8px] tracking-[0.12em] text-white sm:px-2 sm:text-[9px] sm:tracking-[0.15em]" style={{ background: card.color }}>
                        {card.theme.toUpperCase()}
                      </span>
                      <span className="font-mono text-[8px] tracking-[0.12em] text-typewriter sm:text-[9px] sm:tracking-[0.15em]">{card.arcana}</span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center py-1 sm:py-2">
                      <p className="font-display text-[11.5px] font-bold italic leading-tight text-espresso dark:text-parchment sm:text-[13px]">
                        {card.lyric}
                      </p>
                      <p className="mt-1 font-mono text-[9px] tracking-wide text-cherry sm:mt-1.5 sm:text-[10px]">
                        {card.song}
                      </p>
                      <p className="mt-1.5 line-clamp-3 font-body text-[10.5px] leading-relaxed text-typewriter dark:text-parchment/70 sm:mt-2 sm:line-clamp-4 sm:text-[11.5px]">
                        {card.meaning}
                      </p>
                    </div>
                    <div className="pt-1 text-center font-mono text-[8px] tracking-[0.12em] text-typewriter sm:pt-2 sm:text-[9px] sm:tracking-[0.15em]">
                      TAP TO CLOSE ✕
                    </div>
                  </div>
                </motion.button>
                {/* label under card */}
                <div className="mt-1.5 text-center sm:mt-2">
                  <div className="truncate font-mono text-[9px] tracking-[0.08em] text-typewriter sm:text-[10px] sm:tracking-[0.12em]">
                    {card.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reading panel */}
        <div className="paper min-w-0 overflow-hidden rounded-lg border border-[#D4AF37]/15 shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:border-[#F7F4EB]/10 lg:sticky lg:top-[88px] lg:self-start">
          <div className="border-b border-espresso/10 bg-white px-4 py-3 dark:border-parchment/10 dark:bg-noir-soft sm:px-5">
            <div className="font-mono text-[9px] tracking-[0.18em] text-cherry sm:text-[10px] sm:tracking-[0.2em]">CURRENT READING</div>
            <div className="mt-1 font-display text-[11px] tracking-[0.12em] text-typewriter sm:text-[12px] sm:tracking-[0.15em]">
              {activeId ? 'CARD DRAWN • INTERPRETATION BELOW' : 'DRAW A CARD TO BEGIN'}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="p-4 sm:p-5 md:p-6"
            >
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-[9px] tracking-[0.16em] text-typewriter sm:text-[10px] sm:tracking-[0.2em]">
                    {active.arcana} • {active.theme.toUpperCase()}
                  </div>
                  <h3 className="mt-1 font-display text-[16px] font-bold leading-tight text-espresso dark:text-parchment sm:text-[20px]">
                    {active.name}
                  </h3>
                </div>
                <span
                  className="h-8 w-8 shrink-0 rounded-full border-2 border-white shadow-sm sm:h-9 sm:w-9"
                  style={{ background: active.color }}
                  aria-hidden
                />
              </div>

              <div className="mt-3 rounded-lg border border-[#D4AF37]/15 bg-parchment-dark/40 p-3 shadow-sm dark:border-[#F7F4EB]/10 dark:bg-noir sm:mt-4 sm:p-4">
                <p className="font-display text-[15px] italic leading-snug text-espresso dark:text-parchment sm:text-[18px]">
                  {active.lyric}
                </p>
                <p className="mt-1.5 font-mono text-[10px] tracking-wide text-cherry sm:mt-2 sm:text-[11px]">
                  — {active.song}
                </p>
              </div>

              <div className="mt-3 sm:mt-4">
                <div className="font-mono text-[9px] tracking-[0.18em] text-typewriter sm:text-[10px] sm:tracking-[0.2em]">THEMATIC BREAKDOWN</div>
                <p className="mt-1 font-body text-[12.5px] leading-relaxed text-typewriter dark:text-parchment/70 sm:mt-1.5 sm:text-[13px]">
                  {active.meaning}
                </p>
              </div>

              <div className="mt-4 flex gap-2 sm:mt-5">
                <button
                  onClick={() => {
                    const idx = tarotCards.findIndex((c) => c.id === active.id);
                    const next = tarotCards[(idx + 1) % tarotCards.length];
                    setActiveId(next.id);
                    setFlipped(next.id);
                  }}
                  className="flex-1 rounded-full bg-cherry px-3 py-2.5 font-mono text-[11px] tracking-[0.12em] text-white hover:bg-cherry-light active:scale-95 sm:px-4 sm:tracking-[0.15em]"
                >
                  NEXT →
                </button>
                <button
                  onClick={() => {
                    const random = tarotCards[Math.floor(Math.random() * tarotCards.length)];
                    setActiveId(random.id);
                    setFlipped(random.id);
                  }}
                  className="rounded-full border border-espresso/15 bg-white px-3 py-2.5 font-mono text-[11px] tracking-[0.12em] text-espresso hover:bg-espresso hover:text-parchment active:scale-95 dark:border-parchment/15 dark:bg-noir-soft dark:text-parchment sm:px-4 sm:tracking-[0.15em]"
                >
                  RANDOM
                </button>
              </div>

              <p className="mt-3 text-center font-script text-[11px] text-typewriter/60 dark:text-parchment/50 sm:mt-4 sm:text-[12px]">
                “you write what you live” — scrawled on the back of the deck ✎
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
