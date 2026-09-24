import { motion } from 'framer-motion';
import { useState } from 'react';

const photos = [
  { src: '/jeremy/02.webp', fallback: '/jeremy/02.jpg', alt: 'Lana and Jeremy, seated at RRL event, Western Wear', cap: 'RRL Western Wear, together at event, 2025' },
  { src: '/jeremy/03.webp', fallback: '/jeremy/03.jpg', alt: 'Lana and Jeremy, close, RRL caps', cap: 'RRL, close, same night, his cap forward' },
  { src: '/jeremy/04.webp', fallback: '/jeremy/04.jpg', alt: 'Lana and Jeremy, black-white selfie on boat, Ford cap', cap: 'On the boat, black-white selfie, lake behind' },
  { src: '/jeremy/08.webp', fallback: '/jeremy/08.jpg', alt: 'Lana and Jeremy, full seated with boots, RRL', cap: 'Seated full, boots, dresses, RRL' },
  { src: '/jeremy/11.webp', fallback: '/jeremy/11.jpg', alt: 'Lana and Jeremy, laughing outside, car behind', cap: 'Laughing outside, his RRL cap, her phone in hand' },
  { src: '/jeremy/10.webp', fallback: '/jeremy/10.jpg', alt: 'Lana and Jeremy, talking to guests at event', cap: 'Talking to guests, same leather, same night' },
  { src: '/jeremy/05.webp', fallback: '/jeremy/05.jpg', alt: 'Lana and Jeremy, bayou, Coke, airboat behind', cap: 'Bayou, Coke on shoulder, airboat behind, 2024' },
  { src: '/jeremy/06.webp', fallback: '/jeremy/06.jpg', alt: 'Lana and Jeremy, sitting on dock, evening', cap: 'Dock at dusk, sitting together, Indiana vibes' },
  { src: '/jeremy/13.webp', fallback: '/jeremy/13.jpg', alt: 'Lana and Jeremy, dancing in workshop, COSTA shirt', cap: 'Dancing in the bayou workshop, COSTA, denim shorts' },
  { src: '/jeremy/14.webp', fallback: '/jeremy/14.jpg', alt: 'Lana and Jeremy, wedding cake Love on the Bayou', cap: 'Cake, “Love on the Bayou” (from fan archive)' },
  { src: '/jeremy/15.webp', fallback: '/jeremy/15.jpg', alt: 'Lana and Jeremy, holding hands at altar', cap: 'Hands, altar, Sep 26 2024' },
];

