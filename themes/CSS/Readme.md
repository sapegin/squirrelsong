# Squirrelsong CSS theme

Semantic UI, code, and ANSI colors as CSS custom properties for light and dark schemes.

## Installation

1. Copy [`squirrelsong.css`](squirrelsong.css) into your project.
2. Add it to your HTML:

```html
<link rel="stylesheet" href="squirrelsong.css" />
```

3. Put `light` or `dark` on `<body>`:

```html
<body class="light">
  …
</body>
```

## Switching schemes

Toggle the class on that element. Only one scheme class should be active at a time:

```html
<body class="dark"></body>
```

```js
document.body.classList.remove('light', 'dark');
document.body.classList.add('dark');
```

Use tokens in your CSS, for example `var(--text-foreground)` and `var(--ui-background)`.
