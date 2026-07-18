/**
 * Generate Markdown palette tables in Readme files and HTML theme preview from
 * JSON files.
 */

import fs from 'node:fs';
import { getContrastingTextColor } from './util/getContrastingTextColor.ts';
import { hexToRgb } from './util/hexToRgb.ts';
import {
  getPaletteColor,
  readThemeSpecs,
  resolveColorMap,
  resolveColorRef,
  type AnsiMap,
  type ColorMap,
  type Palette,
  type ThemeSpec,
  type ThemeSpecs,
} from './util/theme.ts';

interface Swatch {
  semanticName?: string;
  paletteName: string;
  hex: string;
  style?: string;
}

interface ComparisonRow {
  light: Swatch;
  dark: Swatch;
}

interface ComparisonSection {
  id: string;
  title: string;
  rows: ComparisonRow[];
}

const SWATCH_SIZE = 20;
const PREVIEW_FILE = 'squirrelsong.html';

const stripSharp = (hex: string): string => hex.replace('#', '');

const markdownSwatch = (hex: string): string =>
  `<img src="http://www.thecolorapi.com/id?format=svg&named=false&hex=${stripSharp(
    hex
  )}" width="${SWATCH_SIZE}" height="${SWATCH_SIZE}" alt="">`;

function generateMarkdownTable(palette: Palette): string {
  const header = `|  | Name | Hex | RGB |\n| --- | --- | --- | --- |`;

  const rows = Object.entries(palette).map(
    ([name, hex]) =>
      `| ${markdownSwatch(hex)} | ${name} | ${hex} | ${hexToRgb(hex).join(', ')} |`
  );

  return [header, ...rows].join('\n');
}

function updateMarkdownFile(filepath: string, paletteMd: string): void {
  const markdown = fs.readFileSync(filepath, 'utf8');

  const markdownNext = markdown.replace(
    /<!-- palette:begin -->[\S\s]*?<!-- palette:end -->/m,
    `<!-- palette:begin -->\n\n${paletteMd}\n\n<!-- palette:end -->`
  );

  fs.writeFileSync(filepath, markdownNext);
}

function mergeKeys(
  light: Record<string, unknown>,
  dark: Record<string, unknown>
): string[] {
  const keys = Object.keys(light);
  for (const key of Object.keys(dark)) {
    if (keys.includes(key) === false) {
      keys.push(key);
    }
  }
  return keys;
}

function formatSwatchTitle(swatch: Swatch): string {
  if (swatch.semanticName) {
    return `${swatch.semanticName} (${swatch.paletteName})`;
  }
  return swatch.paletteName;
}

function renderSwatch(swatch: Swatch): string {
  const textColor = getContrastingTextColor(swatch.hex);
  const [r, g, b] = hexToRgb(swatch.hex);
  const lines = [
    formatSwatchTitle(swatch),
    swatch.hex,
    `RGB(${r}, ${g}, ${b})`,
    swatch.style,
  ]
    .filter((line): line is string => line !== undefined && line !== '')
    .map((line) => `<div>${line}</div>`)
    .join('');

  return `<div class="swatch" style="background:${swatch.hex};color:${textColor}">${lines}</div>`;
}

function renderComparisonSection(section: ComparisonSection): string {
  const rows = section.rows
    .map(
      (row) => `<div class="row">
${renderSwatch(row.light)}
${renderSwatch(row.dark)}
</div>`
    )
    .join('\n');
  return `<section id="${section.id}">
<h2>${section.title}</h2>
<div class="compare">
<div class="row row-header">
<div>Light</div>
<div>Dark</div>
</div>
${rows}
</div>
</section>`;
}

function renderNav(sections: ComparisonSection[]): string {
  const links = sections
    .map((section) => `<a href="#${section.id}">${section.title}</a>`)
    .join('\n');
  return `<nav class="nav">${links}</nav>`;
}

function buildColorMapSection(
  id: string,
  title: string,
  light: ThemeSpec,
  dark: ThemeSpec,
  getColorMap: (spec: ThemeSpec) => ColorMap | AnsiMap
): ComparisonSection {
  const lightColorMap = getColorMap(light);
  const darkColorMap = getColorMap(dark);
  const lightHex = resolveColorMap(light, lightColorMap, 'light');
  const darkHex = resolveColorMap(dark, darkColorMap, 'dark');

  return {
    id,
    title,
    rows: mergeKeys(lightColorMap, darkColorMap).map((semanticName) => {
      const lightInfo = resolveColorRef(lightColorMap[semanticName]);
      const darkInfo = resolveColorRef(darkColorMap[semanticName]);

      return {
        light: {
          semanticName,
          paletteName: lightInfo.paletteName,
          hex: lightHex[semanticName],
          style: lightInfo.style,
        },
        dark: {
          semanticName,
          paletteName: darkInfo.paletteName,
          hex: darkHex[semanticName],
          style: darkInfo.style,
        },
      };
    }),
  };
}

function buildPreviewSections({ light, dark }: ThemeSpecs): ComparisonSection[] {
  return [
    {
      id: 'palette',
      title: 'Palette',
      rows: mergeKeys(light.palette, dark.palette).map((paletteName) => ({
        light: {
          paletteName,
          hex: getPaletteColor(light.palette, paletteName, 'light'),
        },
        dark: {
          paletteName,
          hex: getPaletteColor(dark.palette, paletteName, 'dark'),
        },
      })),
    },
    buildColorMapSection('ui', 'UI colors', light, dark, (spec) => spec.ui),
    buildColorMapSection('code', 'Code colors', light, dark, (spec) => spec.code),
    buildColorMapSection('ansi', 'ANSI colors', light, dark, (spec) => spec.ansi),
  ];
}

function generateThemePreviewHtml(sections: ComparisonSection[]): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Squirrelsong theme</title>
<style>
body { font: 16px/1.5 system-ui, sans-serif; margin: 0.5rem 2rem 2rem; }
h1, h2 { font-weight: bold; }
.nav { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 1rem 0 2rem; }
.nav a { color: inherit; }
section + section { margin-top: 3rem; }
.compare { display: grid; gap: 1.5rem; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-items: stretch; }
.row-header { font-weight: bold; }
.swatch { padding: 0.5rem 1rem; border-radius: 0.25rem; }
.swatch div:first-child { font-weight: bold; opacity: 1; }
</style>
</head>
<body>
<h1>Squirrelsong theme</h1>
${renderNav(sections)}
${sections.map(renderComparisonSection).join('\n')}
</body>
</html>
`;
}

const themeSpecs = readThemeSpecs();

console.log('[UPDATE] Updating Markdown files...');

console.log('[UPDATE] 👉 light theme');
updateMarkdownFile(
  'light/Readme.md',
  generateMarkdownTable(themeSpecs.light.palette)
);

console.log('[UPDATE] 👉 dark theme');
updateMarkdownFile(
  'dark/Readme.md',
  generateMarkdownTable(themeSpecs.dark.palette)
);

console.log('[UPDATE] Updating theme preview...');
const previewSections = buildPreviewSections(themeSpecs);
fs.writeFileSync(PREVIEW_FILE, generateThemePreviewHtml(previewSections));
console.log(`[UPDATE] 👉 ${PREVIEW_FILE}`);

console.log('[UPDATE] Done 🦜');
