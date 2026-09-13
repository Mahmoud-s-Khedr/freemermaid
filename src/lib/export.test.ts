/** @vitest-environment jsdom */
import { describe, expect, it, vi } from 'vitest';
import { downloadSource, downloadSvg } from './export';

describe('downloads', () => {
  it('uses a Mermaid source file extension', () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    downloadSource('flowchart LR');
    expect(click).toHaveBeenCalledOnce();
    expect(createObjectURL).toHaveBeenCalledOnce();
    click.mockRestore();
    createObjectURL.mockRestore();
  });

  it('creates an SVG download', () => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    downloadSvg('<svg viewBox="0 0 10 10" />');
    expect(click).toHaveBeenCalledOnce();
    expect(createObjectURL).toHaveBeenCalledOnce();
    click.mockRestore();
    createObjectURL.mockRestore();
  });
});
