# Squirrelppuccin Icons Light

[Catppuccin VS Code Icons](https://github.com/catppuccin/vscode-icons) recolored with the [Squirrelsong Light](https://sapegin.me/squirrelsong/) palette.

## Installation

1. Install the extension from the Visual Studio Code Marketplace.
2. Open the command palette (`Cmd/Ctrl + Shift + P`) and run **Preferences: File Icon Theme**.
3. Pick **Squirrelppuccin Icons Light**.

## Updating icons from upstream

The SVG icons and the file/folder association map are generated from the upstream [`catppuccin/vscode-icons`](https://github.com/catppuccin/vscode-icons) project. To regenerate them, run from the repository root:

```sh
npm run prepare-vscode-icons
```

The script downloads the upstream `main` branch, dynamically imports its file/folder mapping definitions, and recolors each SVG using the Squirrelsong Light palette.

## Credits

Icons © 2023 Catppuccin, thang-nm — MIT-licensed. Recoloring and packaging © 2026 Artem Sapegin — MIT-licensed. See [License.md](./License.md).
