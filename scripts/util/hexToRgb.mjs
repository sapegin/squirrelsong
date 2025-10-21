/**
 * Convert HEX color to RGB array
 * - 'ff0000' → [255, 0, 0]
 */
export function hexToRgb(hex) {
  const rgb = Number.parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = Math.trunc(rgb) & 0xff;
  return [r, g, b];
}
