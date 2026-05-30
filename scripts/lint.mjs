#!/usr/bin/env node

/**
 * Lint themes to ensure they only use colors from the palette.
 *
 * Additionally, lints ~/dotfiles folder if present, as I use many colors in my
 * setup.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { hexToRgb } from './util/hexToRgb.mjs';
import { rgbToHex } from './util/rgbToHex.mjs';
import { stripJsonComments } from './util/stripJsonComments.mjs';
import { terminalLink } from './util/terminalLink.mjs';

let colorCount = 0;
let errorCount = 0;
let fileCount = 0;

const DOTFILES_ROOT = path.join(os.homedir(), 'dotfiles');

const EXTENSIONS = [
  'alfredappearance',
  'cottheme',
  'css',
  'ettyTheme',
  'ini',
  'itermcolors',
  'json',
  'lua',
  'palette',
  'terminal',
  'theme',
  'tmTheme',
  'toml',
  'vim',
  'yaml',
  'yml',
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
].join(',');

const EXTRA_FILES = [
  // Files without extension
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
  'dotfiles/firefox/chrome/userContent.css': [
    // Custom sepia theme colors
    '#f6f2ef',
    '#ebe4dc',
    '#b0a59d',
  ],
};

const CUSTOM_LINTERS = [
  {
    // iTerm
    //
    // XML themes where each color consists of four <real></real> tags with
    // float RGBA values the following order: ABGR.
    condition: (file) => file.endsWith('.itermcolors'),
    lintFunction: (file, validColors) => {
      const text = fs.readFileSync(file, 'utf8');

      const matches = text.match(/<real>[^<]*<\/real>/gi);
      const numbers = matches.map((x) =>
        Number(x.replaceAll(/<\/?real>/gi, ''))
      );

      // Group colors into chunks of 4: [[A, B, G, R], ...]
      const colors = [];
      for (let i = 0; i < numbers.length; i += 4) {
        colors.push(numbers.slice(i, i + 4));
      }

      for (const [a, bRaw, gRaw, rRaw] of colors) {
        const [r, g, b] = [rRaw * 255, gRaw * 255, bRaw * 255];
        if (isValidRgbColor(r, g, b, validColors) === false) {
          achtung(`${rgbToHex(r, g, b, a)} (${r}, ${g}, ${b}, ${a})`);
        }
      }

      done(colors.length);
    },
  },
  {
    // Terminal.app
    //
    // XML plist themes where colors are stored as base64-encoded
    // NSKeyedArchiver data. Each color is represented as RGB float values
    // (0.0-1.0) within the decoded data structure.
    condition: (file) => file.endsWith('.terminal'),
    lintFunction: (file, validColors) => {
      const text = fs.readFileSync(file, 'utf8');

      let numberOfColors = 0;

      // Parse base64 encoded NSKeyedArchiver plist data
      const matches = text.matchAll(/<data>\s*([^<]+)\s*<\/data>/gi);

      for (const match of matches) {
        const base64 = match[1].replaceAll(/\s+/g, '');
        const decoded = Buffer.from(base64, 'base64').toString('utf8');

        // Extract RGB values from the decoded plist:
        // - "0.2078431373 0.1647058824 0.1294117647"
        const rgbMatch = decoded.match(/(\d+\.\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)/);

        if (rgbMatch) {
          numberOfColors++;

          const [r, g, b] = [
            rgbMatch[1] * 255,
            rgbMatch[2] * 255,
            rgbMatch[3] * 255,
          ];
          if (isValidRgbColor(r, g, b, validColors) === false) {
            achtung(`${rgbToHex(r, g, b)} (${r}, ${g}, ${b})`);
          }
        }
      }

      done(numberOfColors);
    },
  },
  {
    // JetBrains
    //
    // JetBrains theme has a huge chunk of custom colors (Grey1, Blue1...) that
    // aren't from Squirrelsong, so we need to skip them.
    condition: (file) =>
      file.includes('JetBrains') && file.endsWith('.theme.json'),
    lintFunction: (file, validColors, exceptions) => {
      const theme = readJsonFile(file);

      let numberOfColors = 0;

      for (const [name, value] of Object.entries(theme.colors)) {
        if (name[0] === name[0].toUpperCase()) {
          // Skip custom palette: Grey1, Blue1...
          continue;
        }
        if (isHexColor(value)) {
          numberOfColors++;
          const color = value.toLowerCase();
          if (isValidHexColor(color, validColors, exceptions) === false) {
            achtung(value);
          }
        }
      }

      done(numberOfColors);
    },
  },
  {
    // Visual Studio Code icons script
    //
    // Matches all lines in the palette object ('#04a5e5': '#80a4be'), but
    // validate only the right color, as the left is the original color in the
    // Catppuccin theme.
    condition: (file) => file.endsWith('sync-vscode-icons'),
    lintFunction: (file, validColors, exceptions) => {
      const text = fs.readFileSync(file, 'utf8');

      const matches = text.matchAll(/'#[\da-f]{6}':\s*'(#[\da-f]{6})'/gi);

      let numberOfColors = 0;

      for (const value of matches) {
        if (isHexColor(value[1])) {
          numberOfColors++;
          const color = value[1].toLowerCase();
          if (isValidHexColor(color, validColors, exceptions) === false) {
            achtung(value);
          }
        }
      }

      done(numberOfColors);
    },
  },
];

function achtung(value) {
  console.error(`🦀 Invalid color:`, value);
  errorCount++;
}

function done(numberOfColors) {
  console.log(`   ${numberOfColors} colors found`);
  colorCount += numberOfColors;
  fileCount++;
}

function readJsonFile(file) {
  return JSON.parse(stripJsonComments(fs.readFileSync(file, 'utf8')));
}

function isHexColor(value) {
  if (typeof value !== 'string') {
    return false;
  }
  return (
    /^#[\da-f]+$/i.test(value) &&
    // #fff, #ff00ff, #ff00ff88
    [4, 7, 9].includes(value.length)
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

function isValidRgbColor(r, g, b, validColors) {
  for (const validHex of validColors) {
    const [validR, validG, validB] = hexToRgb(validHex);
    if (
      validR === Math.round(r) &&
      validG === Math.round(g) &&
      validB === Math.round(b)
    ) {
      return true;
    }
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
    const [r, g, b] = [Number(value[1]), Number(value[2]), Number(value[3])];
    if (isValidRgbColor(r, g, b, validColors) === false) {
      achtung(`${rgbToHex(r, g, b)} (${value[0]})`);
    }
  }

  done(numberOfColors);
}

function lint(files, lightColors, darkColors) {
  const themesSorted = files.toSorted((a, b) => a.localeCompare(b, 'en'));

  for (const file of themesSorted) {
    const filename = path.basename(file);
    const relativePath = file.replace(DOTFILES_ROOT, 'dotfiles');
    const absolutePath = file.startsWith('/') ? file : path.resolve(file);

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
      terminalLink(relativePath, `vscode://file//${absolutePath}`)
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
  ...fs.globSync(`themes/**/*.{${EXTENSIONS}}`),
  ...fs.globSync(`themes/*/Readme.md`),
  ...EXTRA_FILES,
];
lint(themes, Object.values(lightPalette), Object.values(darkPalette));

if (fs.existsSync(DOTFILES_ROOT)) {
  console.log();
  console.log('[LINT] Linting dotfiles... 🌗');

  const dotfiles = [
    ...fs.globSync(`${DOTFILES_ROOT}/**/*.{${EXTENSIONS}}`),
    ...fs.globSync(`${DOTFILES_ROOT}/tilde/.*`),
    ...fs.globSync(`${DOTFILES_ROOT}/bin/**/*`),
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
        file.includes('dotfiles/brain/') === false
    );

  lint(dotfiles, Object.values(lightPalette), Object.values(darkPalette));
}

console.log();
console.log();
console.log(
  `[LINT] ${errorCount} errors found, ${colorCount} colors in ${fileCount} files checked 🦜`
);

process.exit(errorCount === 0 ? 0 : 1);
