function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function downloadSource(source: string): void {
  triggerDownload(new Blob([source], { type: 'text/plain;charset=utf-8' }), 'diagram.mmd');
}

export function downloadSvg(svg: string): void {
  triggerDownload(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), 'diagram.svg');
}

function getSvgSize(svg: string): { width: number; height: number } {
  const document = new DOMParser().parseFromString(svg, 'image/svg+xml');
  const root = document.documentElement;
  const viewBox = root.getAttribute('viewBox')?.trim().split(/[ ,]+/).map(Number);
  if (viewBox?.length === 4 && viewBox.every(Number.isFinite)) {
    return { width: Math.max(1, viewBox[2]), height: Math.max(1, viewBox[3]) };
  }

  const width = Number.parseFloat(root.getAttribute('width') ?? '1200');
  const height = Number.parseFloat(root.getAttribute('height') ?? '800');
  return {
    width: Number.isFinite(width) ? Math.max(1, width) : 1200,
    height: Number.isFinite(height) ? Math.max(1, height) : 800
  };
}

export async function downloadPng(svg: string): Promise<void> {
  const { width, height } = getSvgSize(svg);
  const scale = 2;
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error('The diagram could not be converted to PNG.'));
      element.src = svgUrl;
    });
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(width * scale);
    canvas.height = Math.ceil(height * scale);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Your browser does not support PNG export.');
    context.scale(scale, scale);
    context.drawImage(image, 0, 0, width, height);

    const png = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('The PNG export failed.'))), 'image/png');
    });
    triggerDownload(png, 'diagram.png');
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}
