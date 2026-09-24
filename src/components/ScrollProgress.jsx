import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const scrollTop = window.scrollY;
      const scrollHeight = doc.scrollHeight - window.innerHeight;
      const p = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, p)));
    };
    // rAF-throttled: setState per scroll event re-renders every frame while scrolling
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[3px] bg-espresso/5 dark:bg-parchment/5">
      {/* ruler ticks */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent 0 8px, rgba(158,27,27,0.15) 8px 9px, transparent 9px 40px)`,
        }}
      />
      <div
        className="relative h-full bg-gradient-to-r from-cherry via-cherry to-brass shadow-[0_1px_4px_rgba(158,27,27,0.3)]"
        style={{ width: `${progress}%` }}
      >
        {/* brass tip */}
        <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rounded-full border border-white bg-brass shadow" />
      </div>
      {/* archival label */}
      <div className="absolute right-2 top-1 hidden font-mono text-[10px] tracking-[0.15em] text-typewriter/60 sm:block" style={{ transform: 'translateY(6px)' }}>
        ARCHIVE PROGRESS · {Math.round(progress)}%
      </div>
    </div>
  );
}
