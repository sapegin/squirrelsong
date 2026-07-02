# Squirrelsong Theme for [revdiff](https://github.com/umputun/revdiff)

Squirrelsong themes for the revdiff terminal diff viewer, in **Light** and **Dark Deep Purple** variants.

## Installation

revdiff loads themes from `~/.config/revdiff/themes/`.

### From a local file

```sh
# Light
revdiff --install-theme ./squirrelsong-light

# Dark Deep Purple
revdiff --install-theme ./squirrelsong-dark-deep-purple
```

Or copy the theme files there manually:

```sh
cp squirrelsong-light squirrelsong-dark-deep-purple ~/.config/revdiff/themes/
```

## Usage

```sh
# Apply a theme
revdiff --theme squirrelsong-light
revdiff --theme squirrelsong-dark-deep-purple

# List available themes
revdiff --list-themes
```

Set a default theme in `~/.config/revdiff/config`:

```ini
theme = squirrelsong-dark-deep-purple
```

Or via environment variable:

```sh
export REVDIFF_THEME=squirrelsong-dark-deep-purple
```
