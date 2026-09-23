import { motion } from 'framer-motion';
import { nowEntries } from '../data/now';

export default function Louisiana() {
  return (
    <section id="now" className="relative overflow-x-hidden bg-espresso/[0.02] py-8 dark:bg-parchment/[0.02] sm:py-12 md:py-16">
      <div className="mx-auto max-w-[1400px] px-3 sm:px-4 md:px-6">
        <div className="mb-6 sm:mb-8">
          <div className="font-mono text-[10px] tracking-[0.2em] text-cherry sm:text-[11px] sm:tracking-[0.25em]">06 — LOUISIANA NOW</div>
          <h2 className="mt-1.5 font-display text-[26px] font-bold leading-none tracking-[-0.02em] text-espresso dark:text-parchment sm:mt-2 sm:text-[34px] md:text-[48px]">
            THE PEACE <span className="font-light italic text-typewriter text-[20px] sm:text-[26px] md:text-[34px]">is not a metaphor anymore</span>
          </h2>
          <p className="mt-2 max-w-[640px] font-body text-[14.5px] leading-[1.75] text-typewriter dark:text-parchment/60 sm:mt-3 sm:text-[15px]">
            A living journal — between Los Angeles and the bayou. Newest first, updated as the tape keeps running.
          </p>
        </div>

        <div className="relative mx-auto max-w-[760px]">
          <div className="absolute bottom-4 left-[13px] top-4 w-px bg-[#D4AF37]/25 dark:bg-[#F7F4EB]/10 sm:left-[15px]" aria-hidden />
          <div className="flex flex-col gap-4 sm:gap-5">
            {nowEntries.map((e, idx) => (
              <motion.article
                key={e.date + e.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: Math.min(idx * 0.04, 0.2) }}
                className={`relative rounded-lg border bg-white p-4 shadow-[0_6px_16px_rgba(0,0,0,0.05)] dark:bg-noir-soft sm:p-5 ${
                  e.featured
                    ? 'border-[#D4AF37]/40 shadow-[0_10px_28px_rgba(212,175,55,0.15)]'
                    : 'border-[#D4AF37]/15 dark:border-[#F7F4EB]/10'
                }`}
              >
                <span
                  className={`absolute left-[7px] top-5 h-[13px] w-[13px] rounded-full border-2 border-white shadow sm:left-[9px] ${
                    e.featured ? 'bg-brass' : 'bg-cherry/80'
                  }`}
                  aria-hidden
                />
                <div className="pl-6 sm:pl-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 font-mono text-[9px] tracking-[0.14em] text-white ${e.featured ? 'bg-brass text-noir' : 'bg-cherry'}`}>
                      {e.date}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.18em] text-typewriter/60">{e.tag}</span>
                  </div>
                  <h3 className="mt-2 font-display text-[17px] font-bold leading-tight text-espresso dark:text-parchment sm:text-[20px]">
                    {e.title}
                  </h3>
                  <p className="mt-1.5 font-body text-[14px] leading-[1.75] text-typewriter dark:text-parchment/70 sm:text-[15px]">
                    {e.text}
                  </p>
                  {e.featured && (
                    <p className="mt-3 border-t border-dashed border-[#D4AF37]/25 pt-2.5 font-body text-[14px] italic text-typewriter/70 dark:text-parchment/50">
                      “The Louisiana peace” — filed forever ✎
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-[760px] text-center font-mono text-[10px] tracking-[0.14em] text-typewriter/60 sm:mt-8">
          DEVELOPING STORY • LAST CHECKED THIS WEEK — THE TAPE IS STILL RUNNING ●
        </p>
      </div>
    </section>
  );
}
