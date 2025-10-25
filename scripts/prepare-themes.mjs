/**
 * Generate themes based on templates:
 * - Alfred
 * - Bear
 * - Chrome
 * - CotEditor
 * - Fastmail
 * - Firefox
 * - fzf
 * - Ghostty
 * - iTerm
 * - Nimble Commander
 * - Sublime Text
 * - VSCode
 * - Warp
 * - WezTerm
 */

import fs from 'node:fs';
import stripJsonComments from 'strip-json-comments';
import { processTemplate, applyReadmeTemplate } from './util/template.mjs';
import { hexToRgb } from './util/hexToRgb.mjs';

function readJsonFile(file) {
  return JSON.parse(stripJsonComments(fs.readFileSync(file, 'utf8')));
}

const lightPalette = readJsonFile(`light/palette.json`);
const lightAnsiPaletteRaw = readJsonFile(`light/ansi.json`);
const lightCodePaletteRaw = readJsonFile(`light/code.json`);
const lightUiPaletteRaw = readJsonFile(`light/ui.json`);

const darkPalette = readJsonFile(`dark/palette.json`);
const darkAnsiPaletteRaw = readJsonFile(`dark/ansi.json`);
const darkCodePaletteRaw = readJsonFile(`dark/code.json`);
const darkUiPaletteRaw = readJsonFile(`dark/ui.json`);

function toCamelCase(str) {
  return str.replaceAll(/[-_\s]+(.)?/g, (_, char) =>
    char ? char.toUpperCase() : '',
  );
}

function getDarkDpColorName(colorName) {
  return colorName
    .replace('gray', 'purple')
    .replace(/^brightYellow$/, 'brightYellowPurple')
    .replace(/^brightYellowDim$/, 'brightYellowDimPurple');
}

// Convert ANSI color names to HEX values

const lightAnsiPalette = Object.fromEntries(
  Object.entries(lightAnsiPaletteRaw).map(([key, colorName]) => {
    if (lightPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the light palette: ${colorName}`);
    }
    return [key, lightPalette[colorName]];
  }),
);
const darkAnsiPalette = Object.fromEntries(
  Object.entries(darkAnsiPaletteRaw).map(([key, colorName]) => {
    if (darkPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the dark palette: ${colorName}`);
    }
    return [key, darkPalette[colorName]];
  }),
);

// Convert code color names to HEX values

const lightCodePalette = Object.fromEntries(
  Object.entries(lightCodePaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    if (lightPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the light palette: ${colorName}`);
    }
    return [toCamelCase(key), lightPalette[colorName]];
  }),
);
const darkCodePalette = Object.fromEntries(
  Object.entries(darkCodePaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    if (darkPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the dark palette: ${colorName}`);
    }
    return [toCamelCase(key), darkPalette[colorName]];
  }),
);

// Extract code styles

const lightCodeStyles = Object.fromEntries(
  Object.entries(lightCodePaletteRaw).map(([key, colorInfo]) => {
    const style = Array.isArray(colorInfo) ? colorInfo[1] : '';
    return [`${toCamelCase(key)}Style`, style];
  }),
);

const darkCodeStyles = Object.fromEntries(
  Object.entries(darkCodePaletteRaw).map(([key, colorInfo]) => {
    const style = Array.isArray(colorInfo) ? colorInfo[1] : '';
    return [`${toCamelCase(key)}Style`, style];
  }),
);

// Convert UI color names to HEX values

