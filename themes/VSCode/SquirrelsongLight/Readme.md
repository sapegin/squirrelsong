# Squirrelsong Light Theme 🐿️

[![Preview in vscode.dev](https://img.shields.io/badge/Preview%20in-vscode.dev-brightgreen)](https://vscode.dev/editor/theme/sapegin.Theme-SquirrelsongLight)

A low-contrast, non-distracting and neurodiverse-friendly theme that is comfortable for all-day coding without sensory overstimulation, and perfect for developers with ADHD, autism, or highly sensitive people (HSP). No bright colors, no super-high contrast, no distractions. Soft colors but still enough legibility for different part of the code and UI.

**Install from [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=sapegin.Theme-SquirrelsongLight) or [Open VSX Registry](https://open-vsx.org/extension/sapegin/Theme-SquirrelsongLight)**

![Squirrelsong Light for Visual Studio Code](https://github.com/sapegin/squirrelsong/raw/HEAD/themes/VSCode/screenshot-light.jpg)

- Low contrast with great readability
- Made for web developers and highly sensitive people
- Monochrome Markdown styles
- Consistent highlighting for different programming languages
- Non-distracting UI

## Installation

1. Open **Extensions** sidebar panel in VS Code: **View** → **Extensions**.
2. Search for `Squirrelsong Light`.
3. Click **Install** to install it.
4. Choose **Code** → **Preferences** → **Color Theme** → `Squirrelsong Light`.

## Recommended settings

I recommend to also install [Catppuccin Icons](https://marketplace.visualstudio.com/items?itemName=Catppuccin.catppuccin-vsc-icons) icons pack (I use the `Latte` variant).

Here are my settings related to theming and typography:

```js
{
  // This is all that matters
  'workbench.colorTheme': 'Squirrelsong Light',
  // Monolisa (https://www.monolisa.dev) is a paid font but I love it,
  // Hack and JetBrains Mono are good free alternatives
  'editor.fontFamily': 'MonoLisa',
  // Enable contextual alternative but disable ligatures
  'editor.fontLigatures': "'calt' on, 'liga' off",
  'editor.fontSize': 17,
  'editor.lineHeight': 1.6,
  'editor.cursorBlinking': 'solid',
  'editor.cursorStyle': 'line',
  'editor.cursorWidth': 2,
  'editor.semanticHighlighting.enabled': true,
  'window.zoomLevel': 0.15,
  'workbench.fontAliasing': 'auto',
  // If you also install Catppuccin Icons
  'workbench.iconTheme': 'catppuccin-latte',
  'catppuccin-icons.hidesExplorerArrows': true
}
```

## More screenshots

![Squirrelsong Light: editing code](https://github.com/sapegin/squirrelsong/raw/HEAD/themes/VSCode/screenshots/screenshot-code.png)

![Squirrelsong Light: opening files](https://github.com/sapegin/squirrelsong/raw/HEAD/themes/VSCode/screenshots/screenshot-files.jpg)

## High contrast version

![Squirrelsong Light: opening files](https://github.com/sapegin/squirrelsong/raw/HEAD/themes/VSCode/screenshots/screenshot-high-contrast-no-italics.png)

## How to make the integrated terminal dark?

To use the [Squirrelsong Dark](https://marketplace.visualstudio.com/items?itemName=sapegin.Theme-SquirrelsongDark) theme in the integrated terminal, choose the `Squirrelsong Light (Dark Terminal)` theme instead of the `Squirrelsong Light`.

Also, add these two options to your config:

```js
{
  // Without this line colors will be washed out
  'terminal.integrated.minimumContrastRatio': 1,
  // Use normal colors for bold text
  'terminal.integrated.drawBoldTextInBrightColors': false
}
```

![Squirrelsong Light with dark terminal](https://github.com/sapegin/squirrelsong/raw/HEAD/themes/VSCode/screenshots/screenshot-terminal.jpg)

## Try Squirrelsong for other apps

[Squirrelsong is also available](https://sapegin.me/squirrelsong/) for Alfred, CotEditor, Chrome, iTerm2, JetBrains, Marta File Manager, Midnight Commander, Nimble Commander, Prism, Slack, Sublime Text, Telegram, Terminal.app, Vivaldi, Warp, WezTerm, and more…

## You may also like

Check out my other Visual Studio Code extensions:

- [Squirrelsong Dark Theme](https://marketplace.visualstudio.com/items?itemName=sapegin.Theme-SquirrelsongDark): low contrast non-distracting dark theme for web developers
- [Emoji Console Log](https://marketplace.visualstudio.com/items?itemName=sapegin.emoji-console-log): insert `console.log()` statements with a random emoji
- [New File Now](https://marketplace.visualstudio.com/items?itemName=sapegin.new-file-now): create new files from the command palette
- [Notebox](https://marketplace.visualstudio.com/items?itemName=sapegin.notebox): take quick notes in the bottom panel
- [Todo Tomorrow](marketplace.visualstudio.com/items?itemName=sapegin.todo-tomorrow): highlight `TODO`, `HACK`, `FIXME`, etc. comments

## Sponsoring

Maintaining a color theme for multiple editors takes time and coffee, buy me one more cup to keep it going.

<a href="https://www.buymeacoffee.com/sapegin" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/lato-orange.png" alt="Buy Me A Coffee" height="51" width="217" ></a>

## Authors and license

[Artem Sapegin](https://sapegin.me) and [contributors](https://github.com/sapegin/squirrelsong/graphs/contributors).

The MIT License, see the included [License.md](License.md) file.
