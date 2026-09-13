# Troubleshooting

## The preview shows an error

Check the error message on the canvas, then compare the source with a known working example in [Mermaid quick start](mermaid-quick-start.md). The last valid diagram stays visible while you fix the text.

For flowcharts, Mermaid treats lowercase `end` specially; use `End`, `END`, or a different label. The [upstream flowchart reference](https://mermaid.ai/open-source/syntax/flowchart.html) documents this and other syntax details.

## SVG or PNG download is disabled

Image downloads are disabled whenever the current source does not render. Fix the Mermaid error first. **Source** is always available, so download `diagram.mmd` if you need to continue elsewhere.

## PNG export fails

Try **SVG** first. SVG is vector-based and is usually the best export format for documents. PNG conversion can fail when the browser cannot create a canvas or when a diagram uses unsupported features. Update the browser and try a smaller or simpler valid diagram.

## My draft did not return

Drafts only exist in IndexedDB for the same browser profile and site origin. They are lost when you use **Reset**, clear site data, use a private/incognito session that discards data, change browser profiles, or visit a different deployment URL.

## The app does not work offline yet

The first visit must complete online so the service worker can cache the build. Reload once while online, wait for the app to finish loading, then test offline. If a new version is available, choose **Refresh** to activate its cache.

## A deployment shows an old version

FreeMermaid keeps a working cached version until the new service worker is ready. Use the in-app refresh prompt. If it does not appear, reload while online and use the browser’s site-data controls only after downloading the current source.

## Cloudflare Pages build fails

Confirm the build settings are `npm run build`, `dist`, and Node 22. Review the Pages build log for dependency-install failures. The project needs no runtime secrets or environment variables. For setup steps, return to [deployment](deployment.md).
