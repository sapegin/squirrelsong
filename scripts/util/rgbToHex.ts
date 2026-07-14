/**
 * Convert RGB/RGBA color to HEX color string
 * - 255, 0, 0  → 'ff0000'
 * - 255, 0, 0, 0.5  → 'ff000080'
 */
export function rgbToHex(r: number, g: number, b: number, a?: number): string {
  const rgb = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  if (a) {
    const alpha = Math.round(a * 255)
      .toString(16)
      .padStart(2, '0');
    return rgb + alpha;
  }
  return rgb;
}
