## Contributing to Visual Studio Code theme

[Visual Studio Code theme color API](https://code.visualstudio.com/api/references/theme-color)

[Default UI theme](https://github.com/microsoft/vscode/blob/f125afbc800ec611f5a9ab1333c769832ce424b3/src/vs/platform/theme/common/colorRegistry.ts#L330)

Install dependencies:

```shell
cd light/VSCode/SquirrelsongLight
npm install
```

(If needed.) [Create an access token](https://sapegin.visualstudio.com/_usersSettings/tokens), and log in:

```shell
vsce login sapegin
```

Publish a new version:

```shell
npm run publish <patch>
npm run publish <minor>
npm run publish <major>
```
