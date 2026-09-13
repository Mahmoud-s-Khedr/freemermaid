export type ColorMode = 'system' | 'light' | 'dark';

export interface SavedDraft {
  source: string;
  colorMode: ColorMode;
}

export interface RenderedDiagram {
  svg: string;
  diagramType: string;
}
