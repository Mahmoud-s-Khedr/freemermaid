# FreeMermaid

FreeMermaid is an offline-first editor for diagrams written in [Mermaid](https://mermaid.ai/open-source/intro/). Write text, see the diagram update locally on a full canvas, then download the result.

There are no accounts, ads, analytics, server-side diagram storage, or API calls. After the first successful online load, the app works offline.

## Features

- Canvas-first workspace with a compact floating CodeMirror source editor
- Drag-to-pan and scroll-to-zoom diagram canvas, with zoom and reset controls
- Source (`.mmd`), SVG, and 2× PNG downloads
- One automatically restored local draft and a saved color-mode preference
- System, light, and dark themes
- A Code toggle on larger screens and Code/Preview tabs on smaller screens
- Installable PWA with an offline app shell
- Strict Mermaid rendering configuration and no interactive diagram callbacks

## Quick start

1. Open FreeMermaid while online once.
2. Replace the starter diagram in the floating **Mermaid source** panel. Use **Code** to show it again after closing it.
3. Wait for the canvas to update. Rendering errors leave the last valid diagram visible.
4. Download **Source**, **SVG**, or **PNG** when the diagram is valid.

Start with the [Mermaid quick start](docs/mermaid-quick-start.md), or read the full [documentation hub](docs/README.md).

## Documentation

| Guide | What it covers |
| --- | --- |
| [Using the editor](docs/using-the-editor.md) | Floating editor, canvas navigation, downloads, themes, mobile layout, and reset |
| [Mermaid quick start](docs/mermaid-quick-start.md) | Copyable examples and official syntax links |
| [Privacy and offline](docs/privacy-and-offline.md) | Local data, PWA caching, and browser-data implications |
| [Development](docs/development.md) | Local setup, commands, tests, and CI |
| [Deployment](docs/deployment.md) | GitHub to Cloudflare Pages deployment |
| [Architecture](docs/architecture.md) | Browser-only data flow and implementation choices |
| [Troubleshooting](docs/troubleshooting.md) | Common editor, export, offline, and deployment problems |

## Local development

FreeMermaid requires Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run lint` | Type-check the project without emitting files |
| `npm run test:run` | Run unit tests once |
| `npm run build` | Type-check and create the production PWA in `dist/` |
| `npm run preview` | Serve the built production app locally |
| `npm run test:e2e` | Run Playwright browser and offline tests |
| `npm run docs:check` | Validate local Markdown links |

Before running browser tests for the first time, install Chromium:

```bash
npx playwright install chromium
```

## Deploy to Cloudflare Pages

Connect the GitHub repository in Cloudflare Pages and configure:

- **Production branch:** `main`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node version:** `22`

Pushes to `main` publish production and pull requests receive preview deployments. No Pages Functions, bindings, database, environment variables, or secrets are required. See the complete [deployment guide](docs/deployment.md).

## Supported browsers

FreeMermaid targets modern Chrome, Edge, Firefox, and Safari 17.4 or later, in line with current Mermaid browser support. Use an up-to-date browser for PWA installation and offline storage.

## Attribution

FreeMermaid uses [Mermaid](https://github.com/mermaid-js/mermaid), released under the MIT License. FreeMermaid is an independent editor and not an official Mermaid service.
