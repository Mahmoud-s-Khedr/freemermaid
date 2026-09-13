import { useEffect, useMemo, useRef, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { downloadPng, downloadSource, downloadSvg } from './lib/export';
import { renderDiagram } from './lib/mermaid';
import { clearDraft, loadDraft, saveDraft } from './lib/storage';
import type { ColorMode } from './lib/types';

const STARTER_SOURCE = `flowchart LR
  A[Write Mermaid] --> B[See it live]
  B --> C[Download SVG or PNG]
  C --> D[Work offline]
`;

type MobilePanel = 'editor' | 'preview';

function MarkIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M7 6.5h18v19H7z" fill="currentColor" opacity=".16" />
      <path d="M7.5 6.5h17a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 6 24V8a1.5 1.5 0 0 1 1.5-1.5Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M10.5 12h11M10.5 16h7M18.5 20h3" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function readableError(error: unknown): string {
  if (error instanceof Error) return error.message.replace(/^Error: /, '');
  return 'An unexpected error prevented this diagram from rendering.';
}

export default function App() {
  const [source, setSource] = useState(STARTER_SOURCE);
  const [colorMode, setColorMode] = useState<ColorMode>('system');
  const [svg, setSvg] = useState<string>();
  const [error, setError] = useState<string>();
  const [isRendering, setIsRendering] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activePanel, setActivePanel] = useState<MobilePanel>('editor');
  const [editorOpen, setEditorOpen] = useState(true);
  const [status, setStatus] = useState('Loading your saved draft.');
  const [exportError, setExportError] = useState<string>();
  const requestId = useRef(0);
  const mediaQuery = useMemo(() => window.matchMedia('(prefers-color-scheme: dark)'), []);
  const [systemIsDark, setSystemIsDark] = useState(mediaQuery.matches);
  const isDark = colorMode === 'dark' || (colorMode === 'system' && systemIsDark);

  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW();

  useEffect(() => {
    const updateSystemMode = (event: MediaQueryListEvent) => setSystemIsDark(event.matches);
    mediaQuery.addEventListener('change', updateSystemMode);
    return () => mediaQuery.removeEventListener('change', updateSystemMode);
  }, [mediaQuery]);

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#111827' : '#f8fafc');
  }, [isDark]);

  useEffect(() => {
    void loadDraft()
      .then((draft) => {
        if (draft) {
          setSource(draft.source);
          setColorMode(draft.colorMode);
          setStatus('Restored your local draft.');
        } else {
          setStatus('Your work stays on this device.');
        }
      })
      .catch(() => setStatus('Local storage is unavailable; this session will not be saved.'))
      .finally(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    void saveDraft({ source, colorMode }).catch(() => setStatus('Local storage is unavailable; this session will not be saved.'));
  }, [source, colorMode, isLoaded]);

  useEffect(() => {
    const activeRequest = ++requestId.current;
    const timer = window.setTimeout(() => {
      setIsRendering(true);
      void renderDiagram(source, isDark)
        .then((result) => {
          if (activeRequest !== requestId.current) return;
          setSvg(result.svg);
          setError(undefined);
          setStatus(`Rendered ${result.diagramType} diagram locally.`);
        })
        .catch((renderError: unknown) => {
          if (activeRequest !== requestId.current) return;
          setError(readableError(renderError));
          setStatus('The diagram has syntax or rendering errors.');
        })
        .finally(() => {
          if (activeRequest === requestId.current) setIsRendering(false);
        });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [source, isDark]);

  const exportDiagram = async (format: 'source' | 'svg' | 'png') => {
    setExportError(undefined);
    try {
      if (format === 'source') downloadSource(source);
      if (format === 'svg') {
        if (!svg || error) throw new Error('Fix the diagram before downloading an image.');
        downloadSvg(svg);
      }
      if (format === 'png') {
        if (!svg || error) throw new Error('Fix the diagram before downloading an image.');
        await downloadPng(svg);
      }
      setStatus(`Downloaded ${format === 'source' ? 'Mermaid source' : format.toUpperCase()}.`);
    } catch (exportFailure) {
      setExportError(readableError(exportFailure));
    }
  };

  const resetDraft = async () => {
    if (!window.confirm('Reset the local draft to the starter diagram? This cannot be undone.')) return;
    await clearDraft().catch(() => undefined);
    setSource(STARTER_SOURCE);
    setColorMode('system');
    setStatus('Restored the starter diagram.');
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-lockup">
          <a className="brand" href="/" aria-label="FreeMermaid home">
            <span className="brand-mark"><MarkIcon /></span>
            <span>FreeMermaid</span>
          </a>
        </div>
        <div className="toolbar" aria-label="Editor actions">
          <button
            className="code-toggle"
            aria-pressed={editorOpen}
            onClick={() => setEditorOpen((isOpen) => !isOpen)}
            title={editorOpen ? 'Hide Mermaid source' : 'Show Mermaid source'}
          >
            <span aria-hidden="true">&lt;/&gt;</span> Code
          </button>
          <div className="download-actions" role="group" aria-label="Download diagram">
            <button className="source-button" aria-label="Source" onClick={() => void exportDiagram('source')}>.mmd</button>
            <button onClick={() => void exportDiagram('svg')} disabled={!svg || Boolean(error)}>SVG</button>
            <button onClick={() => void exportDiagram('png')} disabled={!svg || Boolean(error)}>PNG</button>
          </div>
          <label className="mode-control">Theme
            <select value={colorMode} onChange={(event) => setColorMode(event.target.value as ColorMode)}>
              <option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option>
            </select>
          </label>
          <button className="quiet-button" onClick={() => void resetDraft()} title="Reset to the starter diagram">Reset</button>
        </div>
      </header>

      <div className={`workspace ${editorOpen ? 'editor-open' : 'editor-closed'} ${activePanel === 'editor' ? 'show-editor' : 'show-preview'}`}>
        <div className="mobile-tabs" role="tablist" aria-label="Editor view">
          <button role="tab" aria-selected={activePanel === 'editor'} onClick={() => { setActivePanel('editor'); setEditorOpen(true); }}>Code</button>
          <button role="tab" aria-selected={activePanel === 'preview'} onClick={() => { setActivePanel('preview'); setEditorOpen(false); }}>Preview</button>
        </div>
        <Preview svg={svg} error={error} isRendering={isRendering} />
        <Editor source={source} onChange={setSource} onClose={() => { setEditorOpen(false); setActivePanel('preview'); }} />
      </div>

      <p className="sr-only" role="status" aria-live="polite">{status}</p>
      {exportError ? <p className="toast" role="alert">{exportError}</p> : null}
      {needRefresh ? <aside className="update-prompt" role="status">A new version is ready. <button onClick={() => void updateServiceWorker(true)}>Refresh</button><button onClick={() => setNeedRefresh(false)} aria-label="Dismiss update">×</button></aside> : null}
    </main>
  );
}
