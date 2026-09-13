# Using the editor

FreeMermaid turns Mermaid text into a diagram on the current device. Open the app once while online, then you can continue editing and exporting while offline.

## Create a diagram

1. Write or paste Mermaid text into the floating **Mermaid source** panel.
2. FreeMermaid waits briefly after each edit, then renders the new text on the canvas.
3. Use the **Code** button in the toolbar to show or hide the source panel. The × button in the panel hides it too.

The source panel sizes itself to short diagrams. Long source is capped at a practical height and scrolls inside the editor, leaving the canvas available. When an edit is invalid, FreeMermaid keeps the last valid diagram visible and disables image downloads until the error is fixed. Source download remains available, so an unfinished diagram can always be saved.

## Navigate the canvas

Drag the empty canvas or diagram to pan. Scroll or use a trackpad over the canvas to zoom toward the pointer. The controls in the lower-left corner zoom out, reset the current view, zoom in, or fit/reset the diagram view.

## Downloads

| Button | File | Use it for |
| --- | --- | --- |
| **.mmd** | `diagram.mmd` | Editing later or committing the diagram text to a repository |
| **SVG** | `diagram.svg` | Crisp, scalable diagrams in documents and design tools |
| **PNG** | `diagram.png` | Raster image workflows; generated at 2× scale in the browser |

SVG and PNG downloads require a valid current preview. If a PNG export fails, try the SVG export first; the [troubleshooting guide](troubleshooting.md) has additional options.

## Local draft and reset

FreeMermaid automatically saves one draft: the current Mermaid source and selected color mode. Reopening the app restores that draft on the same browser profile.

Use **Reset** to remove the local draft and restore the built-in starter flowchart. The confirmation cannot be undone. Clearing browser site data has the same effect. See [privacy and offline](privacy-and-offline.md) for details.

## Themes and small screens

The **Theme** control follows the system setting by default, with explicit light and dark choices. The app and generated diagram use matching light or dark themes.

On a narrow screen, use **Code** and **Preview** tabs to switch views. On larger screens, the source editor floats over the full canvas and can be hidden with **Code**.

## Safe rendering behavior

FreeMermaid uses Mermaid’s strict security mode. HTML labels and Mermaid click callbacks are disabled, so links and interactive callbacks in a diagram definition will not run in the preview. This is intentional: FreeMermaid is an editor for local diagrams, not a host for executable or interactive content.
