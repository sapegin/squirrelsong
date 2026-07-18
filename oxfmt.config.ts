import { defineConfig } from 'oxfmt';
import oxfmt from 'oxlint-config-raccoon/oxfmt';

export default defineConfig({
  ...oxfmt,
  ignorePatterns: [
    'dist/**',
    'themes/Chrome/chrome.template.json',
    'themes/VSCode/*/*.color-theme.json',
    'themes/VSCode/*/*.icon-theme.json',
    'squirrelsong.html',
  ],
});
