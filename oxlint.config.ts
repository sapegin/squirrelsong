import { defineConfig } from 'oxlint';
import typescript from 'oxlint-config-raccoon/typescript';

export default defineConfig({
  extends: [typescript],
  options: { typeAware: true, typeCheck: true },
  ignorePatterns: [
    'scripts/lib/cssColorNames.mjs',
    'themes/VSCode/*/*.color-theme.json',
    'themes/VSCode/*/*.icon-theme.json',
    'sample/**',
    'dist/**',
  ],
});
