#!/usr/bin/env node

/**
 * Lint themes to ensure they only use colors from the palette.
 *
 * Additionally, lints ~/dotfiles folder if present, as I use many colors in my
 * setup.
 */

import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import _ from 'lodash';
import { glob } from 'glob';
import stripJsonComments from 'strip-json-comments';
import terminalLink from 'terminal-link';
import rgbHex from 'rgb-hex';

// TODO: Terminal.app
// TODO: Vivaldi (inside .zip file)

let errorCount = 0;
let fileCount = 0;

const DOTFILES_ROOT = path.join(os.homedir(), 'dotfiles');

const EXTENSIONS = [
  'alfredappearance',
  'cottheme',
  'css',
  'ettyTheme',
  'itermcolors',
  'json',
  'lua',
  'palette',
  'theme',
  'tmTheme',
  'toml',
  'vim',
  'yml',
  'yaml',
  // Extra extensions that appear in dotfiles
  'ackrc',
  'cjs',
  'gitconfig',
  'js',
  'mjs',
  'ripgreprc',
  'sh',
  'toml',
  'ts',
  'zsh',
  'zshrc',
  // TODO: Not supported yet
  // 'terminal',
].join(',');

const EXTRA_FILES = [
  'themes/Ghostty/Squirrelsong Dark',
  'themes/Ghostty/Squirrelsong Dark Deep Purple',
];

const IGNORES = [
  'package.json',
  'package-lock.json',
  'Brewfile.lock.json',
  // Mixed light/dark files
  'SquirrelsongLightDarkTerminal.color-theme.json',
  'SquirrelsongLightDarkDeepPurpleTerminal.color-theme.json',
];

const TRANSPARENT = [
  // Transparent colors
  '#ffffff00',
  '#ffffffff',
  '#00000000',
  '#000000ff',
];

const EXCEPTIONS = {
  'themes/Bartender/Readme.md': ['#e3e3e3', '#f4effc'],
  'themes/Ice/Readme.md': ['#e3e3e3', '#f4effc'],
  'themes/JetBrains/squirrelsong-light/resources/theme/Squirrelsong Light.theme.json':
    [
      '#1d1d1f',
      '#272629',
      '#373538',
      '#49474a',
      '#5b595e',
      '#78737d',
      '#87868a',
      '#a2a1a6',
      '#9c96a2',
      '#d2cfd4',
      '#dbd7e0',
      '#e8e5eb',
      '#f7f6f9',
      '#fdfdfe',
      '#61778c',
      '#678499',
      '#6f90a6',
      '#789ab3',
      '#80a4be',
      '#8db2cc',
      '#9ec0d9',
      '#b7d3e8',
      '#c9ddec',
      '#d7e8f5',
      '#e2edf5',
      '#e9f1f7',
      '#f3f9fc',
      '#77805d',
      '#838c66',
      '#8f9970',
      '#9ba679',
      '#9bae7e',
      '#b5bf8a',
      '#becc99',
      '#ced9a3',
      '#d6e6ac',
      '#e4f2d5',
      '#f2fae1',
      '#b6932c',
      '#c49f37',
      '#cba63b',
      '#d9b754',
      '#e6c565',
      '#fcdfa5',
      '#ffebbf',
      '#faebcc',
      '#fff8e9',
      '#fdfbf5',
      '#99453d',
      '#a64b42',
      '#b35047',
      '#bf564c',
      '#d67e76',
      '#d9756c',
      '#e6938a',
      '#f2b4aa',
      '#ebbfbc',
      '#f7d5d2',
      '#f5e5e4',
      '#fcf6f5',
      '#a67642',
      '#b37f47',
      '#bf884c',
      '#cc9152',
      '#de9e59',
      '#d9ab79',
      '#edcda8',
      '#f2dec9',
      '#fcf1e6',
      '#3c665c',
      '#457367',
      '#4f8076',
      '#538c7f',
      '#5f9b8d',
      '#6ca899',
      '#81b6a9',
      '#a9d5cb',
      '#ceece5',
      '#877a99',
      '#9085a6',
      '#9d8fb3',
      '#a899bf',
      '#ac9bc5',
      '#bfadd9',
      '#d1c3e7',
      '#dfd2f3',
      '#e7def5',
      '#ede7f6',
    ],
  'themes/Slack/Readme.md': [
    // Slack system navigation: existing colors look too intense (this color
    // isn't used as is by Slack but is "adjusted" and other colors are made
    // based on this color)
    '#d2ccdb',
  ],
  'dotfiles/firefox/chrome/userContent.css': [
    // Custom sepia theme colors
    '#f6f2ef',
    '#ebe4dc',
    '#b0a59d',
  ],
  'dotfiles/bin/sync-vscode-icons': [
    // Original Catppuccin colors that are replaced with Squirrelsong palette
    '#179299',
    '#04a5e5',
    '#1e66f5',
    '#209fb5',
    '#3700ff',
    '#40a02b',
    '#4c4f69',
    '#7287fd',
    '#8839ef',
    '#8c8fa1',
    '#d20f39',
    '#dc8a78',
    '#dd7878',
    '#df8e1d',
    '#e64553',
    '#ea76cb',
    '#fe640b',
    '#fff',
  ],
};

