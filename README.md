# TigerFury Fixes

Classic games. Modern systems.

A separate Astro + Tailwind website for TigerFury compatibility fixes, RetroInput controller support, downloads and video showcases.

## Development

Requires Node.js 24.

```sh
npm ci
npm run dev
npm test
npm run check
npm run build
```

Static output is written to `dist/`. `npm run preview` serves the built site locally.

## Content

- `src/data/games.ts`: game catalogue.
- `src/data/releases.json`: verified public release snapshot and per-game downloads.
- `src/data/release-targets.json`: exact package/DLL matching rules.
- `src/data/videos.json`: manual video assignments and exclusions (these override automatic matching).
- `src/data/game-videos.json`: automatically matched game-page showcases.
- `src/data/video-aliases.json`: additional recognised game names.
- `src/data/latest-videos.json`: homepage's six latest public uploads.
- `src/data/video-thumbnails.json`: local thumbnail files and dimensions.

`npm run sync:releases` scans stable public releases independently for each game, retaining older game downloads when a newer release only updates another game. Drafts and prereleases are excluded.

`npm run sync:videos` refreshes the public channel gallery. It uses `YOUTUBE_API_KEY` from the environment when provided, otherwise the public feed. The feed returned HTTP 404 during local testing; the current snapshot was preserved. API-key refresh, tests and build passed in GitHub Actions. Public uploads are scanned across the full channel history. Recognised fix, controller and full-playthrough titles are matched by the game name before the first |, ignoring punctuation, parenthetical notes and hashtags. Specific sequel names do not match their originals. Ambiguous titles remain unassigned.

## Deployment status

Source is hosted at https://github.com/Tiger-Fury/tiger-fury.github.io. Publishing was approved on 26 October 2026. The active workflow is `.github/workflows/pages.yml`.

The workflow refreshes public content on main-branch updates, manual runs and a six-hour schedule. Failed refreshes keep committed content; failed checks/builds prevent deployment. The workflow writes updated snapshots only to this website repository. Existing game repositories are read only.

Store the YouTube Data API key only as an Actions secret named `YOUTUBE_API_KEY`; never commit it. No key is included in browser code. `SITE_URL` defaults to `https://tiger-fury.github.io`, and `SITE_BASE` defaults to `/`.

## Media and credits

Game artwork belongs to its respective owners. The Suffering covers are sourced from the Wikipedia/Wikimedia game pages; the hero screenshot is hosted by GOG. CSI screenshots and RetroInput branding come from the public project releases/repository. TigerFury supplied the tiger logo. Videos and thumbnails come from TigerFury's public YouTube channel. Social icons are from Simple Icons (CC0).

See the site's Credits page and individual upstream projects for tool and contributor acknowledgements. No analytics are included. YouTube players load only when selected.


## Search, sharing and short clips

Every page has a canonical URL and Open Graph/Twitter summary-card metadata using the TigerFury logo. sitemap.xml and robots.txt are generated from the game catalogue; the 404 page is excluded from indexing. Search-engine discovery and third-party share caches are outside the site's control.

Automatic video refresh now checks public visibility, embeddability and API duration. Uploads of three minutes or less are excluded from both latest videos and game-page matching. This is a conservative Shorts/short-clip filter, not an exact YouTube Shorts classification (the public API does not provide that flag). To include a specific short regular video, set includeShort:true in its manual videos.json record. Without an API key, snapshots are preserved rather than introducing unchecked videos.
