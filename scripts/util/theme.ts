import fs from 'node:fs';
import { stripJsonComments } from './stripJsonComments.ts';

export type Palette = Record<string, string>;
export type ColorRef = string | [string, string];
export type ColorMap = Record<string, ColorRef>;
export type AnsiMap = Record<string, string>;
export type SchemeName = 'light' | 'dark';

export interface ThemeSpec {
  palette: Palette;
  ui: ColorMap;
  code: ColorMap;
  ansi: AnsiMap;
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
    ui: readJsonFile<ColorMap>(`${scheme}/ui.json`),
    code: readJsonFile<ColorMap>(`${scheme}/code.json`),
    ansi: readJsonFile<AnsiMap>(`${scheme}/ansi.json`),
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
  ui: Record<string, string>;
  ansi: Record<string, string>;
  context: Record<string, string>;
}

export function resolveColorMap(
  spec: ThemeSpec,
  colorMap: ColorMap | AnsiMap,
  scheme: SchemeName
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(colorMap).map(([key, colorInfo]) => [
      key,
      getPaletteColor(spec.palette, resolveColorName(colorInfo), scheme),
    ])
  );
}

export function resolveCodeStyles(colorMap: ColorMap): Record<string, string> {
  return Object.fromEntries(
    Object.entries(colorMap).map(([key, colorInfo]) => [
      `${key}Style`,
      resolveColorRef(colorInfo).style ?? '',
    ])
  );
}

export function resolveThemeSpec(
  spec: ThemeSpec,
  scheme: SchemeName
): ResolvedThemeSpec {
  const ui = resolveColorMap(spec, spec.ui, scheme);
  const ansi = resolveColorMap(spec, spec.ansi, scheme);
  const code = resolveColorMap(spec, spec.code, scheme);
  const codeStyles = resolveCodeStyles(spec.code);

  return {
    ui,
    ansi,
    context: {
      ...spec.palette,
      ...ui,
      ...ansi,
      ...code,
      ...codeStyles,
    },
  };
}
