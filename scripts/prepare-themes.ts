/**
 * Generate themes based on templates.
 */

import fs from 'node:fs';
import path from 'node:path';
import { stripJsonComments } from './util/stripJsonComments.ts';
import {
  processTemplate,
  applyReadmeTemplate,
  renderTemplate,
  type TemplateContext,
} from './util/template.ts';
import { terminalLink } from './util/terminalLink.ts';

type Palette = Record<string, string>;
type ColorRef = string | [string, string];
type ColorMap = Record<string, ColorRef>;
type SchemeName = 'light' | 'dark';
type MixinName = 'terminalLight' | 'terminalDark';

interface ThemeEntry {
  file: string;
  scheme?: string;
  mixin?: string;
  context?: Record<string, string>;
}

interface ThemeConfig {
  themes?: ThemeEntry[];
}

function readJsonFile<T>(file: string): T {
  return JSON.parse(stripJsonComments(fs.readFileSync(file, 'utf8'))) as T;
}

function resolveColorName(colorInfo: ColorRef): string {
  return Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
}

function getPaletteColor(
  palette: Palette,
  colorName: string,
  paletteLabel: string
): string {
  if (Object.hasOwn(palette, colorName) === false) {
    console.error(
      `⛔️ Color not found in the ${paletteLabel} palette: ${colorName}`
    );
    return '';
  }
  return palette[colorName];
}

const lightPalette = readJsonFile<Palette>(`light/palette.json`);
const lightAnsiPaletteRaw =
  readJsonFile<Record<string, string>>(`light/ansi.json`);
const lightCodePaletteRaw = readJsonFile<ColorMap>(`light/code.json`);
const lightUiPaletteRaw = readJsonFile<ColorMap>(`light/ui.json`);

const darkPalette = readJsonFile<Palette>(`dark/palette.json`);
const darkAnsiPaletteRaw =
  readJsonFile<Record<string, string>>(`dark/ansi.json`);
const darkCodePaletteRaw = readJsonFile<ColorMap>(`dark/code.json`);
const darkUiPaletteRaw = readJsonFile<ColorMap>(`dark/ui.json`);

// Convert ANSI color names to HEX values

const lightAnsiPalette = Object.fromEntries(
  Object.entries(lightAnsiPaletteRaw).map(([key, colorName]) => [
    key,
    getPaletteColor(lightPalette, colorName, 'light'),
  ])
);
const darkAnsiPalette = Object.fromEntries(
  Object.entries(darkAnsiPaletteRaw).map(([key, colorName]) => [
    key,
    getPaletteColor(darkPalette, colorName, 'dark'),
  ])
);

// Convert code color names to HEX values

const lightCodePalette = Object.fromEntries(
  Object.entries(lightCodePaletteRaw).map(([key, colorInfo]) => [
    key,
    getPaletteColor(lightPalette, resolveColorName(colorInfo), 'light'),
  ])
);
const darkCodePalette = Object.fromEntries(
  Object.entries(darkCodePaletteRaw).map(([key, colorInfo]) => [
    key,
    getPaletteColor(darkPalette, resolveColorName(colorInfo), 'dark'),
  ])
);

// Extract code styles

const lightCodeStyles = Object.fromEntries(
  Object.entries(lightCodePaletteRaw).map(([key, colorInfo]) => {
    const style = Array.isArray(colorInfo) ? colorInfo[1] : '';
    return [`${key}Style`, style];
  })
);

const darkCodeStyles = Object.fromEntries(
  Object.entries(darkCodePaletteRaw).map(([key, colorInfo]) => {
    const style = Array.isArray(colorInfo) ? colorInfo[1] : '';
    return [`${key}Style`, style];
  })
);

// Convert UI color names to HEX values

