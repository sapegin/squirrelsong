Ecosystem context: read `~/dotfiles/ai/raccoonarium.md`.

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

## Commands

```sh
npm install                # install deps
npm run prepare-extensions # generate browser extensions
npm run prepare-themes     # generate theme files based on templates
npm test                   # lint code and colors
npm run format             # format code
```

## When adding a new theme

1. `mkdir themes/<app>`.
2. Create a template that uses semantic color tokens (example: `themes/Ghostty/ghostty.template.ini`).
3. Create `config.json` listing generated theme files (example: `themes/Ghostty/config.json`).
4. Create `Readme.md` with installation instructions.
5. Run `npm run prepare-themes` and commit the generated theme files.

Each entry in `config.json` can specify:

- `scheme`: `light` or `dark` — palette and UI/code tokens for that theme
- `mixin`: `terminalLight` or `terminalDark` — terminal ANSI colors (optional)
- `context`: extra template variables (optional)

For files that combine both schemes in one output (example: `themes/Git/delta.template.gitconfig`), omit `scheme` and use `{{light:token}}` / `{{dark:token}}` placeholders.

Edit `scripts/prepare-themes.ts` only when adding a new scheme or mixin type.

## Rules

- When working on CSS themes, refer to @themes/CSS/squirrelsong.css and @squirrelsong-ui.html for correct styles.
- All new themes should be made using templates.
- Don’t mention templates in individual theme Readmes.
