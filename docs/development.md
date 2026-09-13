# Development

## Requirements

- Node.js 22.12 or newer (the repository includes `.nvmrc` with the major version).
- npm, supplied with Node.js.
- Chromium for end-to-end tests.

## Install and run

```bash
npm install
npm run dev
```

Vite prints a local URL. The development server is useful for editing the UI; use the production build for service-worker testing.

## Commands

| Command | What it verifies |
| --- | --- |
| `npm run lint` | TypeScript types without emitting output |
| `npm run test:run` | IndexedDB persistence and download helper unit tests |
| `npm run build` | TypeScript plus Vite’s production PWA build into `dist/` |
| `npm run preview` | The production build, including the generated service worker |
| `npm run test:e2e` | Browser rendering, downloads, syntax errors, mobile tabs, and offline reload |
| `npm run docs:check` | Relative Markdown links in the repository |

Install Playwright’s browser before the first E2E run:

```bash
npx playwright install chromium
```

## Test expectations

Run the checks before opening a pull request:

```bash
npm run lint
npm run test:run
npm run build
npm run test:e2e
npm run docs:check
```

The E2E suite starts `npm run preview`, so run `npm run build` first. It tests the production artifact, including the service worker’s offline response.

## Continuous integration

The GitHub Actions workflow runs on pull requests and pushes to `main`. It installs dependencies with `npm ci`, installs Chromium, then runs type checking, unit tests, the production build, E2E tests, and local documentation-link validation.
