import { defineConfig } from 'oxfmt';
import oxfmt from 'oxlint-config-raccoon/oxfmt';

export default defineConfig({
  ...oxfmt,
  ignorePatterns: [
    'dist/**',
    'themes/Chrome/chrome.template.json',
    'themes/VSCode/SquirrelsongDark/SquirrelsongDark.color-theme.json',
    'themes/VSCode/SquirrelsongDark/SquirrelsongDarkDeepPurple.color-theme.json',
    'themes/VSCode/SquirrelsongLight/SquirrelsongLight.color-theme.json',
    'themes/VSCode/SquirrelsongLight/SquirrelsongLightDarkDeepPurpleTerminal.color-theme.json',
    'themes/VSCode/SquirrelsongLight/SquirrelsongLightDarkTerminal.color-theme.json',
  ],
});
