import mermaid from 'mermaid';
import type { RenderedDiagram } from './types';

let renderNumber = 0;

export async function renderDiagram(source: string, isDark: boolean): Promise<RenderedDiagram> {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: isDark ? 'dark' : 'default',
    htmlLabels: false,
    flowchart: { htmlLabels: false },
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  });

  const parsed = await mermaid.parse(source, { suppressErrors: false });
  const { svg } = await mermaid.render(`freemermaid-${++renderNumber}`, source);

  return { svg, diagramType: parsed.diagramType };
}
