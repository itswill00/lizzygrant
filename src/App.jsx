import { Suspense, lazy, useEffect, useState } from 'react';
import GrainOverlay from './components/GrainOverlay';
import { DustCanvas } from './components/Fx';
import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AudioPlayer from './components/AudioPlayer';
import Footer from './components/Footer';

const Timeline = lazy(() => import('./components/Timeline'));
const Vault = lazy(() => import('./components/Vault'));
const Tarot = lazy(() => import('./components/Tarot'));
const Muses = lazy(() => import('./components/Muses'));
const Louisiana = lazy(() => import('./components/Louisiana'));
const Gallery = lazy(() => import('./components/Gallery'));
const Discography = lazy(() => import('./components/Discography'));
const JeremyPage = lazy(() => import('./pages/Jeremy'));

function SectionFallback({ label }) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6" aria-hidden>
      <div className="animate-pulse rounded-2xl border border-[#D4AF37]/15 bg-white/60 p-6 dark:bg-white/5">
        <div className="font-mono text-[10px] tracking-[0.2em] text-typewriter">{label} — LOADING ARCHIVE…</div>
        <div className="mt-3 h-2 w-2/3 rounded-full bg-espresso/10 dark:bg-white/10" />
        <div className="mt-2 h-2 w-1/2 rounded-full bg-espresso/10 dark:bg-white/10" />
      </div>
    </div>
  );
}

