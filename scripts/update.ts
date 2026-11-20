/**
 * Generate Markdown palette tables in Readme files and HTML theme preview from
 * JSON files.
 */

import fs from 'node:fs';
import { getContrastingTextColor } from './util/getContrastingTextColor.ts';
import { hexToRgb } from './util/hexToRgb.ts';
import {
  filterColorMap,
  getPaletteColor,
  isCodeColorKey,
  isTerminalColorKey,
  readThemeSpecs,
  resolveColorMap,
  resolveColorMapSrgb,
  resolveColorRef,
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
      (row) => `<div class="compare-row">
${renderSwatch(row.light)}
${renderSwatch(row.dark)}
</div>`
    )
    .join('\n');
  return `<section class="section" id="${section.id}">
<h2>${section.title}</h2>
<div class="compare">
<div class="compare-row row-header">
<div>Light</div>
<div>Dark</div>
</div>
${rows}
</div>
</section>`;
}

function renderSidebar(sections: ComparisonSection[]): string {
  const items = sections
    .map(
      (section, index) =>
        `<a class="sidebar-item${index === 0 ? ' active' : ''}" href="#${section.id}">${section.title}</a>`
    )
    .join('\n          ');
  return `<nav class="sidebar" aria-label="Sections">
          ${items}
        </nav>`;
}

function buildColorMapSection(
  id: string,
  title: string,
  light: ThemeSpec,
  dark: ThemeSpec,
  getColorMap: (spec: ThemeSpec) => ColorMap
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

function buildPreviewSections({
  light,
  dark,
}: ThemeSpecs): ComparisonSection[] {
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
    buildColorMapSection('ui', 'UI colors', light, dark, (spec) =>
      filterColorMap(
        spec.theme,
        (key) =>
          isCodeColorKey(key) === false && isTerminalColorKey(key) === false
      )
    ),
    buildColorMapSection('code', 'Code colors', light, dark, (spec) =>
      filterColorMap(spec.theme, isCodeColorKey)
    ),
    buildColorMapSection('ansi', 'ANSI colors', light, dark, (spec) =>
      filterColorMap(spec.theme, isTerminalColorKey)
    ),
  ];
}

function generateThemePreviewHtml(sections: ComparisonSection[]): string {
  const defaultSectionId = sections[0]?.id ?? 'palette';
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Squirrelsong theme</title>
    <link rel="stylesheet" href="themes/CSS/squirrelsong.css" />
    <link rel="stylesheet" href="themes/CSS/squirrelsong-ui.css" />
    <link rel="stylesheet" href="themes/CSS/squirrelsong-preview.css" />
    <style>
      .compare {
        display: grid;
        gap: 1.5rem;
      }
      .compare-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        align-items: stretch;
      }
      .compare-row.row-header {
        font-weight: bold;
        color: var(--title-foreground);
      }
      .swatch {
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
      }
      .swatch div:first-child {
        font-weight: bold;
      }
    </style>
  </head>
  <body class="light" data-default-section="${defaultSectionId}">
    <script src="themes/CSS/squirrelsong-preview.js"></script>
    <svg class="icon-sprite" aria-hidden="true">
      <symbol id="icon-sun" viewBox="0 0 24 24">
        <path
          d="M12 19a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm0-1.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 1 0 0 11Zm-5.657.157a.75.75 0 0 1 0 1.06l-1.768 1.768a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.767-1.768a.75.75 0 0 1 1.061 0ZM3.515 3.515a.75.75 0 0 1 1.06 0l1.768 1.768a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L3.515 4.575a.75.75 0 0 1 0-1.06ZM12 0a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 12 0ZM4 12a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1 0-1.5h2.5A.75.75 0 0 1 4 12Zm8 8a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5A.75.75 0 0 1 12 20Zm12-8a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h2.5A.75.75 0 0 1 24 12Zm-6.343 5.657a.75.75 0 0 1 1.06 0l1.768 1.768a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018l-1.768-1.767a.75.75 0 0 1 0-1.061Zm2.828-14.142a.75.75 0 0 1 0 1.06l-1.768 1.768a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l1.767-1.768a.75.75 0 0 1 1.061 0Z"
        />
      </symbol>
      <symbol id="icon-moon" viewBox="0 0 24 24">
        <path
          d="M14.768 3.96v.001l-.002-.005a9.08 9.08 0 0 0-.218-.779c-.13-.394.21-.8.602-.67.29.096.575.205.855.328l.01.005A10.002 10.002 0 0 1 12 22a10.002 10.002 0 0 1-9.162-5.985l-.004-.01a9.722 9.722 0 0 1-.329-.855c-.13-.392.277-.732.67-.602.257.084.517.157.78.218l.004.002A9 9 0 0 0 14.999 6a9.09 9.09 0 0 0-.231-2.04ZM16.5 6c0 5.799-4.701 10.5-10.5 10.5-.426 0-.847-.026-1.26-.075A8.5 8.5 0 1 0 16.425 4.74c.05.413.075.833.075 1.259Z"
        />
      </symbol>
    </svg>

    <div class="app">
      <header class="toolbar">
        <div class="toolbar-title">Squirrelsong</div>
        <nav class="tabs toolbar-tabs" aria-label="Pages">
          <a class="tab is-active" href="squirrelsong.html">
            <span class="tab-inner">Theme</span>
          </a>
          <a class="tab" href="squirrelsong-ui.html">
            <span class="tab-inner">UI</span>
          </a>
          <a class="tab" href="squirrelsong-cli.html">
            <span class="tab-inner">CLI</span>
          </a>
        </nav>
        <div class="toolbar-actions">
          <button
            class="icon-btn"
            id="theme-light"
            type="button"
            aria-label="Light theme"
          >
            <svg aria-hidden="true"><use href="#icon-sun" /></svg>
          </button>
          <button
            class="icon-btn"
            id="theme-dark"
            type="button"
            aria-label="Dark theme"
          >
            <svg aria-hidden="true"><use href="#icon-moon" /></svg>
          </button>
        </div>
      </header>

      <div class="layout">
        ${renderSidebar(sections)}

        <main class="main">
${sections.map(renderComparisonSection).join('\n')}
        </main>
      </div>
    </div>
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

const macOSThemePath = 'themes/macOS/squirrelsong-macos.json';
console.log('[UPDATE] Updating macOS theme...');
fs.mkdirSync('themes/macOS', { recursive: true });
fs.writeFileSync(
  macOSThemePath,
  `${JSON.stringify(
    {
      version: 1,
      ui: {
        light: resolveColorMapSrgb(
          themeSpecs.light,
          filterColorMap(
            themeSpecs.light.theme,
            (key) =>
              isCodeColorKey(key) === false && isTerminalColorKey(key) === false
          ),
          'light'
        ),
        dark: resolveColorMapSrgb(
          themeSpecs.dark,
          filterColorMap(
            themeSpecs.dark.theme,
            (key) =>
              isCodeColorKey(key) === false && isTerminalColorKey(key) === false
          ),
          'dark'
        ),
      },
    },
    null,
    2
  )}\n`
);
console.log(`[UPDATE] 👉 ${macOSThemePath}`);

console.log('[UPDATE] Done 🦜');
