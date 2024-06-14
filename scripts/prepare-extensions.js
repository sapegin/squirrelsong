/**
 * Build all browser extensions into ./dist folder
 */

import fs from 'fs';
import ADMZip from 'adm-zip';

console.log(`[BUILD] Building Chrome Light extension...`);

fs.mkdirSync('./dist', { recursive: true });

// Chrome Light
fs.mkdirSync('./dist/light-chrome', { recursive: true });
fs.copyFileSync(
  './light/Chrome/extension/manifest.json',
  './dist/light-chrome/manifest.json',
);
fs.cpSync('./light/Chrome/extension/images', './dist/light-chrome/images', {
  recursive: true,
});

const chromeLightDotZip = new ADMZip();
chromeLightDotZip.addLocalFolder('./dist/light-chrome');
chromeLightDotZip.writeZip(`./dist/light-chrome.zip`);

console.log(`[BUILD] Building Chrome Dark Deep Purple extension...`);

// Chrome Dark Deep Purple
fs.mkdirSync('./dist/dark-dp-chrome', { recursive: true });
fs.copyFileSync(
  './dark/Chrome/extension/manifest.json',
  './dist/dark-dp-chrome/manifest.json',
);
fs.cpSync('./dark/Chrome/extension/images', './dist/dark-dp-chrome/images', {
  recursive: true,
});

const chromeDarkDpDotZip = new ADMZip();
chromeDarkDpDotZip.addLocalFolder('./dist/dark-dp-chrome');
chromeDarkDpDotZip.writeZip(`./dist/dark-dp-chrome.zip`);

console.log(`[BUILD] Building Chrome DevTools Light extension...`);

// Chrome DevTools
fs.mkdirSync('./dist/light-chrome-devtools', { recursive: true });
fs.copyFileSync(
  './light/Chrome DevTools/extension/manifest.json',
  './dist/light-chrome-devtools/manifest.json',
);
fs.copyFileSync(
  './light/Chrome DevTools/extension/devtools.html',
  './dist/light-chrome-devtools/devtools.html',
);
fs.copyFileSync(
  './light/Chrome DevTools/extension/devtools.js',
  './dist/light-chrome-devtools/devtools.js',
);
fs.copyFileSync(
  './light/Chrome DevTools/extension/devtools.css',
  './dist/light-chrome-devtools/devtools.css',
);
fs.cpSync(
  './light/Chrome DevTools/extension/images',
  './dist/light-chrome-devtools/images',
  {
    recursive: true,
  },
);

const chromeDevtoolsDotZip = new ADMZip();
chromeDevtoolsDotZip.addLocalFolder('./dist/light-chrome-devtools');
chromeDevtoolsDotZip.writeZip(`./dist/light-chrome-devtools.zip`);

console.log('[BUILD] Done 🦜');
