# Architecture

FreeMermaid is deliberately a client-only application. It uses React and Vite to provide the interface, Mermaid to produce SVG, IndexedDB for one local draft, and a generated service worker for offline caching.

## Data flow

```text
CodeMirror source
  → 300 ms debounce
  → Mermaid parse + render
  → current SVG preview
  → browser download (source / SVG / PNG)

CodeMirror source + color mode
  → IndexedDB singleton draft
  → restored on the next visit in the same browser profile
```

The rendering request has an incrementing identifier. A slower, older render cannot overwrite a newer source edit. A failed render keeps the last valid SVG visible and surfaces an error.

## Workspace interaction

The rendered SVG sits on a full-size canvas. The source editor is an overlay rather than a split pane: it grows for short input, caps its code area for longer input, and lets CodeMirror scroll the remaining source. The canvas tracks a local pan and zoom viewport; pointer dragging changes its position, wheel input zooms around the pointer, and the canvas controls reset the view.

## Rendering and safety

Mermaid is initialized in the browser with `startOnLoad: false` and `securityLevel: 'strict'`. HTML labels and flowchart HTML labels are disabled, and FreeMermaid never binds Mermaid’s interactive callback functions.

These decisions allow simple browser PNG rasterization and reduce the attack surface of arbitrary source text. The trade-off is intentional: diagrams that depend on HTML labels, embedded markup, or click callbacks are not supported.

## Persistence and exports

IndexedDB contains a single versioned record with Mermaid source and color mode. There is no document list, server synchronization, or recovery after browser data is cleared.

Source and SVG exports become browser Blob downloads. PNG export loads the generated SVG into an in-memory image, draws it to a 2× canvas, and downloads the canvas result. Temporary Blob URLs are revoked after use.

## Offline delivery

`vite-plugin-pwa` produces a manifest and Workbox service worker at build time. The service worker precaches HTML, JavaScript, CSS, icons, and local font assets, then routes navigations to the single-page app entry point. A prompt appears when a newly deployed service worker is ready.

## Hosting boundary

Cloudflare Pages only serves static build files. The app has no server endpoint, no Pages Function, no data binding, and no application secret. Static response policy is defined in `public/_headers`.
