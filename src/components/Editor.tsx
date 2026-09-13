import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import type { CSSProperties } from 'react';

interface EditorProps {
  source: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export function Editor({ source, onChange, onClose }: EditorProps) {
  const lineCount = source.split('\n').length;
  const codeHeight = Math.min(440, Math.max(122, 30 + lineCount * 26));
  return (
    <section className="workspace-pane editor-pane" aria-label="Diagram source" style={{ '--editor-height': `${codeHeight + 110}px` } as CSSProperties}>
      <div className="pane-heading editor-heading">
        <div className="pane-title"><span className="pane-icon code-icon">&lt;/&gt;</span><div><h2>Mermaid source</h2><p>Describe your diagram in plain text</p></div></div>
        <div className="editor-heading-actions"><span className="file-chip">diagram.mmd</span><button className="close-editor" type="button" onClick={onClose} aria-label="Hide Mermaid source" title="Hide Mermaid source">×</button></div>
      </div>
      <CodeMirror
        value={source}
        height={`${codeHeight}px`}
        extensions={[markdown()]}
        onChange={onChange}
        basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: true }}
        aria-label="Mermaid diagram source"
      />
      <div className="editor-footer"><span><i /> Auto-saved locally</span><span>{lineCount} lines</span></div>
    </section>
  );
}
