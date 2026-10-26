# TigerFury Fixes website

Separate, local-only Astro + Tailwind website. No remote repository or deployment has been created. Existing game and RetroInput repositories were read only.

## Run

Requires Node.js 22.12+ (Node 24 recommended).

```sh
npm install
npm run dev
npm run check
npm run build
npm run preview
```

Static output is in `dist/`. Use `npm ci` after the lockfile is present. Astro's `base` can be configured in `astro.config.mjs` for subdirectory hosting; internal links use BASE_URL. Hosting domain and metadata should be reviewed before publication.

## Content

- `src/data/games.ts`: curated game descriptions and source links.
- `src/data/releases.json`: public GitHub release snapshot, checked 26 October 2026.
- `npm run sync:releases`: explicitly refreshes the latest stable releases from the three allowlisted public repositories. Failed fetches leave the existing snapshot intact. Builds require no GitHub access.
- `src/styles/global.css`: responsive visual design and original CSS artwork.

Sources: [RetroInput README](https://github.com/Tiger-Fury/RetroInput-Public), [supported games](https://github.com/Tiger-Fury/RetroInput-Public/blob/main/docs/SUPPORTED_GAMES.md), [RetroInput releases](https://github.com/Tiger-Fury/RetroInput-Public/releases), [CSI README](https://github.com/Tiger-Fury/CSI-Dark-Motives-AiO-Fix), [CSI releases](https://github.com/Tiger-Fury/CSI-Dark-Motives-AiO-Fix/releases).

The supplied mockup informed layout, colours and typography. Its dates, versions, artwork and extra games were illustrative. Only four publicly verified supported games are listed. The Suffering cards describe RetroInput controller support, not an unverified all-in-one compatibility release. CSI is described as tested on Windows 11; Windows 10 remains untested.

Original CSS artwork is temporary for the hero and Suffering covers. A temporary original SVG tiger mark preserves the tiger branding direction, but is not the exact mockup logo. Replace these with approved original assets before final visual sign-off. No mockup image is shipped. No private repository content, tokens, analytics, tracking cookies or personal files are included. External download links go to upstream GitHub assets.

Local public assets: `public/images/retroinput.png` comes from the RetroInput-Public repository's `assets/branding/retroinput-logo-1920x1080.png`. `public/images/csi-dark-motives.png` comes from the CSI release's screenshot at https://github.com/user-attachments/assets/dd26f353-1985-4733-875d-5460886a6227. Review reuse rights with project artwork before publication.

## Before publishing

Review branding, content, artwork and the release snapshot. Obtain the user's approval before creating any remote repository or publishing. Suggested separate repository name: `tigerfury-fixes-website`. No deployment workflow is enabled.

The user-supplied TigerFury logo is used in the header and footer, preserving its original colours. The previous temporary SVG is unused.


Original CSI added from its public README and release tag csi (24 October 2026), with all three verified package URLs. Screenshot source: https://github.com/user-attachments/assets/88fac51e-ee84-4464-b034-def02e14cac3. Keep this game's matching scripts.cxt requirement distinct from Dark Motives' optional save migration tool.

## Per-game release detection

`npm run sync:releases` now scans all pages of public release history. Homepage release cards use the latest stable release for each project; each game page independently uses the newest stable release containing its matching asset. Drafts and prereleases are excluded. Any missing game download or network error prevents snapshot replacement.

Matching rules live in `src/data/release-targets.json`. Currently accepted RetroInput assets:

- The Suffering: `SufferingXInput.dll` or ZIP names beginning `RetroInput-The-Suffering-v`.
- Ties That Bind: `SufferingTTBInput.dll` or ZIP names beginning `RetroInput-The-Suffering-Ties-That-Bind-v`.

Names are matched without case sensitivity. Preserve these DLL names or package conventions; add new games and naming patterns explicitly rather than guessing. A standalone DLL update assumes the visitor already has the loader/configuration; linked release notes provide installation guidance. CSI projects retain ZIP downloads from their latest stable packaged release.

Run `node --test scripts/release-selection.test.mjs` for mixed releases, separate DLLs, excluded drafts/previews, missing matches and pagination checks. The refresh is implemented and manually verified, but no schedule, repository creation or automatic public deployment has been enabled.

## Final artwork pass

Hero screenshot: https://images.gog.com/6dfa7c92bb313e7c805e2a900867b9e310b6f805adf60d650ba6ea4a159bf9f7.jpg

Original covers: https://en.wikipedia.org/wiki/The_Suffering_(video_game) and https://en.wikipedia.org/wiki/The_Suffering:_Ties_That_Bind (Wikimedia-hosted game cover images). These are copyrighted game artworks used for identification in this local preview; no ownership or reuse licence is asserted. Original covers replace the abstract card treatments, and the GOG-hosted gameplay image replaces the CSS hero scene.

## YouTube showcases

Channel: https://www.youtube.com/@tigerfury
RetroInput playlist supplied by user: https://www.youtube.com/playlist?list=PLT8fenmuid0g

The user reports the playlist's current video is not published. Public playlist validity and playback could not be independently verified. The supplied ID is used unchanged; verify the complete playlist URL before launch. No video titles, availability or per-game mappings are invented. The page initially makes no YouTube requests. A visitor can explicitly load a privacy-enhanced playlist iframe or open YouTube directly. The playlist reflects YouTube's available contents without maintaining individual video IDs in this site. Private/unavailable videos remain subject to YouTube access restrictions. No account access or publishing changes were made.

## Public channel video gallery

Six latest public uploads were verified on https://www.youtube.com/@tigerfury/videos on 26 October 2026. IDs/titles are stored in src/data/videos.json; this is a curated snapshot, not an automatic channel feed. Local YouTube thumbnails load without contacting YouTube. Players load only after selection. The original CSI fix video is also featured on its game page. No unpublished video was included.

CSI full gameplay uploads KGkxLRwSIm8 and IbPB_UTB3DQ were verified on the public channel search on 26 October 2026. They appear beside Fix Showcases and on their respective game pages. These older playthroughs are labelled gameplay; no claim is made that they demonstrate the current AiO patches.

26 October 2026 update: Public RetroInput playlist PLT8fenmuid0g was verified with showcase 8NXo25UcAfQ. Dark Motives fix 3BjBRjXNink was verified in public uploads. Both lead the latest-six homepage snapshot. The controller video is mapped to both Suffering game pages; Dark Motives now has fix and full gameplay videos side by side.

Footer social links (Twitch, Discord, TikTok, Kick and X) were read from the public YouTube channel About links on 26 October 2026; YouTube and GitHub use the previously verified profiles. Icons are from Simple Icons (CC0), downloaded from its npm distribution. No donation, wishlist or shop links were added as social networks.

## Automatic updates and prepared hosting workflow (current)

The local `.github/workflows/pages.yml` is prepared for the proposed separate `Tiger-Fury/tiger-fury.github.io` repository. It is not running: no repository has been created, no workflow uploaded and no site published.

After explicit launch approval, enable GitHub Pages with GitHub Actions as its source. The workflow runs on main-branch updates, manual dispatch and every six hours (GitHub schedules may be delayed). It refreshes public releases and channel videos independently, runs tests/checks/build, preserves successful snapshots in the website repository, and deploys the static result. Refresh failures retain the last committed snapshots. Failed tests/builds prevent deployment. Existing game repositories are never written to.

YouTube refresh: `npm run sync:videos`. The public channel feed returned HTTP 404 during local verification. The failure test confirmed that `latest-videos.json` remained byte-for-byte unchanged. Live automatic importing is therefore not yet verified. For the alternative supported path, enable YouTube Data API v3 and save a suitably restricted API key as the website repository's Actions secret `YOUTUBE_API_KEY` (never in source or chat). This path retrieves the channel uploads playlist without accessing private account data. API-key mode still needs a live smoke test.

The homepage now reads `src/data/latest-videos.json`. Game-page showcases stay curated in `src/data/videos.json`; new videos are not assigned to games or labelled as fixes by guessing their titles. Thumbnail downloads try maxres, SD and HQ, validating dimensions before replacing the gallery. All network validation finishes before snapshot replacement. Game-specific mappings need review when new relevant videos appear. The playlist player itself remains YouTube-managed.

`SITE_URL` defaults to the proposed root GitHub Pages address; `SITE_BASE` defaults to `/`. Review both if using another repository or custom domain. The workflow requires write access only to this separate website repository for content snapshots, plus Pages deployment permission. No YouTube credentials are placed in the browser bundle.

Validation: `npm test`, `npm run check`, `npm run build`. Actual GitHub Actions execution and deployment remain untested until the user approves launch.

## Repository upload status

Deployment workflow is intentionally stored as `.github/workflows/pages.yml.disabled` until launch approval. GitHub will not run it with that extension. No Pages site has been enabled.