const lightUiPalette = Object.fromEntries(
  Object.entries(lightUiPaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    if (lightPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the light palette: ${colorName}`);
    }
    return [toCamelCase(key), lightPalette[colorName]];
  }),
);
const darkUiPalette = Object.fromEntries(
  Object.entries(darkUiPaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    if (darkPalette[colorName] === undefined) {
      console.error(`⛔️ Color not found in the dark palette: ${colorName}`);
    }
    return [toCamelCase(key), darkPalette[colorName]];
  }),
);

// Create Dark Deep Purple palettes

const darkDpPalette = Object.fromEntries(
  Object.entries(darkPalette).map(([colorName]) => {
    const paletteColorName = getDarkDpColorName(colorName);
    if (darkPalette[paletteColorName] === undefined) {
      console.error(
        `⛔️ Color not found in the dark palette: ${paletteColorName}`,
      );
    }
    return [colorName, darkPalette[paletteColorName]];
  }),
);
const darkDpAnsiPalette = Object.fromEntries(
  Object.entries(darkAnsiPaletteRaw).map(([key, colorName]) => {
    const paletteColorName = getDarkDpColorName(colorName);
    if (darkPalette[paletteColorName] === undefined) {
      console.error(
        `⛔️ Color not found in the dark palette: ${paletteColorName}`,
      );
    }
    return [key, darkPalette[paletteColorName]];
  }),
);
const darkDpCodePalette = Object.fromEntries(
  Object.entries(darkCodePaletteRaw).map(([key, colorInfo]) => {
    const colorName = Array.isArray(colorInfo) ? colorInfo[0] : colorInfo;
    const paletteColorName = getDarkDpColorName(colorName);
    if (darkPalette[paletteColorName] === undefined) {
      console.error(
        `⛔️ Color not found in the dark palette: ${paletteColorName}`,
      );
    }
    return [toCamelCase(key), darkPalette[paletteColorName]];
  }),
);
const darkDpUiPalette = Object.fromEntries(
  Object.entries(darkUiPaletteRaw).map(([key, colorName]) => {
    const paletteColorName = getDarkDpColorName(colorName);
    if (darkPalette[paletteColorName] === undefined) {
      console.error(
        `⛔️ Color not found in the dark palette: ${paletteColorName}`,
      );
    }
    return [toCamelCase(key), darkPalette[paletteColorName]];
  }),
);

// Convert HEX values to RGB

const lightRgbPalette = Object.fromEntries(
  Object.entries(lightPalette).map(([key, color]) => {
    return [key, hexToRgb(color).join(', ')];
  }),
);
const lightUiRgbPalette = Object.fromEntries(
  Object.entries(lightUiPalette).map(([key, color]) => {
    return [key, hexToRgb(color).join(', ')];
  }),
);
const darkRgbPalette = Object.fromEntries(
  Object.entries(darkPalette).map(([key, color]) => {
    return [key, hexToRgb(color).join(', ')];
  }),
);
const darkUiRgbPalette = Object.fromEntries(
  Object.entries(darkUiPalette).map(([key, color]) => {
    return [key, hexToRgb(color).join(', ')];
  }),
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[THEME] Preparing Alfred themes… 🌕');

processTemplate(
  'themes/Alfred/alfred.template.alfredappearance',
  'themes/Alfred/Squirrelsong Light.alfredappearance',
  {
    ...lightPalette,
    ...lightUiPalette,
    ...lightCodePalette,
  },
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[THEME] Preparing Bear themes… 🌕');

processTemplate(
  'themes/Bear/bear.template.theme',
  'themes/Bear/Squirrelsong Light.theme',
  {
    ...lightPalette,
    ...lightUiPalette,
    ...lightCodePalette,
  },
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[THEME] Preparing Chrome themes… 🌗');

const chromeLightManifest = 'themes/Chrome/extension-light/manifest.json';
const chromeLight = JSON.parse(fs.readFileSync(chromeLightManifest));
processTemplate(
  'themes/Chrome/chrome-light.template.json',
  chromeLightManifest,
  {
    version: chromeLight.version,
    ...lightRgbPalette,
    ...lightUiRgbPalette,
  },
);

const chromeDarkManifest = 'themes/Chrome/extension-dark/manifest.json';
const chromeDark = JSON.parse(fs.readFileSync(chromeDarkManifest));
processTemplate('themes/Chrome/chrome-dark.template.json', chromeDarkManifest, {
  version: chromeDark.version,
  ...darkRgbPalette,
  ...darkUiRgbPalette,
});

// ------------ 8< -- 8< ------------

console.log();
console.log('[THEME] Preparing CotEditor themes… 🌕');

processTemplate(
  'themes/CotEditor/coteditor.template.cottheme',
  'themes/CotEditor/Squirrelsong Light.cottheme',
  {
    ...lightCodePalette,
    ...lightUiPalette,
  },
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[THEME] Preparing Fastmail themes… 🌗');

applyReadmeTemplate('themes/Fastmail/Readme.md', 'theme', {
  'light:uiBackground': lightUiPalette.uiBackground,
  'light:boldAccent': lightUiPalette.boldAccent,
  'darkDp:uiBackground': darkDpUiPalette.uiBackground,
  'darkDp:boldAccent': darkDpUiPalette.boldAccent,
});

// ------------ 8< -- 8< ------------

console.log();
console.log('[THEME] Preparing Firefox themes… 🌕');

const firefoxLightManifest = 'themes/Firefox/extension/manifest.json';
const firefoxLight = JSON.parse(fs.readFileSync(firefoxLightManifest));
processTemplate('themes/Firefox/firefox.template.json', firefoxLightManifest, {
  version: firefoxLight.version,
  ...lightRgbPalette,
  ...lightUiRgbPalette,
});

// ------------ 8< -- 8< ------------

console.log();
console.log('[THEME] Preparing fzf themes… 🌚');

applyReadmeTemplate('themes/Fzf/Readme.md', 'dark', {
  ...darkPalette,
  ...darkAnsiPalette,
  ...darkUiPalette,
});

applyReadmeTemplate('themes/Fzf/Readme.md', 'dark-dp', {
  ...darkPalette,
  ...darkDpAnsiPalette,
  ...darkDpUiPalette,
});

// ------------ 8< -- 8< ------------

console.log();
console.log('[THEME] Preparing Ghostty themes… 🌚');

processTemplate(
  'themes/Ghostty/ghostty.template.ini',
  'themes/Ghostty/Squirrelsong Dark',
  {
    name: 'Dark',
    ...darkAnsiPalette,
    ...darkUiPalette,
    iconForeground: darkPalette.purple070,
    iconBackground: darkPalette.gray140,
  },
);

processTemplate(
  'themes/Ghostty/ghostty.template.ini',
  'themes/Ghostty/Squirrelsong Dark Deep Purple',
  {
    name: 'Dark Deep Purple',
    ...darkDpAnsiPalette,
    ...darkDpUiPalette,
    iconForeground: darkPalette.purple070,
    iconBackground: darkPalette.purple140,
  },
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[THEME] Preparing iTerm themes… 🌚');

const iTermDarkPalette = {};
for (const [colorName, hexColor] of Object.entries(darkAnsiPalette)) {
  const [r, g, b] = hexToRgb(hexColor);
  iTermDarkPalette[`${colorName}R`] = r / 255;
  iTermDarkPalette[`${colorName}G`] = g / 255;
  iTermDarkPalette[`${colorName}B`] = b / 255;
}
for (const [colorName, hexColor] of Object.entries(darkUiPalette)) {
  const [r, g, b] = hexToRgb(hexColor);
  iTermDarkPalette[`${colorName}R`] = r / 255;
  iTermDarkPalette[`${colorName}G`] = g / 255;
  iTermDarkPalette[`${colorName}B`] = b / 255;
}

processTemplate(
  'themes/iTerm2/iterm.template.itermcolors',
  'themes/iTerm2/Squirrelsong Dark.itermcolors',
  {
    ...iTermDarkPalette,
  },
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[THEME] Preparing Nimble Commander themes… 🌕');

processTemplate(
  'themes/Nimble Commander/nimble-commander.template.json',
  'themes/Nimble Commander/Squirrelsong Light.json',
  {
    ...lightPalette,
    ...lightAnsiPalette,
    ...lightCodePalette,
    ...lightUiPalette,
  },
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[THEME] Preparing Sublime Text themes… 🌗');

processTemplate(
  'themes/Sublime Text/textmate.template.tmTheme',
  'themes/Sublime Text/Squirrelsong Light/Squirrelsong Light.tmTheme',
  {
    name: 'Light',
    semanticClass: 'theme.light.squirrelsong_light',
    uuid: '506f39ff-75a5-45af-ba44-452c5244fdb4',
    ...lightCodePalette,
    ...lightCodeStyles,
    ...lightUiPalette,
  },
);

processTemplate(
  'themes/Sublime Text/textmate.template.tmTheme',
  'themes/Sublime Text/Squirrelsong Dark/Squirrelsong Dark.tmTheme',
  {
    name: 'Dark',
    semanticClass: 'theme.dark.squirrelsong_dark',
    uuid: '59024f0e-5ea0-4d89-96a7-98147144a79f',
    ...darkCodePalette,
    ...darkCodeStyles,
    ...darkUiPalette,
  },
);

processTemplate(
  'themes/Sublime Text/textmate.template.tmTheme',
  'themes/Sublime Text/Squirrelsong Dark Deep Purple/Squirrelsong Dark Deep Purple.tmTheme',
  {
    name: 'Dark Deep Purple',
    semanticClass: 'theme.dark.squirrelsong_dark_dp',
    uuid: 'b5348c12-370a-4291-a2c6-7aee60eb66e9',
    ...darkDpCodePalette,
    ...darkCodeStyles,
    ...darkDpUiPalette,
  },
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[THEME] Preparing VSCode themes… 🌗');

const lightCodeBase = {
  ...lightPalette,
  ...lightCodePalette,
  ...lightCodeStyles,
  ...lightUiPalette,
};
const darkCodeBase = {
  ...darkPalette,
  ...darkCodePalette,
  ...darkCodeStyles,
  ...darkUiPalette,
};
const darkDpCodeBase = {
  ...darkDpPalette,
  ...darkDpCodePalette,
  ...darkCodeStyles,
  ...darkDpUiPalette,
};
const lightCodeTerminal = {
  ...lightAnsiPalette,
  terminalBorder: lightUiPalette.border,
  terminalMatchBackground: lightUiPalette.matchBackground,
  terminalMatchBase: lightUiPalette.matchBase,
  terminalSelectionBase: lightUiPalette.selectionBase,
};
const darkCodeTerminal = {
  ...darkAnsiPalette,
  terminalBorder: darkUiPalette.border,
  terminalMatchBackground: darkUiPalette.matchBackground,
  terminalMatchBase: darkUiPalette.matchBase,
  terminalSelectionBase: darkUiPalette.selectionBase,
};
const darkDpCodeTerminal = {
  ...darkDpAnsiPalette,
  terminalBorder: darkDpUiPalette.border,
  terminalMatchBackground: darkDpUiPalette.matchBackground,
  terminalMatchBase: darkDpUiPalette.matchBase,
  terminalSelectionBase: darkDpUiPalette.selectionBase,
};

processTemplate(
  'themes/VSCode/vscode.template.json',
  'themes/VSCode/SquirrelsongLight/SquirrelsongLight.color-theme.json',
  {
    name: 'Light',
    mode: 'light',
    ...lightCodeBase,
    ...lightCodeTerminal,
  },
);
processTemplate(
  'themes/VSCode/vscode.template.json',
  'themes/VSCode/SquirrelsongLight/SquirrelsongLightDarkTerminal.color-theme.json',
  {
    name: 'Light (Dark Terminal)',
    mode: 'light',
    ...lightCodeBase,
    ...darkCodeTerminal,
  },
);
processTemplate(
  'themes/VSCode/vscode.template.json',
  'themes/VSCode/SquirrelsongLight/SquirrelsongLightDarkDeepPurpleTerminal.color-theme.json',
  {
    name: 'Light (Dark Deep Purple Terminal)',
    mode: 'light',
    ...lightCodeBase,
    ...darkDpCodeTerminal,
  },
);
processTemplate(
  'themes/VSCode/vscode.template.json',
  'themes/VSCode/SquirrelsongDark/SquirrelsongDark.color-theme.json',
  {
    name: 'Dark',
    mode: 'dark',
    ...darkCodeBase,
    ...darkCodeTerminal,
  },
);
processTemplate(
  'themes/VSCode/vscode.template.json',
  'themes/VSCode/SquirrelsongDark/SquirrelsongDarkDeepPurple.color-theme.json',
  {
    name: 'Dark Deep Purple',
    mode: 'dark',
    ...darkDpCodeBase,
    ...darkDpCodeTerminal,
  },
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[THEME] Preparing Warp themes… 🌚');

processTemplate(
  'themes/Warp/warp.template.yaml',
  'themes/Warp/squirrelsong_dark.yaml',
  {
    name: 'Dark',
    ...darkPalette,
    ...darkAnsiPalette,
  },
);

// ------------ 8< -- 8< ------------

console.log();
console.log('[THEME] Preparing WezTerm themes… 🌚');

processTemplate(
  'themes/WezTerm/wezterm.template.toml',
  'themes/WezTerm/squirrelsong-dark.toml',
  {
    name: 'Dark',
    ...darkAnsiPalette,
    ...darkUiPalette,
  },
);
