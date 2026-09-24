import { useEffect, useRef, useState } from 'react';

/* Image with graceful recovery: Wikimedia throttles burst loads (503/timeout),
   and a plain <img> never retries, so frames would stay dead forever.
   SafeImage remounts the request with backoff, then offers tap-to-retry. */
export default function SafeImage({
  src,
  alt = '',
  className = '',
  loading,
  decoding = 'async',
  fetchPriority,
  draggable,
  style,
  width,
  height,
  sizes,
  srcSet,
}) {
  const [attempt, setAttempt] = useState(0);
  const [dead, setDead] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);
  // fresh file → fresh attempts
  useEffect(() => {
    setAttempt(0);
    setDead(false);
  }, [src]);

  if (dead) {
    return (
      <button
        onClick={() => {
          setDead(false);
          setAttempt(0);
        }}
        aria-label={`Reload photo: ${alt}`}
        className={`${className} flex items-center justify-center bg-denim/15 p-4 text-center dark:bg-white/5`}
      >
        <span className="font-mono text-[9px] tracking-[0.15em] text-typewriter">
          FRAME OFFLINE
          <br />
          <span className="text-cherry">TAP TO RETRY ↺</span>
        </span>
      </button>
    );
  }

  return (
    <img
      key={`${src}::${attempt}`}
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      draggable={draggable}
      style={style}
      onError={() => {
        if (attempt < 3) {
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setAttempt((a) => a + 1), 1200 * (attempt + 1));
        } else {
          setDead(true);
        }
      }}
    />
  );
}
