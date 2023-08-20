Install dependencies:

```
cd light/VSCode/SquirrelsongLight
npm install
```

(If needed.) [Create an access token](https://sapegin.visualstudio.com/_usersSettings/tokens), and log in:

```
vsce login sapegin
```

Publish a new version:

```
npm run publish <patch>
npm run publish <minor>
npm run publish <major>
```
