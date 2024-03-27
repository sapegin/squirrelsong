import fs from 'fs';
import path from 'path';
import ADMZip from 'adm-zip';

console.log(`[BUILD] Building Chrome extension...`);

fs.mkdirSync('./dist', { recursive: true });

// Chrome
fs.mkdirSync('./dist/chrome', { recursive: true });
fs.copyFileSync(
  './light/Chrome/extension/manifest.json',
  './dist/chrome/manifest.json',
);
fs.cpSync('./light/Chrome/extension/images', './dist/chrome/images', {
  recursive: true,
});

const chromeDotZip = new ADMZip();
chromeDotZip.addLocalFolder('./dist/chrome');
chromeDotZip.writeZip(`./dist/chrome.zip`);

console.log(`[BUILD] Building Chrome DevTools extension...`);

// Chrome DevTools
fs.mkdirSync('./dist/chrome-devtools', { recursive: true });
fs.copyFileSync(
  './light/Chrome DevTools/extension/manifest.json',
  './dist/chrome-devtools/manifest.json',
);
fs.copyFileSync(
  './light/Chrome DevTools/extension/devtools.html',
  './dist/chrome-devtools/devtools.html',
);
fs.copyFileSync(
  './light/Chrome DevTools/extension/devtools.js',
  './dist/chrome-devtools/devtools.js',
);
fs.copyFileSync(
  './light/Chrome DevTools/extension/devtools.css',
  './dist/chrome-devtools/devtools.css',
);
fs.cpSync(
  './light/Chrome DevTools/extension/images',
  './dist/chrome-devtools/images',
  {
    recursive: true,
  },
);

const chromeDevtoolsDotZip = new ADMZip();
chromeDevtoolsDotZip.addLocalFolder('./dist/chrome-devtools');
chromeDevtoolsDotZip.writeZip(`./dist/chrome-devtools.zip`);

console.log('[BUILD] Done 🦜');
