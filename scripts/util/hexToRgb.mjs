/**
 * Convert HEX color to RGB array
 * - 'ff0000' → [255, 0, 0]
 */
export function hexToRgb(hex) {
  const rgb = Number.parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xFF;
  const g = (rgb >> 8) & 0xFF;
  const b = Math.trunc(rgb) & 0xFF;
  return [r, g, b];
}
