Ecosystem context: read `~/dotfiles/ai/raccoonarium.md`.

Monorepo of UX/color themes for various apps. One folder per extension under `themes/<app>/`.

## Specs

Before making any color changes or creating new extensions, inspect specs:

- `light/*.json` for light theme
- `dark/*.json` for dark theme

Each has a set of JSON files with palettes and semantic tokens:

- `palette.json`: base palette
- `theme.json`: UI, code (`code*` keys), and terminal (`terminal*` keys) colors

Only use these colors for all themes. Occasional transparency is okay (`{{selectionBase}}33`).

Palette roles:

- Base colors (`green`, `blue`, …): code highlighting (`code*` keys) and syntax-adjacent UI.
- `*Contrast`: readable text (alerts, links, terminal ANSI, status labels).
- `*Vivid`: colored icons and icon-like indicators (file icons, problems, git decorations, debug controls).

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
- `context`: extra template variables (optional)

For files that combine both schemes in one output (example: `themes/Git/delta.template.gitconfig`), omit `scheme` and use `{{light:token}}` / `{{dark:token}}` placeholders.

Edit `scripts/prepare-themes.ts` only when adding a new scheme type.

## Rules

- **Hairline separators:** For header and footer chrome (toolbars, nav bars, title bars), prefer a **0.5px** solid edge using the standard border token (`border`).
- **Disabled buttons:** The canonical pattern is the enabled primary or secondary button at 50% opacity (see `squirrelsong-ui.html`). Use `disabledButtonBackground`, `disabledButtonForeground`, and `disabledButtonBorder` from `theme.json` only when opacity is not supported.
- When working on CSS themes, refer to @themes/CSS/squirrelsong.css and @squirrelsong-ui.html for correct styles.
- When working on terminal/ANSI colors, refer to @squirrelsong-cli.html for badge and TUI contrast.
- Keep `terminalBlack` as dark ink for `bgYellow.black`-style badges. For muted terminal chrome (dim text, borders, spinners), use `terminalSecondaryForeground` and `terminalBorder` — not ANSI black/brightBlack.
- All new themes should be made using templates.
- Don’t mention templates in individual theme Readmes.
