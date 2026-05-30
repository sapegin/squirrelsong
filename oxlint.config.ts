import { defineConfig } from 'oxlint';
import base from 'oxlint-config-raccoon/base';

export default defineConfig({
  extends: [base],
  options: {},
  ignorePatterns: [
    'scripts/lib/cssColorNames.mjs',
    'themes/VSCode/*/*.color-theme.json',
    'themes/VSCode/*/*.icon-theme.json',
    'sample/**',
    'dist/**',
  ],
});
