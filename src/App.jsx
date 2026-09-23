import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GrainOverlay from './components/GrainOverlay';
import LoadingScreen from './components/LoadingScreen';
import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import Vault from './components/Vault';
import Tarot from './components/Tarot';
import AudioPlayer from './components/AudioPlayer';
import Footer from './components/Footer';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

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
      <AnimatePresence>{loading && <LoadingScreen onDone={() => setLoading(false)} />}</AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: loading ? 0 : 0.2 }}
      >
        <GrainOverlay />
        {!loading && <ScrollProgress />}

        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <main>
          <Hero
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentTrack={currentTrack}
            setCurrentTrack={setCurrentTrack}
          />
          <Timeline setCurrentTrack={setCurrentTrack} setIsPlaying={setIsPlaying} />
          <Vault />
          <Tarot />
        </main>

        <Footer />

        <AudioPlayer
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          currentTrack={currentTrack}
          setCurrentTrack={setCurrentTrack}
        />

        {/* accessibility skip */}
        <a
          href="#timeline"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-cherry focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to eras
        </a>
      </motion.div>
    </div>
  );
}
