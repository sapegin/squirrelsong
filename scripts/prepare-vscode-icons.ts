/**
 * Build the Squirrelppuccin Icons Light VS Code extension by fetching the
 * upstream Catppuccin VS Code Icons project, copying its file mapping as is,
 * and recoloring its SVGs with the Squirrelsong Light palette.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { unzipArchive } from './util/zip.ts';

// Catppuccin Latte hex → Squirrelsong Light hex.
// Covers every color that appears in the upstream `icons/latte/*.svg` files.
const PALETTE: Record<string, string> = {
  '#04a5e5': '#80a4be', // sky      → blue
  '#179299': '#5f9b8d', // teal     → teal
  '#1e66f5': '#80a4be', // blue     → blue
  '#209fb5': '#5f9b8d', // sapphire → teal
  '#3700ff': '#4b7b97', // (one-off) → blueContrast
  '#40a02b': '#9bae7e', // green    → green
  '#4c4f69': '#78737d', // text     → gray090
  '#7287fd': '#ac9bc5', // lavender → magenta
  '#8839ef': '#806f9b', // mauve    → magentaContrast
  '#8c8fa1': '#a8a1af', // overlay1 → gray120
  '#d20f39': '#c06159', // red      → redContrast
  '#dc8a78': '#d67e76', // rosewater → red
  '#dd7878': '#d67e76', // flamingo → red
  '#df8e1d': '#de9e59', // yellow   → orange
  '#e64553': '#c06159', // maroon   → redContrast
  '#ea76cb': '#db7097', // pink     → brightPink
  '#fe640b': '#e4c158', // peach    → yellow
  '#fff': '#fff', // white
};

const KNOWN_COLORS = new Set([
  ...Object.keys(PALETTE),
  ...Object.values(PALETTE),
]);

const UPSTREAM_BASE = `https://codeload.github.com/catppuccin/vscode-icons`;
const UPSTREAM_ZIP = `${UPSTREAM_BASE}/zip/refs/heads/main`;
const EXTENSION_DIR = path.resolve('themes/VSCode/SquirrelppuccinIconsLight');
const ICONS_OUT_DIR = path.join(EXTENSION_DIR, 'icons');
const PACKAGE_JSON = path.join(EXTENSION_DIR, 'package.json');
const THEME_JSON_OUT = path.join(
  EXTENSION_DIR,
  'squirrelppuccin-icons-light.icon-theme.json'
);

interface IconMappings {
  languageIds: Record<string, string>;
  fileExtensions: Record<string, string>;
  fileNames: Record<string, string>;
}

function readVersion(packageFile: string): string {
  return JSON.parse(fs.readFileSync(packageFile, 'utf8')).version as string;
}

function updateLocalVersion(version: string): void {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8')) as {
    version: string;
  };
  pkg.version = version;
  fs.writeFileSync(PACKAGE_JSON, `${JSON.stringify(pkg, null, 2)}\n`);
}

async function downloadUpstream(): Promise<Buffer> {
  console.log(`[ICONS] Downloading catppuccin/vscode-icons@main…`);

  const response = await fetch(UPSTREAM_ZIP, { redirect: 'follow' });
  if (response.ok) {
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer;
  }

  throw new Error(`Could not download catppuccin/vscode-icons at ref "main"`);
}

function extract(buffer: Buffer): string {
  const tempRoot = fs.mkdtempSync(
    path.join(os.tmpdir(), 'squirrelppuccin-icons-')
  );
  const zipPath = path.join(tempRoot, 'upstream.zip');
  fs.writeFileSync(zipPath, buffer);
  unzipArchive(zipPath, tempRoot);

  const rootEntry = fs
    .readdirSync(tempRoot)
    .find((entry) => entry !== 'upstream.zip');
  if (!rootEntry) {
    throw new Error('Upstream zip appears empty');
  }
  return path.join(tempRoot, rootEntry);
}

async function loadMappings(upstreamRoot: string): Promise<IconMappings> {
  const { languageIds, fileExtensions, fileNames } = (await import(
    pathToFileURL(path.join(upstreamRoot, 'src/defaults/fileIcons.ts')).href
  )) as IconMappings;

  return { languageIds, fileExtensions, fileNames };
}

function recolorSvg(svg: string, unknownColors: Set<string>): string {
  return svg.replaceAll(/#[0-9a-fA-F]{3,8}/g, (match) => {
    const color = match.toLowerCase();
    if (!KNOWN_COLORS.has(color)) {
      unknownColors.add(color);
    }
    return PALETTE[color] ?? match;
  });
}

function copyAndRecolorIcons(upstreamRoot: string): string[] {
  const sourceDir = path.join(upstreamRoot, 'icons/latte');
  fs.rmSync(ICONS_OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(ICONS_OUT_DIR, { recursive: true });

  // Skip content-specific folder icons (folder_src.svg, folder_node.svg, …);
  // keep only the base folder icons (_folder.svg, _folder_open.svg, _root.svg,
  // _root_open.svg) alongside all regular file icons.
  const svgFiles = fs
    .readdirSync(sourceDir)
    .filter(
      (name) => name.endsWith('.svg') && name.startsWith('folder_') === false
    );

  const unknownColors = new Set<string>();
  const iconNames: string[] = [];

  for (const fileName of svgFiles) {
    const svg = fs.readFileSync(path.join(sourceDir, fileName), 'utf8');
    const next = recolorSvg(svg, unknownColors);
    fs.writeFileSync(path.join(ICONS_OUT_DIR, fileName), next);
    iconNames.push(path.basename(fileName, '.svg'));
  }

  if (unknownColors.size > 0) {
    console.warn(
      `[ICONS] ⚠️ Unmapped colors found in upstream SVGs (left as-is):`
    );
    for (const color of unknownColors) {
      console.warn(`        ${color}`);
    }
  }

  console.log(`[ICONS] Recolored ${svgFiles.length} SVGs`);
  return iconNames;
}

function buildIconDefinitions(iconNames: string[]) {
  return Object.fromEntries(
    iconNames
      .toSorted()
      .map((name) => [name, { iconPath: `./icons/${name}.svg` }])
  );
}

function writeThemeManifest(mappings: IconMappings, iconNames: string[]): void {
  const manifest = {
    hidesExplorerArrows: false,
    file: '_file',
    folder: '_folder',
    folderExpanded: '_folder_open',
    rootFolder: '_root',
    rootFolderExpanded: '_root_open',
    iconDefinitions: buildIconDefinitions(iconNames),
    languageIds: mappings.languageIds,
    fileExtensions: mappings.fileExtensions,
    fileNames: mappings.fileNames,
  };

  fs.writeFileSync(THEME_JSON_OUT, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`[ICONS] Wrote ${path.relative(process.cwd(), THEME_JSON_OUT)}`);
}

console.log();
console.log('[ICONS] Building Squirrelppuccin Icons Light…');

const buffer = await downloadUpstream();
const upstreamRoot = extract(buffer);
try {
  const upstreamVersion = readVersion(path.join(upstreamRoot, 'package.json'));
  const localVersion = readVersion(PACKAGE_JSON);
  if (upstreamVersion === localVersion) {
    console.log(
      `[ICONS] Already at upstream version ${localVersion}, skipping`
    );
    process.exit(0);
  }

  console.log(`[ICONS] Updating ${localVersion} → ${upstreamVersion}`);
  const mappings = await loadMappings(upstreamRoot);
  const iconNames = copyAndRecolorIcons(upstreamRoot);
  writeThemeManifest(mappings, iconNames);
  updateLocalVersion(upstreamVersion);
} finally {
  // Clean up temp directory
  fs.rmSync(path.dirname(upstreamRoot), { recursive: true, force: true });
}

console.log('[ICONS] Done 🦜');
