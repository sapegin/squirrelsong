# Squirrelsong {{name}}
export FZF_DEFAULT_OPTS='
  --color=fg:-1,fg+:{{terminalForeground}},bg:-1,bg+:{{accent1}}
  --color=hl:{{accent2}},hl+:{{brightPinkDim}},info:{{terminalBrightBlack}},marker:{{terminalYellow}}
  --color=prompt:{{terminalBrightBlack}},spinner:{{accent1}},pointer:{{terminalForeground}},header:{{terminalBrightWhite}}
  --color=border:{{border}},label:{{accent1}},query:{{terminalBrightWhite}},disabled:{{terminalBrightBlack}}
  --border="rounded" --border-label="" --preview-window="border-rounded" --prompt="> "
  --marker=">" --pointer="▪︎" --separator="─" --scrollbar="│"
  --info="right"'
