# Squirrelsong Dark Theme for [Spyder](https://www.spyder-ide.org/)

## Installation

For Spyder 4.0.x.

1. With Spyder closed, open `~/.spyder-py3/spyder.ini`
2. Find the `[appearance]` section. Add `squirrelsong` to the names array. For example:

    ```ini
    ...
    [appearance]
    ...
    names = ['emacs', 'idle', 'monokai', 'pydev', 'scintilla', 'solarized/dark', 'solarized/light', 'spyder', 'spyder/dark', 'tomorrow', 'zenburn', 'squirrelsong']
    ```

3. Append the contents of [squirrelsong-dark.ini](./squirrelsong-dark.ini) from this repo to the end of the `[appearance]` section.
4. Select **Squirrelsong Dark** in the **Preferences** -> **Appearance** -> **Syntax highlighting theme**
