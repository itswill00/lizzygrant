import { Suspense, lazy, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GrainOverlay from './components/GrainOverlay';
import { DustCanvas } from './components/Fx';
import LoadingScreen from './components/LoadingScreen';
import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AudioPlayer from './components/AudioPlayer';
import Footer from './components/Footer';

// Below-fold sections lazy-loaded: smaller initial JS, faster first paint
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

export default function App() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const isJeremy = typeof window !== 'undefined' && window.location.pathname === '/jeremy';

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // respect system preference on first load
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-cherry focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <AnimatePresence>{loading && <LoadingScreen onDone={() => setLoading(false)} />}</AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: loading ? 0 : 0.2 }}
      >
        <GrainOverlay />
        {!loading && <DustCanvas />}
        {!loading && <ScrollProgress />}

        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="h-[56px] md:h-[64px] lg:h-[92px]" aria-hidden />

        {isJeremy ? (
          <main id="main">
            <Suspense fallback={<SectionFallback label="JEREMY — LANA & JEREMY" />}>
              <JeremyPage />
            </Suspense>
          </main>
        ) : (
          <main id="main">
            <Hero
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              currentTrack={currentTrack}
              setCurrentTrack={setCurrentTrack}
            />
            <div className="cv-auto">
              <Suspense fallback={<SectionFallback label="02 — THE ERAS" />}>
                <Timeline setCurrentTrack={setCurrentTrack} setIsPlaying={setIsPlaying} />
              </Suspense>
            </div>
            <div className="cv-auto">
              <Suspense fallback={<SectionFallback label="03 — SECRET VAULT" />}>
                <Vault />
              </Suspense>
            </div>
            <div className="cv-auto">
              <Suspense fallback={<SectionFallback label="04 — LYRICAL TAROT" />}>
                <Tarot setCurrentTrack={setCurrentTrack} setIsPlaying={setIsPlaying} />
              </Suspense>
            </div>
            <div className="cv-auto">
              <Suspense fallback={<SectionFallback label="05 — MUSES & LOVERS" />}>
                <Muses setCurrentTrack={setCurrentTrack} setIsPlaying={setIsPlaying} />
              </Suspense>
            </div>
            <div className="cv-auto">
              <Suspense fallback={<SectionFallback label="06 — LOUISIANA NOW" />}>
                <Louisiana />
              </Suspense>
            </div>
            <div className="cv-auto">
              <Suspense fallback={<SectionFallback label="07 — CONTACT SHEET" />}>
                <Gallery />
              </Suspense>
            </div>
            <div className="cv-auto">
              <Suspense fallback={<SectionFallback label="08 — COMPLETE DISCOGRAPHY" />}>
                <Discography setCurrentTrack={setCurrentTrack} setIsPlaying={setIsPlaying} />
              </Suspense>
            </div>
          </main>
        )}

        <Footer />

        <AudioPlayer
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          currentTrack={currentTrack}
          setCurrentTrack={setCurrentTrack}
        />

      </motion.div>
    </div>
  );
}
