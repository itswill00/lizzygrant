// Single source of truth for 8 chapters + meta
import { vaultItems } from './vault';
import { galleryFrames } from './gallery';
import { discography } from './discography';

const totalTracks = discography.reduce((n, a) => n + a.tracks.length, 0);

export const routes = [
  { href: '/eras', k: '02', label: 'The Eras', sub: '2005 → 2025 · 8 chapters', desc: 'Interactive chronology, tap timeline, enter an era.' },
  { href: '/vault', k: '03', label: 'Secret Vault', sub: `${vaultItems.length} files · unreleased & lore`, desc: 'Case files, tapes, poetry, interview lore.' },
  { href: '/tarot', k: '04', label: 'Lyrical Tarot', sub: 'Ask · Shuffle · Draw', desc: 'Lyric as reading, shuffle and draw.' },
  { href: '/muses', k: '05', label: 'Muses & Lovers', sub: 'Barrie → Jeremy · fan readings', desc: 'Every love left a song, public chapters only.' },
  { href: '/louisiana', k: '06', label: 'Louisiana Now', sub: 'Journal · Waffle House → Wedding', desc: 'Living journal, newest first, developing.' },
  { href: '/gallery', k: '07', label: 'Contact Sheet', sub: `${galleryFrames.length} frames · loupe`, desc: 'Proof prints 2011 → 2025, tap for loupe.' },
  { href: '/discography', k: '08', label: 'Discography', sub: `9 releases · ${totalTracks} tracks`, desc: 'Every record, every standard track, tap to preview.' },
  { href: '/jeremy', k: '09', label: 'Lana + Jeremy', sub: 'New · photos & timeline', desc: 'The Louisiana peace, how they met, married.' },
];
