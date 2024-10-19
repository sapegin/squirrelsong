/**
 * Lint themes to ensure they only use colors from the palette
 */

import fs from 'node:fs';
import path from 'node:path';
import _ from 'lodash';
import { glob } from 'glob';
import stripJsonComments from 'strip-json-comments';
import terminalLink from 'terminal-link';
import rgbHex from 'rgb-hex';
import { cssColorNames } from './lib/cssColorNames.mjs';

// TODO: Terminal.app
// TODO: Vivaldi (inside .zip file)

let errorCount = 0;

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
  'yaml',
  // TODO: Not supported yet
  // 'terminal',
].join(',');

const EXTRA_LIGHT_FILES = [
  'themes/Ice/Readme.md',
  'themes/Bartender/Readme.md',
  'themes/macOS/Readme.md',
  'themes/Slack/Readme.md',
];
const EXTRA_DARK_FILES = ['themes/Slack/Readme.md'];

const IGNORES = [
  'package.json',
  'package-lock.json',
  'SquirrelsongLightDarkTerminal.color-theme.json',
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
  'themes/Slack/colors-light.json': [
    // Slack system navigation: existing colors look too intense (this color isn't
    // used as is by Slack but is "adjusted" and other colors are made based on
    // this color)
    '#d2ccdb',
  ],
  // Slack readme includes both themes
  'themes/Slack/Readme.md': [
    // Light
    '#d2ccdb',
    '#d7cfe3',
    '#527b98',
    '#ac9bc5',
    // Dark
    '#57427a',
    '#453461',
    '#41635f',
    '#ca5a83',
  ],
  'themes/WezTerm/squirrelsong-dark.toml': [
    '#080706',
    '#12100e',
    '#1c1916',
    '#26221f',
    '#302c27',
    '#3b352f',
    '#453e37',
    '#4f473f',
    '#595047',
    '#61574e',
    '#6b6056',
    '#756a5e',
    '#807366',
    '#8a7c6e',
    '#948576',
    '#9e8e7e',
    '#a89787',
    '#b3a18f',
    '#bdaa97',
    '#c7b39f',
    '#d1bca7',
    '#d9c3ad',
    '#e3ccb6',
    '#edd5be',
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

      for (const [r, g, b] of Object.values(theme)) {
        const color = `#${rgbHex(r, g, b)}`;
        if (isValidHexColor(color, validColors, exceptions) === false) {
          achtung(`${color} (${r}, ${g}, ${b})`);
        }
      }
    },
  },
  {
    // Slack
    condition: (file) => file.endsWith('colors.json'),
    lintFunction: (file, validColors, exceptions) => {
      const theme = readJsonFile(file);

      for (const color of theme) {
        if (isValidHexColor(color, validColors, exceptions) === false) {
          achtung(color);
        }
      }
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

function readJsonFile(file) {
  return JSON.parse(stripJsonComments(fs.readFileSync(file, 'utf8')));
}

function isCssNamedColor(value) {
  if (typeof value !== 'string') {
    return false;
  }
  return cssColorNames[value.toLowerCase()] !== undefined;
}

function isHexColor(value) {
  if (typeof value !== 'string') {
    return false;
  }
  return /^#[\da-f]{3,8}$/i.test(value);
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

  // console.log('🦜', theme);
  scanObject(theme, (value) => {
    if (isCssNamedColor(value)) {
      // TODO: Skip named colors for now, they are only used in JetBrains
      // achtung(value);
      return;
    }
    if (isHexColor(value)) {
      const color = value.toLowerCase();
      if (isValidHexColor(color, validColors, exceptions) === false) {
        achtung(value);
      }
    }
  });
}

function lintText(file, validColors, exceptions) {
  const text = fs.readFileSync(file, 'utf8');

  const matches = text.match(/#[\da-f]{3,8}\b/gi);

  for (const color of matches) {
    if (isValidHexColor(color, validColors, exceptions) === false) {
      achtung(color);
    }
  }
}

function lint(root, palette, extraFiles) {
  const validColors = Object.values(palette);
  const themes = [
    ...glob.sync(`${root}/*/**/*.{${EXTENSIONS}}`),
    ...extraFiles,
  ];
  const themesSorted = themes.toSorted((a, b) => a.localeCompare(b, 'en'));
  for (const file of themesSorted) {
    const filename = path.basename(file);
    if (IGNORES.includes(filename) || file.includes('node_modules')) {
      return;
    }
    const extension = path.extname(file);
    console.log();
    console.log(
      '👉',
      terminalLink(file, `vscode://file//${process.cwd()}/${file}`),
    );

    const exceptions = EXCEPTIONS[file] ?? [];

    for (const { condition, lintFunction } of CUSTOM_LINTERS) {
      if (condition(file)) {
        lintFunction(file, validColors, exceptions);
        return;
      }
    }

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

console.log();
console.log();
console.log('[LINT] Linting light themes... 🌞');
const lightPalette = readJsonFile('light/palette.json');
lint('light', lightPalette, EXTRA_LIGHT_FILES);

console.log();
console.log();
console.log('[LINT] Linting dark themes... 🌚');
const darkPalette = readJsonFile('dark/palette.json');
lint('dark', darkPalette, EXTRA_DARK_FILES);

console.log();
console.log();
console.log(`[LINT] ${errorCount} errors found 🦜`);

process.exit(errorCount === 0 ? 0 : 1);
