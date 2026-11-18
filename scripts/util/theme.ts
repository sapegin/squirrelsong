import fs from 'node:fs';
import { hexToRgb } from './hexToRgb.ts';
import { stripJsonComments } from './stripJsonComments.ts';

export type Palette = Record<string, string>;
export type ColorRef = string | [string, string];
export type ColorMap = Record<string, ColorRef>;
export type SchemeName = 'light' | 'dark';

export interface ThemeSpec {
  palette: Palette;
  theme: ColorMap;
}

export interface ThemeSpecs {
  light: ThemeSpec;
  dark: ThemeSpec;
}

export function readJsonFile<T>(file: string): T {
  return JSON.parse(stripJsonComments(fs.readFileSync(file, 'utf8'))) as T;
}

export function readThemeSpec(scheme: SchemeName): ThemeSpec {
  return {
    palette: readJsonFile<Palette>(`${scheme}/palette.json`),
    theme: readJsonFile<ColorMap>(`${scheme}/theme.json`),
  };
}

export function readThemeSpecs(): ThemeSpecs {
  return {
    light: readThemeSpec('light'),
    dark: readThemeSpec('dark'),
  };
}

export function readPalettes(): { light: Palette; dark: Palette } {
  return {
    light: readJsonFile<Palette>('light/palette.json'),
    dark: readJsonFile<Palette>('dark/palette.json'),
  };
}

export function resolveColorRef(colorInfo: ColorRef): {
  paletteName: string;
  style?: string;
} {
  if (Array.isArray(colorInfo)) {
    return { paletteName: colorInfo[0], style: colorInfo[1] };
  }
  return { paletteName: colorInfo };
}

export function resolveColorName(colorInfo: ColorRef): string {
  return resolveColorRef(colorInfo).paletteName;
}

export function getPaletteColor(
  palette: Palette,
  colorName: string,
  scheme: SchemeName
): string {
  if (Object.hasOwn(palette, colorName) === false) {
    throw new Error(`Color not found in the ${scheme} palette: ${colorName}`);
  }
  return palette[colorName];
}

export interface ResolvedThemeSpec {
  theme: Record<string, string>;
  context: Record<string, string>;
}

export function resolveColorMap(
  spec: ThemeSpec,
  colorMap: ColorMap,
  scheme: SchemeName
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(colorMap).map(([key, colorInfo]) => [
      key,
      getPaletteColor(spec.palette, resolveColorName(colorInfo), scheme),
    ])
  );
}

/** SRGB 0–1 components for AppKit `NSColor(srgbRed:green:blue:alpha:)`. */
export interface SrgbColor {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export function hexToSrgb(hex: string): SrgbColor {
  const [r, g, b] = hexToRgb(hex);
  return { red: r / 255, green: g / 255, blue: b / 255, alpha: 1 };
}

export function resolveColorMapSrgb(
  spec: ThemeSpec,
  colorMap: ColorMap,
  scheme: SchemeName
): Record<string, SrgbColor> {
  const resolved = resolveColorMap(spec, colorMap, scheme);
  return Object.fromEntries(
    Object.entries(resolved).map(([key, hex]) => [key, hexToSrgb(hex)])
  );
}

export function isCodeColorKey(key: string): boolean {
  return key.startsWith('code');
}

export function isTerminalColorKey(key: string): boolean {
  return key.startsWith('terminal');
}

export function filterColorMap(
  colorMap: ColorMap,
  predicate: (key: string) => boolean
): ColorMap {
  return Object.fromEntries(
    Object.entries(colorMap).filter(([key]) => predicate(key))
  );
}

export function resolveCodeStyles(colorMap: ColorMap): Record<string, string> {
  return Object.fromEntries(
    Object.entries(filterColorMap(colorMap, isCodeColorKey)).map(
      ([key, colorInfo]) => [
        `${key}Style`,
        resolveColorRef(colorInfo).style ?? '',
      ]
    )
  );
}

export function resolveThemeSpec(
  spec: ThemeSpec,
  scheme: SchemeName
): ResolvedThemeSpec {
  const theme = resolveColorMap(spec, spec.theme, scheme);
  const codeStyles = resolveCodeStyles(spec.theme);

  return {
    theme,
    context: {
      ...spec.palette,
      ...theme,
      ...codeStyles,
    },
  };
}
