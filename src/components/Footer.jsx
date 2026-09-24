export default function Footer({ onNavigate }) {
  const goTop = () => window.scrollTo({ top: 0 });
  const go = (href) => {
    if (onNavigate) onNavigate(href);
    else window.scrollTo({ top: 0 });
  };

  return (
    <footer className="overflow-x-hidden border-t border-[#D4AF37]/15 bg-[#FFFEFB] dark:border-[#F7F4EB]/10 dark:bg-noir-soft">
      {/* top delicate hairline */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 sm:py-12 md:px-6 md:py-16">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_0.9fr] md:gap-10">
          {/* left, back flap */}
          <div className="min-w-0">
            <div className="font-display text-[14px] font-bold tracking-[0.18em] text-espresso dark:text-parchment sm:text-[15px]">
              LIZZY GRANT: THE ARCHIVES
            </div>
            <div className="mt-1.5 font-mono text-[10px] tracking-[0.18em] text-[#9E1B1B]/70 dark:text-[#E8C76A]/60">
              VOLUME I-VIII / FIRST LIMITED EDITION
            </div>
            <p className="mt-4 max-w-[38ch] font-body text-[14px] leading-[1.75] text-typewriter dark:text-parchment/70">
              A fan archival project dedicated to <em className="font-display italic text-espresso dark:text-parchment">Elizabeth Woolridge Grant</em>.
              Compiled with love, reverence, and continuous tape loops, from a trailer in Lake Placid to the tunnel under Ocean Blvd.
            </p>
            <p className="mt-3 font-body text-[13.5px] italic leading-[1.7] text-typewriter/70 dark:text-parchment/50">
              “We were born to die, but we were born to remember.”
            </p>
            <div className="mt-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-typewriter/50">
              <span className="h-px w-8 bg-[#D4AF37]/40" />
              <span>Curated as a private pressing, not for resale</span>
            </div>
          </div>

          {/* middle, vinyl sleeve colophon */}
          <div className="relative min-w-0 rounded-2xl border border-[#D4AF37]/20 bg-parchment/40 p-4 shadow-[0_8px_24px_rgba(212,175,55,0.08)] backdrop-blur-sm dark:border-[#F7F4EB]/10 dark:bg-white/[0.04] sm:p-5">
            {/* subtle paper glow */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-transparent" />
            <div className="relative">
              <div className="font-mono text-[10px] tracking-[0.22em] text-[#9E1B1B] dark:text-[#E8C76A]">COLOPHON · SLEEVE NOTES</div>
              <div className="mt-3 space-y-2 font-body text-[13.5px] leading-[1.75] text-typewriter dark:text-parchment/70">
                <p>
                  <span className="font-mono text-[11px] tracking-[0.12em] text-espresso dark:text-parchment">Typography</span>: Set in Playfair Display & Courier Prime, with handwritten marginalia in Dancing Script.
                </p>
                <p>
                  <span className="font-mono text-[11px] tracking-[0.12em] text-espresso dark:text-parchment">Photographs</span>: Courtesy of Wikimedia Commons contributors, preserved under CC-BY-SA. Cropped gently, never harshly.
                </p>
                <p>
                  <span className="font-mono text-[11px] tracking-[0.12em] text-espresso dark:text-parchment">Music & artwork</span>: All songs, recordings, and covers belong to their respective copyright holders. 30-second previews via official sources for reverent listening.
                </p>
              </div>
              <div className="mt-4 border-t border-dashed border-[#D4AF37]/20 pt-3 font-mono text-[10px] tracking-[0.14em] text-typewriter/70 dark:text-parchment/60">
                Not affiliated with Lana Del Rey. Made by a listener, for listeners. If you love it, buy the record. Covers low-res for identification under fair use.
              </div>
            </div>
          </div>

          {/* right, actions tactile */}
          <div className="flex min-w-0 flex-col gap-4">
            <div className="rounded-2xl border border-[#D4AF37]/15 bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)] dark:border-[#F7F4EB]/10 dark:bg-noir">
              <div className="font-mono text-[10px] tracking-[0.18em] text-typewriter">KEEP LISTENING</div>
              <p className="mt-1.5 font-body text-[14px] leading-[1.75] text-typewriter dark:text-parchment/70">
                The tape never really ends. Flip it, rewind it, stay a little longer in the haze.
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                <button
                  onClick={() => goTop()}
                  className="group flex w-full items-center justify-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#FFFEFB] px-4 py-3 font-mono text-[11px] tracking-[0.14em] text-espresso shadow-sm transition-colors duration-300 ease-out hover:bg-[#F7F4EB] hover:shadow-[0_4px_12px_rgba(212,175,55,0.15)] active:scale-[0.98] dark:border-[#F7F4EB]/15 dark:bg-noir-soft dark:text-parchment dark:hover:bg-white/10"
                >
                  <span>BACK TO TOP</span>
                  <span>↑</span>
                </button>
                <button
                  onClick={() => go('/eras')}
                  className="group flex w-full items-center justify-center gap-2 rounded-full bg-cherry px-4 py-3 font-mono text-[11px] tracking-[0.14em] text-white shadow-[0_4px_12px_rgba(158,27,27,0.2)] transition-colors duration-300 ease-out hover:bg-[#B83232] hover:shadow-[0_6px_16px_rgba(158,27,27,0.3)] active:scale-[0.98]"
                >
                  <span>RE-ENTER THE ERAS</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            <div className="text-center font-mono text-[10px] tracking-[0.12em] text-typewriter/50">
              Press <span className="rounded-full bg-[#F7F4EB] px-2 py-0.5 text-cherry dark:bg-white/10 dark:text-[#E8C76A]">Play</span> and let it run.
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-[#D4AF37]/15 pt-5 text-center font-mono text-[9px] tracking-[0.14em] text-typewriter/60 dark:border-[#F7F4EB]/10 sm:flex-row sm:justify-between sm:text-left sm:text-[10px]">
          <span className="leading-relaxed">
            © 2026 THE ARCHIVES, A private pressing for educational remembrance. <span className="hidden sm:inline">/</span> All rights belong to their owners.
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cherry/80 shadow-[0_0_6px_rgba(158,27,27,0.4)]" />
            CATALOGUED WITH CARE / “Keep the tapes running”, LDR
          </span>
        </div>
      </div>
    </footer>
  );
}
