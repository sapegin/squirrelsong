/**
 * Generate Markdown palette tables in Readme files from JSON files
 */

import fs from 'node:fs';
import { hexToRgb } from './util/hexToRgb.mjs';
import { stripJsonComments } from './util/stripJsonComments.mjs';

const SWATCH_SIZE = 20;

const stripSharp = (hex) => hex.replace('#', '');

const swatch = (hex) =>
  `<img src="http://www.thecolorapi.com/id?format=svg&named=false&hex=${stripSharp(
    hex
  )}" width="${SWATCH_SIZE}" height="${SWATCH_SIZE}" alt="">`;

function generateMarkdownTable(palette) {
  const header = `| | Name | Hex | RGB |\n| --- | --- | --- | --- |`;

  const rows = Object.entries(palette).map(
    ([name, hex]) =>
      `| ${swatch(hex, name)} | ${name} | ${hex} | ${hexToRgb(hex).join(', ')} |`
  );

  return [header, ...rows].join('\n');
}

function updateMarkdownFile(filepath, paletteMd) {
  const markdown = fs.readFileSync(filepath, 'utf8');

  const markdownNext = markdown.replace(
    /<!-- palette:begin -->[\S\s]*?<!-- palette:end -->/m,
    `<!-- palette:begin -->\n\n${paletteMd}\n\n<!-- palette:end -->`
  );

  fs.writeFileSync(filepath, markdownNext);
}

console.log('[UPDATE] Updating Markdown files...');

console.log(`[UPDATE] 👉 light theme`);
const lightPalette = JSON.parse(
  stripJsonComments(fs.readFileSync('light/palette.json', 'utf8'))
);
updateMarkdownFile('light/Readme.md', generateMarkdownTable(lightPalette));

console.log(`[UPDATE] 👉 dark theme`);
const darkPalette = JSON.parse(
  stripJsonComments(fs.readFileSync('dark/palette.json', 'utf8'))
);
updateMarkdownFile('dark/Readme.md', generateMarkdownTable(darkPalette));

console.log('[UPDATE] Done 🦜');
