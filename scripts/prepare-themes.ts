/**
 * Generate themes based on templates.
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  processTemplate,
  applyReadmeTemplate,
  renderTemplate,
  type TemplateContext,
} from './util/template.ts';
import { terminalLink } from './util/terminalLink.ts';
import {
  readJsonFile,
  readThemeSpecs,
  resolveThemeSpec,
  type SchemeName,
} from './util/theme.ts';

type MixinName = 'terminalLight' | 'terminalDark';

interface ThemeEntry {
  file: string;
  scheme?: string;
  mixin?: string;
  context?: Record<string, string>;
}

interface ThemeConfig {
  themes?: ThemeEntry[];
}

const { light, dark } = readThemeSpecs();
const lightTheme = resolveThemeSpec(light, 'light');
const darkTheme = resolveThemeSpec(dark, 'dark');

console.log();
console.log('[THEME] Preparing themes… 🌗');

const schemes: Record<SchemeName, TemplateContext> = {
  light: lightTheme.context,
  dark: darkTheme.context,
};

const mixins: Record<MixinName, TemplateContext> = {
  terminalLight: {
    ...lightTheme.ansi,
    terminalBorder: lightTheme.ui.border,
    terminalMatchBackground: lightTheme.ui.matchBackground,
    terminalMatchBase: lightTheme.ui.matchBase,
    terminalSelectionBase: lightTheme.ui.selectionBase,
  },
  terminalDark: {
    ...darkTheme.ansi,
    terminalBorder: darkTheme.ui.border,
    terminalMatchBackground: darkTheme.ui.matchBackground,
    terminalMatchBase: darkTheme.ui.matchBase,
    terminalSelectionBase: darkTheme.ui.selectionBase,
  },
};

const sharedScheme: TemplateContext = {};
for (const [key] of Object.entries(schemes.light)) {
  sharedScheme[`light:${key}`] = schemes.light[key];
  sharedScheme[`dark:${key}`] = schemes.dark[key];
}

function isSchemeName(value: string): value is SchemeName {
  return value in schemes;
}

function isMixinName(value: string): value is MixinName {
  return value in mixins;
}

const configs = fs.globSync('themes/**/config.json').toSorted();

for (const configFile of configs) {
  if (configFile.includes('node_modules')) {
    continue;
  }

  const folder = path.dirname(configFile);
  console.log(
    '👉',
    terminalLink(folder, `vscode://file//${path.resolve(configFile)}`)
  );
  const config = readJsonFile<ThemeConfig>(configFile);

  if (!config.themes) {
    console.error(`   🦀 The 'themes' array is missing`);
    continue;
  }

  // Find a template: any file that has `.template.` in its name
  const templateFiles = fs.globSync(path.join(folder, '*.template.*'));
  const templateFile = templateFiles.at(0);
  if (
    templateFile === undefined &&
    config.themes.some((x) => x.file !== 'Readme.md')
  ) {
    console.error(`   🦀 Template file not found`);
    continue;
  }

  for (const theme of config.themes) {
    console.log(`   ${theme.file}`);

    const scheme = theme.scheme;
    let schemeContext = sharedScheme;
    if (scheme !== undefined) {
      if (!isSchemeName(scheme)) {
        console.error(
          `   🦀 Scheme '${scheme}' not found, possible values: ${Object.keys(schemes).join(', ')}`
        );
        continue;
      }
      schemeContext = schemes[scheme];
    }

    const mixin = theme.mixin;
    let mixinContext: TemplateContext = {};
    if (mixin !== undefined) {
      if (!isMixinName(mixin)) {
        console.error(
          `   🦀 Mixin '${mixin}' not found, possible values: ${Object.keys(mixins).join(', ')}`
        );
        continue;
      }
      mixinContext = mixins[mixin];
    }

    // Prepare the context: base palette + mixin + custom values
    const context: TemplateContext = {
      ...schemeContext,
      ...mixinContext,
    };
    for (const [key, value] of Object.entries(theme.context ?? {})) {
      if (typeof value === 'string' && value.includes('{{')) {
        // Expand {{...}} placeholders against the current context
        context[key] = renderTemplate(value, context, configFile);
      } else {
        context[key] = context[value] ?? value;
      }
    }

    const destFile = path.join(folder, theme.file);

    if (theme.file === 'Readme.md') {
      applyReadmeTemplate(destFile, theme.scheme ?? 'theme', context);
      continue;
    }

    if (templateFile === undefined) {
      continue;
    }

    processTemplate(templateFile, destFile, context);
  }
}
