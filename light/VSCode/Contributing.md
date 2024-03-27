# Contributing

[Visual Studio Code theme color API](https://code.visualstudio.com/api/references/theme-color)

[Default UI theme](https://github.com/microsoft/vscode/blob/f125afbc800ec611f5a9ab1333c769832ce424b3/src/vs/platform/theme/common/colorRegistry.ts)

## Publishing a new version

**Update changelog:** `SquirrelsongLight/Changelog.md`.

Install dependencies:

```shell
cd light/VSCode/SquirrelsongLight
npm install
```

(If needed.) [Create an access token](https://sapegin.visualstudio.com/_usersSettings/tokens) (you only need Marketplace/Manage permission), and log in:

```shell
vsce login sapegin
```

Publish a new version:

```shell
npm run publish patch
npm run publish minor
npm run publish major
```

## Debugging

1. `cd` to the theme package.
2. `code `.
3. Press F5.

To debug tokens, open command palette (Cmd+Shift+P), and select "Inspect Editor Tokens and Scopes".
