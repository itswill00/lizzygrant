# LIZZY GRANT: THE ARCHIVES

> *An atmospheric anthology of a girl who turned Americana into mythology.*

A dedicated archival website documenting the journey, life, and music of **Lana Del Rey**: from the *Lizzy Grant* demos to the tunnel under *Ocean Blvd*. Curated as a scrapbook, told as a film.

## Aesthetic

Retro Americana · 70s editorial nostalgia · cinematic melancholy.

- **Background**: warm parchment `#F7F4EB`, faded noir `#1A1A1A` (dark mode)
- **Text**: deep espresso `#22201E`, typewriter gray
- **Accents**: cherry red `#9E1B1B`, vintage navy `#2E4057`, muted brass `#D4AF37`
- **Type**: Playfair Display (editorial), Courier Prime (typewriter), Source Serif 4 (body)
- **Texture**: SVG film grain, polaroid cards with taped edges, stamp badges

## Features

- **Hero**: editorial typography `LIZZY GRANT: THE ARCHIVES`, rotating iconic quotes, ambient cassette Side A
- **The Eras**: 8 interactive chapters (2005 → present), each with summary, moodboard photography, notable cuts that cue the cassette
- **Secret Vault**: 17 archival case files (unreleased, poetry, lore); tap `INSPECT` for the full file modal
- **Lyrical Tarot**: flip vintage tarot cards to reveal a lyric + thematic breakdown
- **Muses & Lovers**: public relationship chapters (Barrie → Jeremy Dufrene), each mapped to songs as marked fan readings
- **Louisiana Now**: living journal: Waffle House shift, Coachella headline, the 2024 wedding, developing entries
- **Contact Sheet**: 22 numbered proof-print frames (Bowery 2011 → Dublin 2025), era filters, loupe lightbox
- **Complete Discography**: 9 releases, full standard tracklists, singles marked, tap-to-preview everything
- **Cassette deck**: persistent bottom player with genuine 30-second vocal previews, seek tape-counter, volume, track pills, slim mini-bar on mobile (`▴` to expand). The `♫` button opens Spotify / YouTube / Apple Music for the full song.

## Music & photos (legal)

- **Audio**: genuine 30-second vocal previews, streamed live from the iTunes Search API (`previewUrl`) with Deezer as fallback. **No audio files ship with this repo** — nothing is downloaded, cached to disk, or re-hosted. Lookups resolve by album tracklist first (exact), then by title, and are memoised per session so a track is only fetched once. Every player surface also links out to Spotify / YouTube / Apple Music for the full song. Full songs belong to their respective copyright holders — if you love it, buy the record.
- **Matching**: strict. A track only plays if its normalised title genuinely matches a Lana Del Rey release. Censored store metadata (`F****d My Way…`), feature credits (`(feat. …)`) and edition tags are reconciled; a near-miss is rejected rather than playing the wrong song.
- **Photography**: Wikimedia Commons contributors (CC-BY-SA), served compressed via direct `upload.wikimedia.org/.../thumb/.../800px-...` `object-cover`, lazy below the fold.

## Stack

Vite + React + Tailwind CSS + Framer Motion. Mock content lives in `src/data/` (`eras.js`, `vault.js`, `tarot.js`).

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # http://localhost:4173
```

## Deploy (Vercel)

```bash
vercel --prod
```

`vercel.json` sets framework `vite`, output `dist`, SPA rewrites, and immutable caching for `/audio` + `/assets`.

---

*A fan archival project dedicated to Elizabeth Woolridge Grant. Created with love, reverence, and continuous tape loops. Not affiliated with Lana Del Rey, “Keep the tapes running.”*

<!-- redeploy trigger: sync prod to 2bf5e2c -->
