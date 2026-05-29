/**
 * Build all browser extensions into ./dist folder
 */

import fs from 'node:fs';
import ADMZip from 'adm-zip';

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

const chromeLightDotZip = new ADMZip();
chromeLightDotZip.addLocalFolder('./dist/chrome-light');
chromeLightDotZip.writeZip(`./dist/chrome-light.zip`);

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

const chromeDarkDpDotZip = new ADMZip();
chromeDarkDpDotZip.addLocalFolder('./dist/chrome-dark-dp');
chromeDarkDpDotZip.writeZip(`./dist/chrome-dark-dp.zip`);

// ------------ 8< -- 8< ------------

console.log();
console.log(`[BUILD] Building Firefox Light extension… 🌕`);

// Firefox Light
fs.mkdirSync('./dist/firefox-light', { recursive: true });
fs.copyFileSync(
  './themes/Firefox/extension/manifest.json',
  './dist/firefox-light/manifest.json'
);

const firefoxLightDotZip = new ADMZip();
firefoxLightDotZip.addLocalFolder('./dist/firefox-light');
firefoxLightDotZip.writeZip(`./dist/firefox-light.zip`);

// ------------ 8< -- 8< ------------

console.log();
console.log(`[BUILD] Building Vivaldi theme… 🌕`);

const vivaldiLightDotZip = new ADMZip();
vivaldiLightDotZip.addLocalFolder('./themes/Vivaldi/theme-light');
vivaldiLightDotZip.writeZip(`./themes/Vivaldi/Squirrelsong Light.zip`);

console.log('[BUILD] Done 🦜');