const lightUiPalette = Object.fromEntries(
  Object.entries(lightUiPaletteRaw).map(([key, colorInfo]) => [
    key,
    getPaletteColor(lightPalette, resolveColorName(colorInfo), 'light'),
  ])
);
const darkUiPalette = Object.fromEntries(
  Object.entries(darkUiPaletteRaw).map(([key, colorInfo]) => [
    key,
    getPaletteColor(darkPalette, resolveColorName(colorInfo), 'dark'),
  ])
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[THEME] Preparing themes… 🌗');

const schemes: Record<SchemeName, TemplateContext> = {
  light: {
    ...lightPalette,
    ...lightUiPalette,
    ...lightAnsiPalette,
    ...lightCodePalette,
    ...lightCodeStyles,
  },
  dark: {
    ...darkPalette,
    ...darkUiPalette,
    ...darkAnsiPalette,
    ...darkCodePalette,
    ...darkCodeStyles,
  },
};

const mixins: Record<MixinName, TemplateContext> = {
  terminalLight: {
    ...lightAnsiPalette,
    terminalBorder: lightUiPalette.border,
    terminalMatchBackground: lightUiPalette.matchBackground,
    terminalMatchBase: lightUiPalette.matchBase,
    terminalSelectionBase: lightUiPalette.selectionBase,
  },
  terminalDark: {
    ...darkAnsiPalette,
    terminalBorder: darkUiPalette.border,
    terminalMatchBackground: darkUiPalette.matchBackground,
    terminalMatchBase: darkUiPalette.matchBase,
    terminalSelectionBase: darkUiPalette.selectionBase,
  },
};

const sharedScheme: TemplateContext = {};
for (const [key] of Object.entries(schemes.light)) {
  sharedScheme[`light:${key}`] = schemes.light[key];
  sharedScheme[`dark:${key}`] = schemes.dark[key];
}

function isSchemeName(value: string): value is SchemeName {
  return value in schemes;
}

function isMixinName(value: string): value is MixinName {
  return value in mixins;
}

const configs = fs.globSync('themes/**/config.json').toSorted();

for (const configFile of configs) {
  if (configFile.includes('node_modules')) {
    continue;
  }

  const folder = path.dirname(configFile);
  console.log(
    '👉',
    terminalLink(folder, `vscode://file//${path.resolve(configFile)}`)
  );
  const config = readJsonFile<ThemeConfig>(configFile);

  if (!config.themes) {
    console.error(`   🦀 The 'themes' array is missing`);
    continue;
  }

  // Find a template: any file that has `.template.` in its name
  const templateFiles = fs.globSync(path.join(folder, '*.template.*'));
  const templateFile = templateFiles.at(0);
  if (
    templateFile === undefined &&
    config.themes.some((x) => x.file !== 'Readme.md')
  ) {
    console.error(`   🦀 Template file not found`);
    continue;
  }

  for (const theme of config.themes) {
    console.log(`   ${theme.file}`);

    const scheme = theme.scheme;
    let schemeContext = sharedScheme;
    if (scheme !== undefined) {
      if (!isSchemeName(scheme)) {
        console.error(
          `   🦀 Scheme '${scheme}' not found, possible values: ${Object.keys(schemes).join(', ')}`
        );
        continue;
      }
      schemeContext = schemes[scheme];
    }

    const mixin = theme.mixin;
    let mixinContext: TemplateContext = {};
    if (mixin !== undefined) {
      if (!isMixinName(mixin)) {
        console.error(
          `   🦀 Mixin '${mixin}' not found, possible values: ${Object.keys(mixins).join(', ')}`
        );
        continue;
      }
      mixinContext = mixins[mixin];
    }

    // Prepare the context: base palette + mixin + custom values
    const context: TemplateContext = {
      ...schemeContext,
      ...mixinContext,
    };
    for (const [key, value] of Object.entries(theme.context ?? {})) {
      if (typeof value === 'string' && value.includes('{{')) {
        // Expand {{...}} placeholders against the current context
        context[key] = renderTemplate(value, context, configFile);
      } else {
        context[key] = context[value] ?? value;
      }
    }

    const destFile = path.join(folder, theme.file);

    if (theme.file === 'Readme.md') {
      applyReadmeTemplate(destFile, theme.scheme ?? 'theme', context);
      continue;
    }

    if (templateFile === undefined) {
      continue;
    }

    processTemplate(templateFile, destFile, context);
  }
}
