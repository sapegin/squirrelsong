# Squirrelsong Light Theme for [tuicr](https://github.com/agavra/tuicr)

Squirrelsong Light theme for the tuicr code review tool, with a matching syntax highlighting theme.

## Installation

Copy both files to the tuicr themes folder:

```sh
mkdir -p ~/.config/tuicr/themes
cp squirrelsong-light.toml squirrelsong-light-syntax.tmTheme ~/.config/tuicr/themes/
```

Keep the two files together: tuicr resolves the syntax theme relative to the theme file.

## Usage

```sh
tuicr --theme squirrelsong-light
```

Or set a default theme in `~/.config/tuicr/config.toml`:

```toml
theme = "squirrelsong-light"
```
