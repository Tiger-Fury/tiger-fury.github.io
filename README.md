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
- `src/data/videos.json`: curated game-page video showcases.
- `src/data/latest-videos.json`: homepage's six latest public uploads.
- `src/data/video-thumbnails.json`: local thumbnail files and dimensions.

`npm run sync:releases` scans stable public releases independently for each game, retaining older game downloads when a newer release only updates another game. Drafts and prereleases are excluded.

`npm run sync:videos` refreshes the public channel gallery. It uses `YOUTUBE_API_KEY` from the environment when provided, otherwise the public feed. The feed returned HTTP 404 during local testing; the current snapshot was preserved. API-key refresh still requires a live verification. New game-specific video associations remain curated.

## Deployment status

Source is hosted at https://github.com/Tiger-Fury/tiger-fury.github.io. Publishing is intentionally disabled: the prepared workflow is stored as `.github/workflows/pages.yml.disabled`.

After launch approval and GitHub Pages configuration, enabling the workflow will refresh public content on main-branch updates, manual runs and a six-hour schedule. Failed refreshes keep committed content; failed checks/builds prevent deployment. The workflow writes updated snapshots only to this website repository. Existing game repositories are read only.

Store the YouTube Data API key only as an Actions secret named `YOUTUBE_API_KEY`; never commit it. No key is included in browser code. `SITE_URL` defaults to `https://tiger-fury.github.io`, and `SITE_BASE` defaults to `/`.

## Media and credits

Game artwork belongs to its respective owners. The Suffering covers are sourced from the Wikipedia/Wikimedia game pages; the hero screenshot is hosted by GOG. CSI screenshots and RetroInput branding come from the public project releases/repository. TigerFury supplied the tiger logo. Videos and thumbnails come from TigerFury's public YouTube channel. Social icons are from Simple Icons (CC0).

See the site's Credits page and individual upstream projects for tool and contributor acknowledgements. No analytics are included. YouTube players load only when selected.