function Hub() {
  const cards = [
    { href: '/eras', k: '02', label: 'The Eras', sub: '2005 → 2024 · 8 chapters', desc: 'Interactive chronology — tap timeline, enter an era.' },
    { href: '/vault', k: '03', label: 'Secret Vault', sub: '17 files · unreleased & lore', desc: 'Case files — tapes, poetry, interview lore.' },
    { href: '/tarot', k: '04', label: 'Lyrical Tarot', sub: 'Ask · Shuffle · Draw', desc: 'Lyric as reading — shuffle and draw.' },
    { href: '/muses', k: '05', label: 'Muses & Lovers', sub: 'Barrie → Jeremy · fan readings', desc: 'Every love left a song — public chapters only.' },
    { href: '/louisiana', k: '06', label: 'Louisiana Now', sub: 'Journal · Waffle House → Wedding', desc: 'Living journal — newest first, developing.' },
    { href: '/gallery', k: '07', label: 'Contact Sheet', sub: '22 frames · loupe', desc: 'Proof prints 2011 → 2025 — tap for loupe.' },
    { href: '/discography', k: '08', label: 'Discography', sub: '9 releases · 122 tracks', desc: 'Every record, every standard track — tap to preview.' },
    { href: '/jeremy', k: '09', label: 'Lana + Jeremy', sub: 'New · photos & timeline', desc: 'The Louisiana peace — how they met, married.' },
  ];
  return (
    <section className="mx-auto max-w-[1400px] px-3 py-8 sm:px-4 md:px-6 md:py-10">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] tracking-[0.25em] text-cherry">ARCHIVE INDEX</div>
          <h2 className="mt-1 font-display text-[22px] font-bold tracking-[-0.02em] text-espresso dark:text-parchment sm:text-[26px]">Browse the archive</h2>
          <p className="mt-1 max-w-[560px] font-body text-[13.5px] leading-[1.6] text-typewriter">Home is now a hub — pick a chapter. Each page is its own tape, lighter to load.</p>
        </div>
        <span className="hidden font-mono text-[10px] tracking-[0.15em] text-typewriter/60 sm:block">8 CHAPTERS</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <a key={c.href} href={c.href} className="group rounded-2xl border border-zinc-200 bg-white p-4 shadow-[0_6px_16px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.08)] dark:border-zinc-800 dark:bg-zinc-900">
            <div className="font-sans text-[11px] font-medium tracking-[0.08em] text-zinc-500">{c.k} — {c.label.toUpperCase()}</div>
            <div className="mt-1 font-sans text-[16px] font-semibold leading-tight tracking-tight text-zinc-900 group-hover:text-cherry dark:text-white">{c.label}</div>
            <div className="font-sans text-[12px] leading-tight text-zinc-500 dark:text-zinc-400">{c.sub}</div>
            <p className="mt-2 line-clamp-2 font-sans text-[13px] leading-[1.6] text-zinc-600 dark:text-zinc-400">{c.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 font-sans text-[11px] font-medium tracking-[0.08em] text-cherry">OPEN →</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [path, setPath] = useState(typeof window !== 'undefined' ? window.location.pathname : '/');

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setDarkMode(true);
  }, []);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    // hash redirect: /#vault -> /vault etc
    if (window.location.hash) {
      const h = window.location.hash.replace('#', '');
      const map = { timeline: '/eras', eras: '/eras', vault: '/vault', tarot: '/tarot', muses: '/muses', now: '/louisiana', louisiana: '/louisiana', gallery: '/gallery', discography: '/discography', jeremy: '/jeremy', hero: '/' };
      if (map[h]) {
        history.replaceState(null, '', map[h]);
        setPath(map[h]);
      }
    }
    // intercept internal nav to keep SPA without reload
    const onClick = (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('/') || href.startsWith('//') || a.target === '_blank' || e.metaKey || e.ctrlKey) return;
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      e.preventDefault();
      history.pushState(null, '', url.pathname);
      setPath(url.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('click', onClick);
    };
  }, []);

  const renderRoute = () => {
    if (path === '/jeremy') return <Suspense fallback={<SectionFallback label="JEREMY" />}><JeremyPage /></Suspense>;
    if (path === '/eras' || path === '/timeline') return <Suspense fallback={<SectionFallback label="02 — THE ERAS" />}><Timeline setCurrentTrack={setCurrentTrack} setIsPlaying={setIsPlaying} /></Suspense>;
    if (path === '/vault') return <Suspense fallback={<SectionFallback label="03 — VAULT" />}><Vault /></Suspense>;
    if (path === '/tarot') return <Suspense fallback={<SectionFallback label="04 — TAROT" />}><Tarot setCurrentTrack={setCurrentTrack} setIsPlaying={setIsPlaying} /></Suspense>;
    if (path === '/muses') return <Suspense fallback={<SectionFallback label="05 — MUSES" />}><Muses setCurrentTrack={setCurrentTrack} setIsPlaying={setIsPlaying} /></Suspense>;
    if (path === '/louisiana' || path === '/now') return <Suspense fallback={<SectionFallback label="06 — LOUISIANA" />}><Louisiana /></Suspense>;
    if (path === '/gallery') return <Suspense fallback={<SectionFallback label="07 — GALLERY" />}><Gallery /></Suspense>;
    if (path === '/discography') return <Suspense fallback={<SectionFallback label="08 — DISCOGRAPHY" />}><Discography setCurrentTrack={setCurrentTrack} setIsPlaying={setIsPlaying} /></Suspense>;
    if (path === '/' || path === '/index.html') return (
      <>
        <Hero isPlaying={isPlaying} setIsPlaying={setIsPlaying} currentTrack={currentTrack} setCurrentTrack={setCurrentTrack} />
        <Hub />
      </>
    );
    return (
      <div className="mx-auto max-w-[640px] px-6 py-16 text-center">
        <div className="font-mono text-[10px] tracking-[0.2em] text-cherry">404 — TAPE NOT FOUND</div>
        <h1 className="mt-3 font-display text-2xl font-bold text-espresso dark:text-parchment">This shelf is empty.</h1>
        <a href="/" className="mt-6 inline-block rounded-full bg-cherry px-5 py-2.5 font-mono text-[12px] tracking-[0.15em] text-white">BACK TO ARCHIVES →</a>
      </div>
    );
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-cherry focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
      <div>
        <GrainOverlay />
        <DustCanvas />
        <ScrollProgress />
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="h-[56px] md:h-[64px] lg:h-[92px]" aria-hidden />
        <main id="main">{renderRoute()}</main>
        <Footer />
        <AudioPlayer isPlaying={isPlaying} setIsPlaying={setIsPlaying} currentTrack={currentTrack} setCurrentTrack={setCurrentTrack} />
      </div>
    </div>
  );
}
