/**
 * Generate Markdown palette tables in Readme files from JSON files
 */

import fs from 'node:fs';
import { hexToRgb } from './util/hexToRgb.ts';
import { stripJsonComments } from './util/stripJsonComments.ts';

const SWATCH_SIZE = 20;

const stripSharp = (hex: string): string => hex.replace('#', '');

const swatch = (hex: string): string =>
  `<img src="http://www.thecolorapi.com/id?format=svg&named=false&hex=${stripSharp(
    hex
  )}" width="${SWATCH_SIZE}" height="${SWATCH_SIZE}" alt="">`;

function generateMarkdownTable(palette: Record<string, string>): string {
  const header = `| | Name | Hex | RGB |\n| --- | --- | --- | --- |`;

  const rows = Object.entries(palette).map(
    ([name, hex]) =>
      `| ${swatch(hex)} | ${name} | ${hex} | ${hexToRgb(hex).join(', ')} |`
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

console.log('[UPDATE] Updating Markdown files...');

console.log(`[UPDATE] 👉 light theme`);
const lightPalette = JSON.parse(
  stripJsonComments(fs.readFileSync('light/palette.json', 'utf8'))
) as Record<string, string>;
updateMarkdownFile('light/Readme.md', generateMarkdownTable(lightPalette));

console.log(`[UPDATE] 👉 dark theme`);
const darkPalette = JSON.parse(
  stripJsonComments(fs.readFileSync('dark/palette.json', 'utf8'))
) as Record<string, string>;
updateMarkdownFile('dark/Readme.md', generateMarkdownTable(darkPalette));

console.log('[UPDATE] Done 🦜');
