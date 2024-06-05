# Squirrelsong Light Theme for [Neovim](https://neovim.io)/[Vim](https://www.vim.org)

In your Vim configuration, use `:colorscheme squirrelsong_light`.

Set `g:squirrelsong_color_only` to `v:true` beforehand to
disable additional styling like italic, bold, etc. This can
help on some terminals and fonts that don't support them that well

## Installation with [lazy.nvim](https://github.com/folke/lazy.nvim)

```lua
{
  "sapegin/squirrelsong",
  config = function(plugin)
    vim.opt.rtp:append(plugin.dir .. "/light/Vim")
  end,
}
```

## Installation with [packer.nvim](https://github.com/wbthomason/packer.nvim)

```lua
use { 'sapegin/squirrelsong', rtp = 'light/Vim' }
```

## Installation with [vim-plug](https://github.com/junegunn/vim-plug)

```vim
call plug#begin()
  ...
  Plug 'sapegin/squirrelsong', { 'rtp': 'light/Vim' }
  ...
call plug#end()
```

## Manual Installation
Put [`squirrelsong_light.vim`](./colors/squirrelsong_light.vim)
in a `colors` directory somewhere on your `'rtp'`. `:echo &rtp` will print your `'rtp'`
