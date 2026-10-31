# Silk Nail — npm + Vercel Ready

A React 18 + TypeScript + Vite website for Silk Nail in Coppell, Texas.
All existing sections, links, logos, images, styling, and salon details are retained.

## Requirements

- Node.js **22.x** (see `.nvmrc`)
- npm (ships with Node.js)

## Run locally (Windows PowerShell, macOS, or Linux)

Open a terminal in this folder (the folder containing `package.json`):

```bash
npm install
npm run dev
```

Open **http://localhost:8080**. Stop the server with **Ctrl+C**.

## Test the production build

```bash
npm run typecheck
npm run build
npm run preview
```

The preview runs at **http://localhost:4173**. The generated production files are written to `dist/`.

If your dependencies have already been installed and you want a fresh, lockfile-based install, you can use `npm ci` instead of `npm install`.

## Deploy on Vercel using GitHub

1. Extract this ZIP and upload **the folder's contents** to the root of a GitHub repository. The repository root should contain `package.json`, `index.html`, `vercel.json`, `src/`, and `public/`. Do not upload `node_modules/`.
2. In [Vercel](https://vercel.com/new), choose **Add New Project** and import that repository.
3. Set **Framework Preset: Vite** and **Root Directory: `./`** (or the directory containing `package.json`, if different).
4. The included `vercel.json` sets:
   - Install Command: `npm ci`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - SPA fallback: `/(.*)` to `/index.html`
5. Click **Deploy**. Vercel installs dependencies and builds the project automatically.

### Manual deployment from the project folder (optional)

If you already have the Vercel CLI installed and are signed in, run `vercel` for a preview deployment or `vercel --prod` for production. No database migration or custom environment launcher is necessary for this website.

## Site structure

- `src/App.tsx`: the single-page site, including header, hero, service search and filters, visit/hours, and footer.
- `src/index.css`: website styling.
- `src/assets/`: existing salon logo, storefront image, and service images.
- `public/favicon.png`: favicon.
- `vite.config.ts`: Vite configuration.
- `vercel.json`: Vercel build and routing configuration.

The business details and external links are preserved from the provided source. Verify them before publication if necessary.
