// Contact-sheet frames — all verified via Commons Special:FilePath.
// thumb() = 400px grid, full() = 1280px lightbox. Credits: Wikimedia Commons contributors.
const fp = (file, width) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

const F = (id, file, caption, year, era, credit) => ({
  id,
  file,
  caption,
  year,
  era,
  credit,
  thumb: fp(file, 400),
  full: fp(file, 1280),
});

export const galleryEras = [
  { id: 'all', label: 'ALL FRAMES' },
  { id: 'early', label: '2011 — 2013' },
  { id: 'ultra', label: '2014' },
  { id: 'lust', label: '2017' },
  { id: 'nfr', label: '2019' },
  { id: 'now', label: '2023 →' },
];

export const galleryFrames = [
  F('bowery-1', 'Lana Del Rey Bowery 2011 P1150546.jpg', 'Bowery Ballroom, New York — the Lizzy Grant DIY circuit', '2011', 'early', 'Wikimedia Commons'),
  F('bowery-2', 'Lana Del Rey Bowery 2011 P1150576.jpg', 'Bowery Ballroom, New York — guitar, no myth yet', '2011', 'early', 'Wikimedia Commons'),
  F('paradiso', 'Lana Del Rey @Paradiso (Amsterdam)2.jpg', 'Paradiso, Amsterdam — first European rooms', '2011', 'early', 'Wikimedia Commons'),
  F('cologne', 'Lana Del Rey Cologne 2011 (01).jpg', 'Cologne — Video Games crossing the ocean', '2011', 'early', 'Wikimedia Commons'),
  F('cannes', 'Lana Del Rey Cannes 2012.jpg', 'Cannes — Americana tragedy goes Riviera', '2012', 'early', 'Wikimedia Commons'),
  F('promo-2012', 'Lana Del Rey (7517663806).jpg', 'Promo portrait — the auburn era begins', '2012', 'early', 'Wikimedia Commons'),
  F('echo', 'Lana Del Rey at the Echo Awards 2013.jpg', 'Echo Awards — Paradise year, trophy in hand', '2013', 'early', 'Wikimedia Commons'),
  F('planeta', 'Lana del Rey @ Planeta Terra (cropped).jpg', 'Planeta Terra, Brazil — first southern hemisphere roar', '2013', 'early', 'Wikimedia Commons'),
  F('santiago', 'Lana Del Rey 2013 Santiago-1.jpg', 'Santiago, Chile — stadium-scale devotion', '2013', 'early', 'Wikimedia Commons'),
  F('manchester', 'Lana Del Rey performing at Manchester, O2 Apollo on Thursday 23rd May 2013.jpg', 'O2 Apollo, Manchester — the sermon on tour', '2013', 'early', 'Wikimedia Commons'),
  F('coach-head', 'Lana Del Rey headshot, Coachella 2014.jpg', 'Coachella — Ultraviolence portrait, sun-bleached and certain', '2014', 'ultra', 'Wikimedia Commons'),
  F('coach-01', 'Lana Del Rey Coachella 01.jpg', 'Coachella — desert distortion, full band', '2014', 'ultra', 'Wikimedia Commons'),
  F('coach-full', 'Lana Del Rey 2014 Coachella.jpg', 'Coachella — flower crown in the dust', '2014', 'ultra', 'Wikimedia Commons'),
  F('seine', 'Lana Del Rey Rock en Seine 2014.jpg', 'Rock en Seine, Paris — grey skies, black leather', '2014', 'ultra', 'Wikimedia Commons'),
  F('allan-wan', 'Lana Del Rey by Allan Wan.jpg', 'Bill Graham Civic Auditorium, San Francisco', '2014', 'ultra', 'Allan Wan / Wikimedia Commons'),
  F('seattle-01', 'Lana Del Rey live in Seattle (01).jpg', 'WaMu Theater, Seattle — close quarters', '2014', 'ultra', 'Wikimedia Commons'),
  F('flow-crop', 'Lana Del Rey at Flow Festival 2017 (5) (cropped).jpg', 'Flow Festival, Helsinki — Lust for Life in bloom', '2017', 'lust', 'Wikimedia Commons'),
  F('flow-01', 'Lana Del Rey at Flow Festival 2017 (1).jpg', 'Flow Festival, Helsinki — sequins and peace signs', '2017', 'lust', 'Wikimedia Commons'),
  F('ldr2019', 'LDR2019-cr.jpg', '2019 — the laureate year, NFR! season', '2019', 'nfr', 'Wikimedia Commons'),
  F('mita-crop', 'Lana del rey MITA.jpg (cropped).jpg', 'MITA Festival, Brazil — southern summer', '2023', 'now', 'Wikimedia Commons'),
  F('dublin', 'Lana Del Rey Dublin 2025.jpg', 'Dublin 2025 — the archive continues', '2025', 'now', 'Wikimedia Commons'),
];
