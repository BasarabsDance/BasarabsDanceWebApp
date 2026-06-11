'use client';
import { useEffect, useState } from 'react';

/**
 * Loads an image and removes its (near-)white background via canvas,
 * returning a transparent PNG data URL. The logo ornaments in /public/logo
 * are exported on white, so every component rendering them needs this.
 */
export function useTransparentImage(src: string) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;
    setUrl(null);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const id = ctx.getImageData(0, 0, c.width, c.height);
      const d = id.data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] > 228 && d[i + 1] > 228 && d[i + 2] > 228) d[i + 3] = 0;
      }
      ctx.putImageData(id, 0, 0);
      setUrl(c.toDataURL('image/png'));
    };
    img.src = src;
  }, [src]);

  return url;
}
