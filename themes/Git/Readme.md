# Squirrelsong themes for Git tools

## [git-delta](https://github.com/dandavison/delta)

1. Copy [themes.gitconfig](./themes.gitconfig) to your dotfiles and include it from `~/.gitconfig`:

   ```gitconfig
   [include]
     path = ~/dotfiles/colors/themes.gitconfig
   ```

2. Switch features by terminal appearance. Example with `TERM_THEME`:

   ```shell
   case $TERM_THEME in
   light)
     export DELTA_FEATURES=squirrelsong-light
     export DELTA_LIGHT=true
     ;;
   *)
     export DELTA_FEATURES=squirrelsong-dark-dp
     export DELTA_LIGHT=false
     ;;
   esac
   ```
