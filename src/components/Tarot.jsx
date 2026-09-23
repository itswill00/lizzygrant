import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tarotCards } from '../data/tarot';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function fetchPreviewFor(songTitle) {
  const clean = songTitle.split('—')[0].split('(')[0].trim();
  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(`lana del rey ${clean}`)}&entity=song&limit=5`);
    const json = await res.json();
    let m = json.results?.find((r) => r.previewUrl && r.trackName?.toLowerCase().includes(clean.toLowerCase().split(' ')[0]) && r.artistName?.toLowerCase().includes('lana'));
    if (!m) m = json.results?.find((r) => r.previewUrl && r.artistName?.toLowerCase().includes('lana'));
    if (m?.previewUrl) return { src: m.previewUrl, source: 'iTUNES' };
  } catch {}
  try {
    const dz = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(`Lana Del Rey ${clean}`)}`);
    const dj = await dz.json();
    const f = dj.data?.[0];
    if (f?.preview) return { src: f.preview, source: 'DEEZER' };
  } catch {}
  return {};
}

export default function Tarot({ setCurrentTrack, setIsPlaying }) {
  const [order, setOrder] = useState(tarotCards.map((c) => c.id));
  const [flipped, setFlipped] = useState({}); // id -> true
  const [activeId, setActiveId] = useState(null);
  const [spread, setSpread] = useState('single'); // single | three
  const [drawn, setDrawn] = useState([]); // ordered drawn ids for spread
  const [intention, setIntention] = useState('');
  const [history, setHistory] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hearing, setHearing] = useState(null); // card id loading preview

  const active = tarotCards.find((c) => c.id === activeId) || null;
  const flippedCount = Object.keys(flipped).length;

  const doShuffle = () => {
    setIsShuffling(true);
    setFlipped({});
    setActiveId(null);
    setDrawn([]);
    setTimeout(() => {
      setOrder(shuffle(tarotCards.map((c) => c.id)));
      setIsShuffling(false);
    }, 550);
  };

  const pushHistory = (ids) => {
    const entry = {
      ids,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intention: intention.trim().slice(0, 60) || null,
      spread,
    };
    setHistory((h) => [entry, ...h].slice(0, 5));
  };

  const drawRitual = () => {
    const pool = shuffle(order);
    const count = spread === 'three' ? 3 : 1;
    const picked = pool.slice(0, count);
    // stagger flips for ceremony
    setFlipped({});
    setDrawn(picked);
    picked.forEach((id, i) => {
      setTimeout(() => {
        setFlipped((f) => ({ ...f, [id]: true }));
        if (i === 0) setActiveId(id);
      }, 250 * (i + 1));
    });
    setTimeout(() => pushHistory(picked), 250 * count + 100);
  };

  const toggleCard = (id) => {
    const isOpen = !!flipped[id];
    if (isOpen) {
      setFlipped((f) => {
        const n = { ...f };
        delete n[id];
        return n;
      });
    } else {
      setFlipped((f) => ({ ...f, [id]: true }));
      setActiveId(id);
      if (!drawn.includes(id)) setDrawn((d) => [...d, id].slice(-3));
      pushHistory([id]);
    }
  };

  const hearSong = async (card) => {
    setHearing(card.id);
    const songTitle = card.song.split('—')[0].trim();
    const prev = await fetchPreviewFor(songTitle);
    setHearing(null);
    if (setCurrentTrack) {
      setCurrentTrack({
        title: `${songTitle} — TAROT READING`,
        era: 'LYRICAL TAROT',
        ...(prev.src ? { src: prev.src, source: prev.source } : {}),
      });
    }
    if (setIsPlaying) setIsPlaying(true);
  };

  const copyLyric = async (card) => {
    if (!card) return;
    try {
      await navigator.clipboard.writeText(`${card.lyric} — ${card.song}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const orderedCards = order.map((id) => tarotCards.find((c) => c.id === id)).filter(Boolean);
  const spreadLabels = ['PAST — where it ached', 'PRESENT — where it lives', 'FUTURE — where it heals'];

  return (
    <section id="tarot" className="relative mx-auto max-w-[1400px] overflow-x-hidden px-3 py-8 sm:px-4 sm:py-12 md:px-6 md:py-16">
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <div className="font-mono text-[10px] tracking-[0.2em] text-cherry sm:text-[11px] sm:tracking-[0.25em]">04 — LYRICAL TAROT</div>
          <h2 className="mt-1.5 font-display text-[26px] font-bold leading-none tracking-[-0.02em] text-espresso dark:text-parchment sm:mt-2 sm:text-[34px] md:text-[48px]">
            ASK. SHUFFLE. <span className="font-light italic text-typewriter text-[20px] sm:text-[26px] md:text-[34px]">draw your lyric</span>
          </h2>
          <p className="mt-2 max-w-[640px] font-body text-[14.5px] leading-[1.75] text-typewriter dark:text-parchment/60 sm:mt-3 sm:text-[15px]">
            Not decoration — a reading. Set an intention, shuffle the deck, draw. Each card answers
            with a real lyric, its meaning, and the song itself on the cassette.
          </p>
        </div>
      </div>

      {/* ritual bar */}
      <div className="mb-6 rounded-lg border border-[#D4AF37]/20 bg-white p-3 shadow-[0_6px_16px_rgba(0,0,0,0.05)] dark:border-[#F7F4EB]/10 dark:bg-noir-soft sm:mb-8 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#D4AF37]/15 bg-parchment/50 px-3 py-2.5 dark:border-[#F7F4EB]/10 dark:bg-white/5">
            <span className="shrink-0 font-mono text-[10px] tracking-[0.18em] text-typewriter">✦ INTENTION</span>
            <input
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="e.g. what should I let go of? (optional)"
              maxLength={80}
              className="min-w-0 flex-1 bg-transparent font-body text-[14px] text-espresso outline-none placeholder:text-typewriter/40 dark:text-parchment"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-[#D4AF37]/20 p-0.5 dark:border-[#F7F4EB]/10">
              {['single', 'three'].map((s) => (
                <button
                  key={s}
                  onClick={() => { setSpread(s); setFlipped({}); setDrawn([]); setActiveId(null); }}
                  className={`rounded-full px-3.5 py-2 font-mono text-[11px] tracking-[0.12em] transition-all duration-300 ${spread === s ? 'bg-cherry text-white shadow' : 'text-typewriter hover:text-espresso dark:hover:text-parchment'}`}
                >
                  {s === 'single' ? '1 CARD' : '3 CARDS'}
                </button>
              ))}
            </div>
            <button
              onClick={doShuffle}
              className="rounded-full border border-[#D4AF37]/20 bg-white px-3.5 py-2 font-mono text-[11px] tracking-[0.12em] text-espresso transition-all duration-300 hover:bg-[#F7F4EB] active:scale-95 dark:border-[#F7F4EB]/15 dark:bg-noir-soft dark:text-parchment"
            >
              {isShuffling ? 'SHUFFLING…' : 'SHUFFLE ↺'}
            </button>
            <button
              onClick={drawRitual}
              className="rounded-full bg-cherry px-5 py-2 font-mono text-[11px] tracking-[0.12em] text-white shadow-[0_4px_12px_rgba(158,27,27,0.25)] transition-all duration-300 hover:bg-cherry-light hover:shadow-[0_6px_16px_rgba(158,27,27,0.35)] active:scale-95"
            >
              DRAW ✦
            </button>
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-typewriter/70">
          <span>{flippedCount} CARD{flippedCount === 1 ? '' : 'S'} OPEN</span>
          <span className="h-3 w-px bg-espresso/10 dark:bg-parchment/10" />
          <span>{spread === 'three' ? 'PAST • PRESENT • FUTURE' : 'SINGLE PULL'}</span>
          {intention.trim() && (
            <>
              <span className="h-3 w-px bg-espresso/10 dark:bg-parchment/10" />
              <span className="truncate">FOR: “{intention.trim().slice(0, 40)}”</span>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.7fr_0.9fr]">
        {/* deck grid */}
        <div>
          <motion.div
            key={order.join(',') + String(isShuffling)}
            initial={isShuffling ? { x: 0 } : false}
            animate={isShuffling ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
            transition={{ duration: 0.55 }}
            className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-4"
          >
            {orderedCards.map((card, i) => {
              const isOpen = !!flipped[card.id];
              const spreadPos = drawn.indexOf(card.id);
              return (
                <div key={card.id} className="min-w-0" style={{ perspective: 1000 }}>
                  <motion.button
                    onClick={() => toggleCard(card.id)}
                    className="relative block h-[196px] w-full text-left sm:h-[220px] md:h-[260px]"
                    animate={{ rotateY: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    style={{ transformStyle: 'preserve-3d' }}
                    aria-label={`Tarot card ${card.name} - ${isOpen ? 'revealed' : 'face down'}`}
                  >
                    <div
                      className="absolute inset-0 flex flex-col overflow-hidden rounded-lg border-2 p-2 shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:shadow-[0_12px_28px_rgba(0,0,0,0.2)] [backface-visibility:hidden] sm:p-3"
                      style={{ background: `linear-gradient(135deg, #1A1A1A 0%, #2E4057 100%)`, borderColor: isOpen ? 'transparent' : '#D4AF37' }}
                    >
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

                    <div
                      className="absolute inset-0 flex flex-col overflow-hidden rounded-lg border bg-white p-2 shadow-[0_8px_20px_rgba(0,0,0,0.08)] [backface-visibility:hidden] dark:bg-noir-soft dark:border-[#F7F4EB]/10 sm:p-3"
                      style={{ transform: 'rotateY(180deg)', borderColor: card.color }}
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
                        <p className="mt-1.5 line-clamp-3 font-body text-[12px] leading-[1.7] text-typewriter dark:text-parchment/70 sm:mt-2 sm:line-clamp-4 sm:text-[13px]">
                          {card.meaning}
                        </p>
                      </div>
                      <div className="pt-1 text-center font-mono text-[8px] tracking-[0.12em] text-typewriter sm:pt-2 sm:text-[9px] sm:tracking-[0.15em]">
                        TAP TO CLOSE ✕
                      </div>
                    </div>
                  </motion.button>
                  <div className="mt-1.5 text-center sm:mt-2">
                    <div className="truncate font-mono text-[9px] tracking-[0.08em] text-typewriter sm:text-[10px] sm:tracking-[0.12em]">
                      {spread === 'three' && spreadPos !== -1 ? `${['I — PAST', 'II — PRESENT', 'III — FUTURE'][spreadPos]} • ` : `#${i + 1} • `}{card.name.split('—')[0].trim()}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* history strip */}
          {history.length > 0 && (
            <div className="mt-5 rounded-lg border border-dashed border-[#D4AF37]/20 bg-parchment/40 p-3 dark:border-[#F7F4EB]/10 dark:bg-white/5">
              <div className="font-mono text-[10px] tracking-[0.18em] text-typewriter">READING LOG — LAST {history.length}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {history.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const first = h.ids[0];
                      setFlipped((f) => ({ ...f, [first]: true }));
                      setActiveId(first);
                      setDrawn(h.ids);
                    }}
                    className="rounded-full border border-[#D4AF37]/20 bg-white px-2.5 py-1 font-mono text-[10px] tracking-wide text-typewriter transition hover:bg-[#F7F4EB] dark:border-[#F7F4EB]/10 dark:bg-noir-soft"
                    title={h.intention || 'no intention'}
                  >
                    {h.time} • {h.ids.map((id) => tarotCards.find((c) => c.id === id)?.name.split('—')[0].trim()).join(' + ')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reading panel */}
        <div className="paper min-w-0 overflow-hidden rounded-lg border border-[#D4AF37]/15 shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:border-[#F7F4EB]/10 lg:sticky lg:top-[88px] lg:self-start">
          <div className="border-b border-espresso/10 bg-white px-4 py-3 dark:border-parchment/10 dark:bg-noir-soft sm:px-5">
            <div className="font-mono text-[9px] tracking-[0.18em] text-cherry sm:text-[10px] sm:tracking-[0.2em]">CURRENT READING</div>
            <div className="mt-1 font-display text-[11px] tracking-[0.12em] text-typewriter sm:text-[12px] sm:tracking-[0.15em]">
              {!active ? 'DRAW A CARD TO BEGIN' : spread === 'three' && drawn.length > 1 ? `${drawn.length}-CARD SPREAD • TAP CARDS TO READ EACH` : 'CARD DRAWN • LISTEN BELOW'}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active ? active.id : 'empty'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="p-4 sm:p-5 md:p-6"
            >
              {!active ? (
                <div className="py-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/25 bg-brass/10 font-display text-[22px] text-brass">✦</div>
                  <p className="mt-3 font-display text-[16px] italic text-espresso dark:text-parchment">The deck is waiting.</p>
                  <p className="mt-1 font-body text-[13.5px] leading-[1.75] text-typewriter">Set an intention above, hit <span className="font-mono text-cherry">DRAW ✦</span>, and the lyric will answer.</p>
                  <button onClick={drawRitual} className="mt-4 rounded-full bg-cherry px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] text-white transition hover:bg-cherry-light active:scale-95">
                    DRAW MY CARD ✦
                  </button>
                </div>
              ) : (
                <>
                  {spread === 'three' && drawn.length > 1 && (
                    <div className="mb-3 flex gap-1.5">
                      {drawn.map((id, i) => (
                        <button
                          key={id}
                          onClick={() => setActiveId(id)}
                          className={`flex-1 rounded-lg border px-2 py-1.5 font-mono text-[9px] tracking-[0.1em] transition ${id === active.id ? 'border-cherry bg-cherry text-white' : 'border-[#D4AF37]/20 text-typewriter hover:bg-[#F7F4EB] dark:hover:bg-white/5'}`}
                        >
                          {['PAST', 'PRESENT', 'FUTURE'][i] || `CARD ${i + 1}`}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="min-w-0">
                      <div className="font-mono text-[9px] tracking-[0.16em] text-typewriter sm:text-[10px] sm:tracking-[0.2em]">
                        {active.arcana} • {active.theme.toUpperCase()}
                        {spread === 'three' && drawn.includes(active.id) && ` • ${spreadLabels[drawn.indexOf(active.id)]}`}
                      </div>
                      <h3 className="mt-1 font-display text-[16px] font-bold leading-tight text-espresso dark:text-parchment sm:text-[20px]">
                        {active.name}
                      </h3>
                    </div>
                    <span className="h-8 w-8 shrink-0 rounded-full border-2 border-white shadow-sm sm:h-9 sm:w-9" style={{ background: active.color }} aria-hidden />
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
                    <p className="mt-1 font-body text-[14px] leading-[1.75] text-typewriter dark:text-parchment/70 sm:mt-1.5 sm:text-[15px]">
                      {active.meaning}
                    </p>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5">
                    <button
                      onClick={() => hearSong(active)}
                      disabled={hearing === active.id}
                      className="col-span-2 flex items-center justify-center gap-2 rounded-lg bg-espresso px-4 py-3 font-mono text-[11px] tracking-[0.14em] text-parchment transition-all duration-300 hover:bg-noir hover:shadow-[0_6px_16px_rgba(0,0,0,0.2)] active:scale-[0.98] dark:bg-parchment dark:text-noir"
                    >
                      <span>{hearing === active.id ? 'CUEING…' : '▶ HEAR THIS SONG'}</span>
                    </button>
                    <button onClick={() => copyLyric(active)} className="rounded-lg border border-[#D4AF37]/20 bg-white px-3 py-2.5 font-mono text-[11px] tracking-[0.12em] text-espresso transition hover:bg-[#F7F4EB] active:scale-95 dark:border-[#F7F4EB]/15 dark:bg-noir-soft dark:text-parchment">
                      {copied ? 'COPIED ✓' : 'COPY LYRIC'}
                    </button>
                    <button
                      onClick={drawRitual}
                      className="rounded-lg bg-cherry px-3 py-2.5 font-mono text-[11px] tracking-[0.12em] text-white transition hover:bg-cherry-light active:scale-95"
                    >
                      DRAW AGAIN ✦
                    </button>
                  </div>

                  <p className="mt-3 text-center font-body text-[13px] italic text-typewriter/60 dark:text-parchment/50 sm:mt-4 sm:text-[13.5px]">
                    “you write what you live” — scrawled on the back of the deck ✎
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
