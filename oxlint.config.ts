import { defineConfig } from 'oxlint';
import base from 'oxlint-config-raccoon/base';

export default defineConfig({
  extends: [base],
  options: {},
  ignorePatterns: ['scripts/lib/cssColorNames.mjs', 'sample/**', 'dist/**'],
});