const CUSTOM_LINTERS = [
  {
    // Chrome extension
    condition: (file) => file.endsWith('manifest.json'),
    lintFunction: (file, validColors, exceptions) => {
      const json = readJsonFile(file);
      const theme = json?.theme?.colors;
      if (theme === undefined) {
        return;
      }

      const colors = Object.values(theme);

      for (const value of colors) {
        // Each value is either [R, G, B] or `rgb(R, G, B)`
        const color = Array.isArray(value) ? value : cssRgbToValues(value);
        const [r, g, b] = color;
        const hex = `#${rgbHex(r, g, b)}`;
        if (isValidHexColor(hex, validColors, exceptions) === false) {
          achtung(`${hex} (${r}, ${g}, ${b})`);
        }
      }

      done(colors.length);
    },
  },
  {
    // iTerm
    condition: (file) => file.endsWith('.itermcolors'),
    lintFunction: (file, validColors, exceptions) => {
      const text = fs.readFileSync(file, 'utf8');

      const matches = text.match(/<real>[^<]*<\/real>/gi);
      const numbers = matches.map((x) =>
        Number(x.replaceAll(/<\/?real>/gi, '')),
      );
      const colors = _.chunk(numbers, 4);

      for (const [a, b, g, r] of colors) {
        const color = `#${rgbHex(r * 255, g * 255, b * 255, a)}`;
        if (isValidHexColor(color, validColors, exceptions) === false) {
          achtung(`${color} (${r}, ${g}, ${b}, ${a})`);
        }
      }

      done(colors.length);
    },
  },
  /*
  {
    // Terminal
    condition: (file) => file.endsWith('.terminal'),
    lintFunction: (file, validColors, exceptions) => {
      const text = fs.readFileSync(file, 'utf8');

      const matches = text.match(/<data>[^<]*<\/data>/gim);
      const base64s = matches.map((x) =>
        x
          .replaceAll(/<\/?data>/gi, '')
          .replaceAll('\n', '')
          .trim(),
      );
      const values = base64s.map((x) => Buffer.from(x, 'base64').toString());

      // TODO: There are colors somewhere but it needs more work
    },
  },
  */
];

function achtung(value) {
  console.error(`🦀 Invalid color:`, value);
  errorCount++;
}

function done(numberOfColors) {
  console.log(`   ${numberOfColors} colors found`);
  fileCount++;
}

function readJsonFile(file) {
  return JSON.parse(stripJsonComments(fs.readFileSync(file, 'utf8')));
}

/**
 * Extracts numeric RGB(A) values from a CSS rgb() or rgba() string.
 *
 * rgb(255, 0, 0) → [255, 0, 0]
 * rgba(255, 0, 0, 0.5) → [255, 0, 0, 0.5]
 */
function cssRgbToValues(input) {
  return input
    .replace(/rgba?\(([^)]+)\)/, '$1')
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map((x) => Number.parseFloat(x));
}

function isHexColor(value) {
  if (typeof value !== 'string') {
    return false;
  }
  return (
    /^#[\da-f]+$/i.test(value) &&
    // #fff, #ff00ff, #ff00ff88
    (value.length === 4 || value.length === 7 || value.length === 9)
  );
}

function isValidHexColor(value, validColors, exceptions) {
  const color = value.toLowerCase();

  if (TRANSPARENT.includes(color)) {
    return true;
  }
  if (exceptions.includes(color)) {
    return true;
  }
  if (validColors.includes(color)) {
    return true;
  }

  // Validate colors with alpha channel as regular HEX: #c0ffeeff -> #c0ffee
  if (color.length === 9) {
    return isValidHexColor(color.slice(0, 7), validColors, exceptions);
  }

  return false;
}

/** Get a custom linter if available based on file name */
function getCustomLinter(file) {
  for (const { condition, lintFunction } of CUSTOM_LINTERS) {
    if (condition(file)) {
      return lintFunction;
    }
  }
}

/**
 * Get the appropriate palette based on file name. All available colors as a
 * fallback.
 */
