# Privacy and offline behavior

## What stays on your device

FreeMermaid has no account, database, analytics SDK, advertising network, or server-side diagram storage. The app stores only the following on the current browser profile:

- one Mermaid source draft;
- the selected color-mode preference.

This state is stored in IndexedDB under FreeMermaid’s origin. It is not synchronized to another device or browser profile.

## What the app fetches

The first successful visit needs a network connection to receive the app. The production build contains Mermaid, the editor, icons, and app code; it does not load Mermaid from a CDN or fetch a remote font.

The installed service worker precaches those static build assets. Once that cache is ready, the editor, rendering, local saving, and source/SVG/PNG exports work offline.

## Updates

When a new deployment is available, FreeMermaid displays a refresh prompt. Choose **Refresh** to activate the new cached version. Until then, the current cached version remains available offline.

## Clearing data

Using **Reset** clears the saved draft and restores the starter example. Clearing site data, browser storage, or the browser profile can also remove the saved draft and offline cache. Download important source with the **Source** button before clearing browser data.

## Limits of the privacy model

FreeMermaid does not intentionally transmit diagram text. Your browser and hosting provider may still process ordinary page requests when you are online. This guide describes application behavior, not a legal privacy policy or a guarantee about browser extensions, managed devices, or network infrastructure.
