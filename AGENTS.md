Monorepo of UX/color themes for various apps. One folder per extension under `themes/<app>/`.

## Specs

Before making any color changes or creating new extensions, inspect specs:

- `light/*.json` for light theme
- `dark/*.json` for dark theme

Each has a set of JSON files with palettes and semantic tokens:

- `palette.json`: base palette
- `ansi.json`: colors for terminal emulators
- `code.json`: colors for code syntax highlighting
- `ui.json`: UI colors

Only use these colors for all themes. Occasional transparency is okay (`{{selectionBase}}33`).

Dark themes comes in two variants:

- `Dark` (uses `gray*` colors from `palette.json`)
- `Dark Deep Purple` (uses `purple*` colors from `palette.json`)

## Commands

```sh
npm install                # install deps
npm run prepare-extensions # generate browser extensions
npm prepare-themes         # generate theme files based on templates
npm test                   # lint code and colors
npm run format             # format code
```

## When adding a new theme

1. `mkdir themes/<app>`.
2. Create `Readme.md` with installation instructions
3. Create a generic template that is using semantic colors tokens (example: `themes/Ghostty/ghostty.template.ini`).
4. Update `scripts/prepare-themes.mjs` to generate each requested theme (`Light`, `Dark`, `Dark Deep Purple`)
