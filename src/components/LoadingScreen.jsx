import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const duration = 1600;
    let raf;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(p);
      if (elapsed < duration) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 320);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-parchment dark:bg-noir"
    >
      {/* subtle grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      {/* archival stamp */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative text-center"
      >
        <div className="font-mono text-[10px] tracking-[0.3em] text-typewriter">ARCHIVAL ACCESS / CAT. LG-1985—2024</div>
        <div className="mt-3 font-display text-[28px] font-black tracking-[0.14em] text-espresso dark:text-parchment sm:text-[34px]">
          LIZZY GRANT <span className="font-light">: ARCHIVES</span>
        </div>
        <div className="mt-1 font-mono text-[10px] tracking-[0.2em] text-cherry">AN ATMOSPHERIC ANTHOLOGY — LOADING</div>
        <div className="mx-auto mt-5 h-px w-48 bg-espresso/10 dark:bg-parchment/10" />
      </motion.div>

      {/* progress bar like tape counter */}
      <div className="relative mt-8 w-[260px] sm:w-[320px]">
        <div className="flex justify-between font-mono text-[10px] tracking-[0.15em] text-typewriter">
          <span>TAPE REWIND</span>
          <span>{String(progress).padStart(3, '0')}%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-espresso/10 dark:bg-parchment/10">
          <motion.div
            className="h-full bg-cherry"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-center font-script text-[13px] text-typewriter/60">* keep the tapes running —</div>
      </div>

      {/* footer */}
      <div className="absolute bottom-6 font-mono text-[9px] tracking-[0.2em] text-typewriter/50">
        EST. LAKE PLACID → LOS ANGELES / 2005 → 2026
      </div>
    </motion.div>
  );
}
