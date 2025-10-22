# Squirrelsong Dark Theme for [fzf](https://github.com/junegunn/fzf)

![Squirrelsong dark deep purple theme for fzf](screenshot-dark-dp.jpg)

## Installing from GitHub

1. Add the following to your `~/.bashrc`, `~/.zshrc`, or any other file that your shell loads on startup.
   a. For Squirrelsong Dark theme:

<!-- apply:dark -->

```shell
exexport FZF_DEFAULT_OPTS='
  --color=fg:-1,fg+:#bfac99,bg:-1,bg+:#bfac99
  --color=hl:#ca5a83,hl+:#97576f,info:#614d3d,marker:#ceb250
  --color=prompt:#614d3d,spinner:#bfac99,pointer:#bfac99,header:#edd5be
  --color=border:#5b4839,label:#bfac99,query:#edd5be,disabled:#614d3d
  --border="rounded" --border-label="" --preview-window="border-rounded" --prompt="> "
  --marker=">" --pointer="▪︎" --separator="─" --scrollbar="│"
  --info="right"'
```

b. For Squirrelsong Dark Deep Purple theme:

<!-- apply:dark-dp -->

```shell
exexport FZF_DEFAULT_OPTS='
  --color=fg:-1,fg+:#bea3d9,bg:-1,bg+:#bea3d9
  --color=hl:#ca5a83,hl+:#97576f,info:#6c5492,marker:#ceb250
  --color=prompt:#6c5492,spinner:#bea3d9,pointer:#bea3d9,header:#e9d6fa
  --color=border:#644e88,label:#bea3d9,query:#e9d6fa,disabled:#6c5492
  --border="rounded" --border-label="" --preview-window="border-rounded" --prompt="> "
  --marker=">" --pointer="▪︎" --separator="─" --scrollbar="│"
  --info="right"'
```

<!-- template
export FZF_DEFAULT_OPTS='
  --color=fg:-1,fg+:{{terminalForeground}},bg:-1,bg+:{{shyAccent}}
  --color=hl:{{boldAccent}},hl+:{{brightPinkDim}},info:{{terminalBrightBlack}},marker:{{terminalYellow}}
  --color=prompt:{{terminalBrightBlack}},spinner:{{shyAccent}},pointer:{{terminalForeground}},header:{{terminalBrightWhite}}
  --color=border:{{border}},label:{{shyAccent}},query:{{terminalBrightWhite}},disabled:{{terminalBrightBlack}}
  --border="rounded" --border-label="" --preview-window="border-rounded" --prompt="> "
  --marker=">" --pointer="▪︎" --separator="─" --scrollbar="│"
  --info="right"'
-->
