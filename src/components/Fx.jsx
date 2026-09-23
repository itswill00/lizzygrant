import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const finePointer = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(pointer: fine)').matches;

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Floating film-dust particles: single canvas, DPR capped, pauses offscreen */
export function DustCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let running = true;
    let frame = 0;
    let w = 0;
    let h = 0;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.25);
    const isMobile = window.innerWidth < 640;
    const N = isMobile ? 18 : 42;
    const parts = Array.from({ length: N }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.8,
      s: 0.0004 + Math.random() * 0.0012,
      sway: Math.random() * Math.PI * 2,
      swaySpd: 0.002 + Math.random() * 0.006,
      a: 0.12 + Math.random() * 0.3,
      tw: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onVis = () => {
      running = document.visibilityState === 'visible';
      if (running) loop();
    };
    document.addEventListener('visibilitychange', onVis);

    const loop = () => {
      if (!running) return;
      // throttle to ~30fps: full-screen canvas at 60fps janks low-end GPUs
      frame++;
      if (frame % 2 === 0) {
        ctx.clearRect(0, 0, w, h);
      const dark = document.documentElement.classList.contains('dark');
      for (const p of parts) {
        p.y -= p.s;
        p.sway += p.swaySpd;
        p.tw += 0.02;
        if (p.y < -0.02) {
          p.y = 1.02;
          p.x = Math.random();
        }
        const x = (p.x + Math.sin(p.sway) * 0.008) * w;
        const y = p.y * h;
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dark ? `rgba(232,199,106,${alpha})` : `rgba(120,90,40,${alpha})`;
        ctx.fill();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  if (typeof window !== 'undefined' && reducedMotion()) return null;
  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2] opacity-70"
    />
  );
}

/* 3D tilt wrapper: rotateX/rotateY springs + soft glare. Desktop pointers only. */
export function Tilt({ children, max = 7, className = '' }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 180, damping: 20, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 180, damping: 20, mass: 0.6 });
  const glare = useTransform(gx, [0, 100], [0, 0.22]);

  if (!finePointer() || reducedMotion()) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={className}
      style={{ perspective: 950 }}
      onMouseMove={(e) => {
        const el = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - el.left) / el.width - 0.5;
        const py = (e.clientY - el.top) / el.height - 0.5;
        ry.set(px * max * 2);
        rx.set(-py * max * 2);
        gx.set((px + 0.5) * 100);
        gy.set((py + 0.5) * 100);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      <motion.div
        className="will-tilt relative"
        style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
      >
        {children}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-lg"
          style={{
            opacity: glare,
            background: useTransform(
              [gx, gy],
              ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.5), transparent 60%)`
            ),
          }}
        />
      </motion.div>
    </div>
  );
}

/* Scroll reveal: opacity + rise, once, transform-only */
export function Reveal({ children, delay = 0, className = '' }) {
  if (reducedMotion()) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}

/* Magnetic hover: gently pulls CTA toward cursor, springs back */
export function Magnetic({ children, strength = 0.22, className = '' }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  if (!finePointer() || reducedMotion()) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const el = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (el.left + el.width / 2)) * strength);
        y.set((e.clientY - (el.top + el.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* Floating vinyl: pure-CSS 3D disc, slow spin + soft float, zero WebGL cost */
export function FloatingVinyl({ size = 300, className = '' }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`}>
      <motion.div
        animate={reducedMotion() ? {} : { y: [0, -14, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="relative rounded-full"
        style={{
          width: size,
          height: size,
          background: `repeating-radial-gradient(circle at 50% 50%, #111 0px, #111 2px, #1c1c1c 3px, #111 4px)`,
          boxShadow: '0 24px 60px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.06)',
        }}
      >
        <div
          className="vinyl-spin absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.07) 18deg, transparent 40deg, transparent 180deg, rgba(255,255,255,0.05) 200deg, transparent 225deg)`,
          }}
        />
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cherry text-center shadow-lg" style={{ width: size * 0.34, height: size * 0.34 }}>
          <div>
            <div className="font-display text-[10px] font-bold tracking-[0.2em] text-white">LG</div>
            <div className="mx-auto mt-1 h-2 w-2 rounded-full bg-parchment" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
