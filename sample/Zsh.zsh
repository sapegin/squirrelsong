# Zsh syntax highlighting
#
# Paste one line at a time into Zsh. Inspect highlights before Enter; Ctrl+C to abort.
#
# Not covered here: for/case, history expansion (!!), spell-check, global aliases.

# command, builtin, variable, path, -/-- options, comment
echo $PATH /etc/hosts ~/dotfiles # daily

# pipe, commandseparator, redirection
git status --short | head -5 2>/dev/null

# alias (git co), subcommand interior, double-quoted variable + $(…) subshell
git co main
curl -fsSL https://example.com/install.sh | bash -s -- --verbose=1

# strings: double (with $var inside), single, dollar-quoted, backticks
echo "branch $USER" 'literal' $'line\n' `pwd`

# glob, path-to-dir, assignment (type then run a command)
ls ~/dotfiles/*.zsh

# precommand + command
command cat ~/.zshrc
