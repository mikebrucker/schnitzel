# Deutsch Schule 🏔️

Learn German for Tirol. Classroom style. Built for Bruck.

PWA + native Android via Capacitor. Static quizzes, no backend, works offline.

## Stack

- **Vite + React 18 + TypeScript** (strict, `Array<T>` enforced)
- **Tailwind CSS** + custom CSS variables for theming
- **Zustand** for global state
- **Capacitor 8** for Android (and later iOS)
- **vite-plugin-pwa** for service worker + manifest
- **Biome** for lint + format
- **`@capacitor/preferences`** for native storage, `localStorage` fallback on web
- **Haptics + status bar** native plugins
- Pre-baked quiz JSON — no API key, no proxy, no runtime AI

## Requirements

- **Node 24+** (see `.nvmrc`)
- For Android: **Android Studio Otter (2025.2.1+)**, **JDK 21**

## Setup

```bash
nvm use         # picks up .nvmrc
npm install
```

## Dev (web)

```bash
npm run dev
```

Open http://localhost:5173. Hot reload, devtools, PWA in dev mode.

## Build for production (web)

```bash
npm run build
npm run preview   # serve dist/ locally to test
```

Deploy `dist/` to any static host (Cloudflare Pages, Netlify, Vercel).

## Capacitor — Android

First-time setup:

```bash
npx cap add android
npm run cap:sync
```

Day-to-day:

```bash
npm run cap:android      # builds web, syncs, opens Android Studio
# OR
npm run cap:run:android  # builds, syncs, runs on connected device
```

### Generate icons & splash (optional, recommended)

```bash
npx @capacitor/assets generate --android --iconBackgroundColor "#0f1614"
```

Drop a `1024x1024` `icon.png` and `2732x2732` `splash.png` in `android-assets/`
first, or use `--assetPath ./android-assets`.

## Lint & format

```bash
npm run lint     # check
npm run format   # apply fixes
```

VS Code: install the recommended **Biome** extension. Format on save is wired
up in `.vscode/settings.json`.

## Adding lessons

1. Append a lesson object to `src/data/lessons.json`
2. Add a matching `"6": [...]` entry to `src/data/quizzes.json` (5 questions ideal)
3. That's it — UI picks it up automatically

## Adding Tirolean phrases

Append to `src/data/tirolean.json`. Same deal.

## Notes

- Theme persisted via storage; status bar color follows theme on native
- Haptics fire on quiz answers (no-op in browser)
- Android hardware back button: closes drawer if open, otherwise navigates
  back; if at root, exits app
- All quiz progress is per-lesson, retains questions across sessions

## Future bolt-ons (not now)

- Cloudflare Worker proxy for live AI-generated quizzes
- iOS build (`npx cap add ios`)
- TanStack Query (when backend lands)
- More lessons, audio pronunciations, spaced repetition

Pfiat di 🍻
