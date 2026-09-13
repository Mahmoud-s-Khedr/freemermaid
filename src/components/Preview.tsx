import { useRef, useState } from 'react';
import type { PointerEvent, WheelEvent } from 'react';

interface PreviewProps {
  svg: string | undefined;
  error: string | undefined;
  isRendering: boolean;
}

export function Preview({ svg, error, isRendering }: PreviewProps) {
  const [viewport, setViewport] = useState({ scale: 1, x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const drag = useRef<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | undefined>(undefined);

  const clampScale = (scale: number) => Math.min(3, Math.max(.45, scale));

  const zoomAt = (factor: number, clientX?: number, clientY?: number, element?: HTMLElement) => {
    setViewport((current) => {
      const scale = clampScale(current.scale * factor);
      if (!element || clientX === undefined || clientY === undefined) return { ...current, scale };
      const bounds = element.getBoundingClientRect();
      const pointX = clientX - bounds.left - bounds.width / 2;
      const pointY = clientY - bounds.top - bounds.height / 2;
      const ratio = scale / current.scale;
      return {
        scale,
        x: pointX - ratio * (pointX - current.x),
        y: pointY - ratio * (pointY - current.y),
      };
    });
  };

  const beginPan = (event: PointerEvent<HTMLDivElement>) => {
    if (!svg || event.button !== 0 || (event.target as Element).closest('button')) return;
    drag.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: viewport.x, originY: viewport.y };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsPanning(true);
  };

  const movePan = (event: PointerEvent<HTMLDivElement>) => {
    const activeDrag = drag.current;
    if (!activeDrag || activeDrag.pointerId !== event.pointerId) return;
    setViewport((current) => ({ ...current, x: activeDrag.originX + event.clientX - activeDrag.startX, y: activeDrag.originY + event.clientY - activeDrag.startY }));
  };

  const endPan = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = undefined;
    setIsPanning(false);
  };

  const zoomCanvas = (event: WheelEvent<HTMLDivElement>) => {
    if (!svg) return;
    event.preventDefault();
    zoomAt(event.deltaY < 0 ? 1.12 : .88, event.clientX, event.clientY, event.currentTarget);
  };

  return (
    <section className="workspace-pane preview-pane" aria-label="Diagram preview">
      <div
        className={`preview-content ${isPanning ? 'is-panning' : ''}`}
        onPointerDown={beginPan}
        onPointerMove={movePan}
        onPointerUp={endPan}
        onPointerCancel={endPan}
        onWheel={zoomCanvas}
      >
        <div className="canvas-label">CANVAS</div>
        {svg ? <div className="diagram-transform" style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})` }}><div className="diagram" dangerouslySetInnerHTML={{ __html: svg }} /></div> : <p className="empty-preview">Start writing Mermaid syntax to see your diagram.</p>}
        {svg ? <div className="canvas-controls" role="group" aria-label="Canvas navigation">
          <button type="button" onClick={() => zoomAt(.8)} aria-label="Zoom out" title="Zoom out">−</button>
          <button type="button" className="zoom-value" onClick={() => setViewport({ scale: 1, x: 0, y: 0 })} aria-label="Reset canvas view" title="Reset canvas view">{Math.round(viewport.scale * 100)}%</button>
          <button type="button" onClick={() => zoomAt(1.25)} aria-label="Zoom in" title="Zoom in">+</button>
          <span className="control-divider" />
          <button type="button" className="fit-button" onClick={() => setViewport({ scale: 1, x: 0, y: 0 })} aria-label="Fit diagram to canvas" title="Fit diagram to canvas">⊙</button>
        </div> : null}
        {svg ? <p className="canvas-hint">Drag to pan · Scroll to zoom</p> : null}
        {isRendering && svg ? <span className="rendering-indicator">Updating preview…</span> : null}
        {error ? <div className="render-error" role="alert"><strong>Can’t render this diagram</strong><span>{error}</span></div> : null}
      </div>
    </section>
  );
}