function getPalette(filename, lightColors, darkColors) {
  const lowerCaseFilename = filename.toLowerCase();

  if (lowerCaseFilename.includes('light')) {
    return lightColors;
  }
  if (lowerCaseFilename.includes('dark')) {
    return darkColors;
  }

  return [...lightColors, ...darkColors];
}

function scanObject(object, callback) {
  for (const value of Object.values(object)) {
    if (typeof value === 'object') {
      scanObject(value, callback);
    } else {
      callback(value);
    }
  }
}

function lintJson(file, validColors, exceptions) {
  let theme;
  try {
    theme = readJsonFile(file);
  } catch {
    lintText(file, validColors, exceptions);
    return;
  }

  let numberOfColors = 0;

  scanObject(theme, (value) => {
    if (isHexColor(value)) {
      numberOfColors++;
      const color = value.toLowerCase();
      if (isValidHexColor(color, validColors, exceptions) === false) {
        achtung(value);
      }
    }
  });

  done(numberOfColors);
}

function lintText(file, validColors, exceptions) {
  const text = fs.readFileSync(file, 'utf8');

  let numberOfColors = 0;

  // Lint HEX colors
  const hexMatches = text.matchAll(/#[\da-f]{3,8}\b/gi);
  for (const [color] of hexMatches) {
    numberOfColors++;
    if (isValidHexColor(color, validColors, exceptions) === false) {
      achtung(color);
    }
  }

  // Lint RGB colors: 255,0,255
  const rgbMatches = text.matchAll(/(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})/g);
  for (const value of rgbMatches) {
    numberOfColors++;
    const hex = `#${rgbHex(Number(value[1]), Number(value[2]), Number(value[3]))}`;
    if (isValidHexColor(hex, validColors, exceptions) === false) {
      achtung(`${hex} (${value[0]})`);
    }
  }

  done(numberOfColors);
}

function lint(files, lightColors, darkColors) {
  const themesSorted = files.toSorted((a, b) => a.localeCompare(b, 'en'));

  for (const file of themesSorted) {
    const filename = path.basename(file);
    const relativePath = file.replace(DOTFILES_ROOT, 'dotfiles');
    const absolutePath = file.startsWith('/')
      ? file
      : path.join(process.cwd(), file);

    if (
      IGNORES.includes(filename) ||
      file.includes('node_modules') ||
      file.includes('template')
    ) {
      continue;
    }

    console.log();
    console.log(
      '👉',
      terminalLink(relativePath, `vscode://file//${absolutePath}`),
    );

    const validColors = getPalette(filename, lightColors, darkColors);

    const exceptions = EXCEPTIONS[relativePath] ?? [];

    const lintFunction = getCustomLinter(file);
    if (lintFunction) {
      lintFunction(file, validColors, exceptions);
      continue;
    }

    const extension = path.extname(file);
    switch (extension) {
      case '.json':
      case '.theme':
      case '.alfredappearance': {
        lintJson(file, validColors, exceptions);
        break;
      }
      default: {
        lintText(file, validColors, exceptions);
      }
    }
  }
}

const lightPalette = readJsonFile('light/palette.json');
const darkPalette = readJsonFile('dark/palette.json');

console.log();
console.log();
console.log('[LINT] Linting themes... 🌗');

const themes = [
  ...glob.sync(`themes/**/*.{${EXTENSIONS}}`),
  ...glob.sync(`themes/*/Readme.md`),
  ...EXTRA_FILES,
];
lint(themes, Object.values(lightPalette), Object.values(darkPalette));

if (fs.existsSync(DOTFILES_ROOT)) {
  console.log();
  console.log('[LINT] Linting dotfiles... 🌗');

  const dotfiles = [
    ...glob.sync(`${DOTFILES_ROOT}/**/*.{${EXTENSIONS}}`),
    ...glob.sync(`${DOTFILES_ROOT}/**/.{${EXTENSIONS}}`),
    ...glob.sync(`${DOTFILES_ROOT}/bin/**/*`),
  ]

    .filter((file) => fs.statSync(file).isFile())
    .filter(
      (file) =>
        // VS Code and Cursor internal files
        file.includes('workspaceStorage/') === false &&
        file.includes('globalStorage/') === false &&
        file.includes('globalStorage/') === false &&
        file.includes('History/') === false &&
        // Cloned repositories
        file.includes('-master/') === false &&
        // Custom themes
        file.includes('dotfiles/brain/') === false,
    );

  lint(dotfiles, Object.values(lightPalette), Object.values(darkPalette));
}

console.log();
console.log();
console.log(`[LINT] ${errorCount} errors in ${fileCount} files found 🦜`);

process.exit(errorCount === 0 ? 0 : 1);
