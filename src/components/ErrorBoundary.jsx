import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
    // Auto-reload once on chunk load failure (stale index.html after deploy)
    const msg = String(error?.message || '');
    if (msg.includes('Failed to fetch dynamically imported module') || msg.includes('Loading chunk')) {
      const key = 'chunk-reload-' + (error.message || '').slice(0, 40);
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, '1');
        setTimeout(() => location.reload(), 800);
      }
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-[720px] px-6 py-16 text-center">
          <div className="font-mono text-[10px] tracking-[0.2em] text-cherry">ARCHIVE ERROR · FAILED TO LOAD</div>
          <h1 className="mt-3 font-display text-2xl font-bold text-espresso dark:text-parchment">This page took a bad splice.</h1>
          <p className="mt-2 font-body text-[14px] leading-6 text-typewriter">Chunk failed to load or a runtime error occurred. Try reloading. If it persists, the tape is truly tangled.</p>
          <button onClick={() => location.reload()} className="mt-6 rounded-full bg-cherry px-5 py-2.5 font-mono text-[12px] tracking-[0.15em] text-white">RELOAD ARCHIVE</button>
          <details className="mx-auto mt-6 max-w-[560px] text-left">
            <summary className="cursor-pointer font-mono text-[11px] text-typewriter">Error details</summary>
            <pre className="mt-2 overflow-auto rounded-lg bg-espresso/5 p-3 text-[11px] text-espresso dark:bg-white/5 dark:text-parchment">{String(this.state.error?.message || this.state.error || 'Unknown')}</pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
