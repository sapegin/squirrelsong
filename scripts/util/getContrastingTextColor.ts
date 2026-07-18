import { hexToRgb } from './hexToRgb.ts';

/**
 * Calculate relative luminance of a color
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);

  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.039_28 ? sRGB / 12.92 : ((sRGB + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Get contrasting text color (black or white) for a given background color.
 * - Returns #fff for luminance lower than 0.5
 * - Returns #000 for luminance greater or equal to 0.5
 */
export function getContrastingTextColor(
  hexBackground: string
): '#000' | '#fff' {
  const luminance = getLuminance(hexBackground);
  return luminance < 0.5 ? '#fff' : '#000';
}
