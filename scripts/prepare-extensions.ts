/**
 * Build all browser extensions into ./dist folder
 */

import fs from 'node:fs';
import { zipDirectory } from './util/zip.ts';

// ------------ 8< -- 8< ------------

console.log();
console.log(`[BUILD] Building Chrome Light extension… 🌕`);

// Chrome Light
fs.mkdirSync('./dist/chrome-light', { recursive: true });
fs.copyFileSync(
  './themes/Chrome/extension-light/manifest.json',
  './dist/chrome-light/manifest.json'
);
fs.cpSync(
  './themes/Chrome/extension-light/images',
  './dist/chrome-light/images',
  {
    recursive: true,
  }
);

zipDirectory('./dist/chrome-light', './dist/chrome-light.zip');

// ------------ 8< -- 8< ------------

console.log();
console.log(`[BUILD] Building Chrome Dark Deep Purple extension… 🌑`);

// Chrome Dark Deep Purple
fs.mkdirSync('./dist/chrome-dark-dp', { recursive: true });
fs.copyFileSync(
  './themes/Chrome/extension-dark/manifest.json',
  './dist/chrome-dark-dp/manifest.json'
);
fs.cpSync(
  './themes/Chrome/extension-dark/images',
  './dist/chrome-dark-dp/images',
  {
    recursive: true,
  }
);

zipDirectory('./dist/chrome-dark-dp', './dist/chrome-dark-dp.zip');

// ------------ 8< -- 8< ------------

console.log();
console.log(`[BUILD] Building Firefox Light extension… 🌕`);

// Firefox Light
fs.mkdirSync('./dist/firefox-light', { recursive: true });
fs.copyFileSync(
  './themes/Firefox/extension/manifest.json',
  './dist/firefox-light/manifest.json'
);

zipDirectory('./dist/firefox-light', './dist/firefox-light.zip');

// ------------ 8< -- 8< ------------

console.log();
console.log(`[BUILD] Building Vivaldi theme… 🌕`);

zipDirectory(
  './themes/Vivaldi/theme-light',
  './themes/Vivaldi/Squirrelsong Light.zip'
);

console.log('[BUILD] Done 🦜');