export default function Jeremy() {
  const [visible, setVisible] = useState(6);
  const shown = photos.slice(0, visible);
  return (
    <div className="mx-auto max-w-[1100px] px-3 py-8 sm:px-4 md:px-6 md:py-10">
      <a href="/" className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-white px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-typewriter hover:bg-[#F7F4EB] dark:border-[#F7F4EB]/10 dark:bg-noir-soft dark:text-parchment">← BACK TO ARCHIVES</a>

      <div className="mt-6 paper overflow-hidden rounded-2xl border border-[#D4AF37]/15 shadow-[0_12px_28px_rgba(0,0,0,0.08)] dark:border-[#F7F4EB]/10">
        <div className="bg-[#1A1A1A] p-0">
          <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
            <div className="relative aspect-[3/4] overflow-hidden bg-[#2E4057]">
              <picture>
                <source srcSet={photos[0].src} type="image/webp" />
                <img src={photos[0].fallback} alt={photos[0].alt} className="h-full w-full object-cover" loading="eager" fetchPriority="high" />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[9px] tracking-[0.15em] text-espresso">ARCHIVE / LANA x JEREMY</div>
            </div>
            <div className="p-5 sm:p-6">
              <div className="font-mono text-[10px] tracking-[0.25em] text-cherry">JEREMY · THE LOUISIANA PEACE</div>
              <h1 className="mt-2 font-display text-[28px] font-black leading-[0.9] tracking-[-0.02em] text-espresso dark:text-parchment sm:text-[34px]">LANA DEL REY <span className="font-light italic text-cherry">+ Jeremy</span></h1>
              <p className="mt-3 max-w-[560px] font-body text-[14px] leading-[1.75] text-typewriter dark:text-parchment/70">Airboat captain from Des Allemandes, Louisiana, chemical plant to shrimp boat to captain's license. Met Lana on a swamp tour in 2019 (Facebook album), reconnected spring 2024, married September 26, 2024 on the bayou where he runs Airboat Tours by Arthur. Pastor Judah Smith officiated. No stadium, family only.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#D4AF37]/15 bg-parchment-dark px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-typewriter">2019 · FIRST TOUR</span>
                <span className="rounded-full border border-[#D4AF37]/15 bg-parchment-dark px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-typewriter">MAY 2024 · RECONNECTED</span>
                <span className="rounded-full bg-cherry px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-white">SEP 26, 2024 · MARRIED</span>
              </div>
              <p className="mt-3 font-mono text-[10px] tracking-[0.12em] text-typewriter/60">Photos from fan archives, Instagram via HyperDL (clarawoneltok, delreys.poetry, pagesix). Private wedding snaps are theirs.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-3 sm:p-5">
          {shown.map((p, i) => (
            <motion.figure key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="overflow-hidden rounded-2xl border border-[#D4AF37]/15 bg-white dark:border-[#F7F4EB]/10 dark:bg-noir-soft">
              <div className="aspect-[3/4] overflow-hidden bg-parchment-dark">
                <picture>
                  <source srcSet={p.src} type="image/webp" />
                  <img src={p.fallback} alt={p.alt} loading={i < 3 ? 'eager' : 'lazy'} fetchPriority={i < 3 ? 'high' : undefined} className="h-full w-full object-cover" />
                </picture>
              </div>
              <figcaption className="p-2.5 font-mono text-[10px] leading-[1.6] tracking-[0.06em] text-typewriter">{p.cap}</figcaption>
            </motion.figure>
          ))}
        </div>
        {visible < photos.length && (
          <div className="flex justify-center p-4">
            <button onClick={() => setVisible((v) => Math.min(v + 6, photos.length))} className="rounded-full border border-zinc-200 bg-white px-5 py-2.5 font-sans text-[13px] font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">Load more, {photos.length - visible} left</button>
          </div>
        )}

        <div className="border-t border-dashed border-[#D4AF37]/15 p-4 dark:border-[#F7F4EB]/10 sm:p-5">
          <div className="font-mono text-[10px] tracking-[0.2em] text-cherry">TIMELINE · HOW IT HAPPENED</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              { d: '2019', t: 'First airboat with Jeremy', x: 'Lana posts Facebook album from Arthur’s Airboat Tours. Caption: pleasure to run across Jeremy on tours. Tourists, gators, family vibes.' },
              { d: 'MAY 2024', t: 'My guy', x: 'After Hangout Festival, Instagram “my guy”, first public hint. Hand-holding at Reading/Leeds later that summer.' },
              { d: 'SEP 7, 2024', t: 'Karen Elson wedding, public debut as couple', x: 'Seen together at Electric Lady Studios with Taylor Swift & Travis Kelce in attendance. Soft launch.' },
              { d: 'SEP 26, 2024', t: 'Des Allemandes, outdoor bayou ceremony', x: 'Married where they met: near Airboat Tours by Arthur, Des Allemandes ~1h from New Orleans. Father Robert Grant walks her. Judah Smith officiates. License filed Oct 18 in Lafourche Parish.' },
              { d: '2025-2026', t: 'Bayou life, cabin, Paris & Ralph Lauren', x: 'Airboat, birthday crowns, captain hats “Bride/Groom”, cabin with branch furniture, Paris Fashion Week Valentino kiss Oct 2025, Ralph Lauren Fall 2026. Feb 2026 single “White Feather Hawk Tail Deer Hunter” co-credited to Jeremy.' },
            ].map((e) => (
              <div key={e.d} className="rounded-2xl border border-[#D4AF37]/15 bg-parchment/40 p-3 dark:border-[#F7F4EB]/10 dark:bg-white/5">
                <div className="font-mono text-[10px] tracking-[0.15em] text-cherry">{e.d}</div>
                <div className="mt-1 font-display text-[14px] font-bold leading-tight text-espresso dark:text-parchment">{e.t}</div>
                <p className="mt-1 font-body text-[13.5px] leading-[1.7] text-typewriter dark:text-parchment/70">{e.x}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 font-body text-[13.5px] italic leading-[1.7] text-typewriter/70 dark:text-parchment/60">Sources: People, Billboard, Rolling Stone UK, AP via Lafourche Parish Clerk, Today, NOLA.com. This is a fan-curated timeline, for the private moments, we leave the frame empty on purpose.</p>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-[#D4AF37]/15 bg-parchment-dark/30 p-3 dark:border-[#F7F4EB]/10 sm:p-4">
          <a href="/#muses" className="rounded-full bg-cherry px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-white">← MUSES & LOVERS</a>
          <a href="/#now" className="rounded-full border border-[#D4AF37]/20 bg-white px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-espresso dark:border-[#F7F4EB]/10 dark:bg-noir-soft dark:text-parchment">LOUISIANA NOW →</a>
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-[760px] text-center font-mono text-[10px] tracking-[0.14em] text-typewriter/60">Fan page, not affiliated. Photos: Wikimedia Commons (CC-BY-SA) + bayou texture. Wedding snaps are theirs.</p>
    </div>
  );
}
