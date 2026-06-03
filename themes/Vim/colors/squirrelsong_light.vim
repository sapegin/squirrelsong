" =============================================================================
" Name:         Squirrelsong Light
" Description:  Low contrast light theme for web developers.
" URL:          https://github.com/sapegin/squirrelsong/
" License:      MIT
" =============================================================================

" Set to v:false to disable everything but color
let g:squirrelsong_color_only = get(g:, 'squirrelsong_color_only', v:false)

" Initialization: {{{
let s:palette = {
  \ 'gray080':               ['#6b676f',   'NONE'],
  \ 'gray110':               ['#9c96a2',   'NONE'],
  \ 'gray150':               ['#dbd7e0',   'NONE'],
  \ 'gray160':               ['#e8e5eb',   'NONE'],
  \ 'green':                 ['#9bae7e',   'NONE'],
  \ 'teal':                  ['#5f9b8d',   'NONE'],
  \ 'blue':                  ['#80a4be',   'NONE'],
  \ 'magenta':               ['#ac9bc5',   'NONE'],
  \ 'red':                   ['#d67e76',   'NONE'],
  \ 'orange':                ['#de9e59',   'NONE'],
  \ 'yellow':                ['#e4c158',   'NONE'],
  \ 'bright_yellow_light':   ['#f8e7a0',   'NONE'],
  \
  \ 'punctuation' :          ['#78737d',   'NONE'],
  \ 'comment' :              ['#9c96a2',   'NONE'],
  \ 'keyword' :              ['#ac9bc5',   'NONE'],
  \ 'number' :               ['#de9e59',   'NONE'],
  \ 'property' :             ['#80a4be',   'NONE'],
  \ 'variable' :             ['#80a4be',   'NONE'],
  \ 'function' :             ['#80a4be',   'NONE'],
  \ 'string' :               ['#9bae7e',   'NONE'],
  \ 'type' :                 ['#5f9b8d',   'NONE'],
  \ 'class' :                ['#5f9b8d',   'NONE'],
  \ 'regexp' :               ['#9bae7e',   'NONE'],
  \ 'url' :                  ['#4b7b97',   'NONE'],
  \ 'fg' :                   ['#78737d',   'NONE'],
  \ 'bg' :                   ['#fdfdfe',   'NONE'],
  \
  \ 'none':                  ['NONE',        'NONE']
  \ }

" Apply a highlight style
" @group: The name of the group for the highlight
" @specs: A dictionary with the following keys:
"   @link: A groupname to link this highlight to, other keys are ignored.
"   @fg: An array of two values for guifg and ctermfg, respectively
"   @bg: An array of two values for guibg and ctermbg, respectively
"   @style: A string for special style, e.g.: 'italic', 'bold', 'reverse'
function! s:squirrelsong_hl(group, specs)
  let s:spec_str = ''

  if has_key(a:specs, 'link')
    execute 'highlight! link ' .. a:group .. ' ' .. a:specs['link']
    return
  endif

  if has_key(a:specs, 'fg')
    let s:spec_str = s:spec_str .. ' guifg=' .. a:specs['fg'][0]
    let s:spec_str = s:spec_str .. ' ctermfg=' .. a:specs['fg'][1]
  else
    let s:spec_str = s:spec_str .. ' guifg=NONE'
    let s:spec_str = s:spec_str .. ' ctermfg=NONE'
  endif

  if has_key(a:specs, 'bg')
    let s:spec_str = s:spec_str .. ' guibg=' .. a:specs['bg'][0]
    let s:spec_str = s:spec_str .. ' ctermbg=' .. a:specs['bg'][1]
  else
    let s:spec_str = s:spec_str .. ' guibg=NONE'
    let s:spec_str = s:spec_str .. ' ctermbg=NONE'
  endif

  if !g:squirrelsong_color_only && has_key(a:specs, 'style')
    let s:spec_str = s:spec_str .. ' gui=' .. a:specs['style']
    let s:spec_str = s:spec_str .. ' cterm=' .. a:specs['style']
  else
    let s:spec_str = s:spec_str .. ' gui=NONE'
    let s:spec_str = s:spec_str .. ' cterm=NONE'
  endif

  execute 'highlight' a:group s:spec_str
endfunction

highlight clear
if exists('syntax_on')
  syntax reset
endif

let g:colors_name = 'squirrelsong_light'
" }}}

let colors = {}

" Common Highlight Groups {{{

" UI {{{
call extend(colors, {
      \ 'Normal':           { 'fg': s:palette.fg, 'bg': s:palette.bg     },
      \ 'Statusline':       { 'fg': s:palette.fg, 'bg': s:palette.gray160 },
      \ 'StatuslineNC':     { 'fg': s:palette.fg, 'bg': s:palette.gray150 },
      \ 'IncSearch':        { 'bg': s:palette.bright_yellow_light },
      \ 'Search':           {  'bg': s:palette.bright_yellow_light },
      \ 'Folded':           { 'fg': s:palette.fg, 'bg': s:palette.gray160 },
      \ 'Visual':           { 'fg': s:palette.none, 'bg': s:palette.bright_yellow_light },
      \ })
" }}}

" Vanilla Syntax {{{
call extend(colors, {
      \ 'Type': { 'fg': s:palette.teal, 'style': 'bold' },
      \ 'Structure': { 'fg': s:palette.teal, 'style': 'bold' },
      \ 'StorageClass': { 'fg': s:palette.blue, 'style': 'italic' },
      \ 'Identifier': { 'fg': s:palette.blue, 'style': 'italic' },
      \ 'PreProc': { 'fg': s:palette.red },
      \ 'PreCondit': { 'fg': s:palette.magenta },
      \ 'Include': { 'fg': s:palette.magenta, 'style': 'bold' },
      \ 'Keyword': { 'fg': s:palette.magenta },
      \ 'Define': { 'fg': s:palette.red },
      \ 'Typedef': { 'fg': s:palette.red },
      \ 'Exception': { 'fg': s:palette.red },
      \ 'Conditional': { 'fg': s:palette.magenta },
      \ 'Repeat': { 'fg': s:palette.magenta },
      \ 'Statement': { 'fg': s:palette.magenta },
      \ 'Macro': { 'fg': s:palette.magenta },
      \ 'Error': { 'fg': s:palette.red },
      \ 'Label': { 'fg': s:palette.magenta },
      \ 'Special': { 'fg': s:palette.magenta },
      \ 'SpecialChar': { 'fg': s:palette.magenta },
      \ 'Boolean': { 'fg': s:palette.magenta },
      \ 'String': { 'fg': s:palette.green },
      \ 'Character': { 'fg': s:palette.orange },
      \ 'Number': { 'fg': s:palette.orange },
      \ 'Float': { 'fg': s:palette.magenta },
      \ 'Function': { 'fg': s:palette.blue, 'style':  'bold' },
      \ 'Operator': { 'fg': s:palette.red },
      \ 'Title': { 'fg': s:palette.red, 'style': 'bold' },
      \ 'Tag': { 'fg': s:palette.orange },
      \ 'Delimiter': { 'fg': s:palette.fg },
      \ 'Todo': { 'fg': s:palette.bg, 'bg': s:palette.blue, 'style': 'bold' },
      \ 'Comment': { 'fg': s:palette.comment, 'style': 'italic' },
      \ 'SpecialComment': { 'fg': s:palette.comment, 'style': 'italic' },
      \ 'Ignore': { 'fg': s:palette.gray080 },
      \ 'Underlined': { 'style': 'underline' },
      \ 'Whitespace': { 'fg': s:palette.gray150 },
      \ })

if &diff
  call extend(colors, {
        \ 'CursorLine': { 'style': 'underline' },
        \ 'ColorColumn': { 'style': 'bold' },
        \ })
else
  call extend(colors, {
        \ 'CursorLine': { 'bg': s:palette.gray150},
        \ 'ColorColumn': { 'bg': s:palette.gray150 },
        \ })
endif
" }}}

" Predefined Highlight Groups: {{{
call extend(colors, {
      \ 'Fg': { 'fg': s:palette.fg, },
      \ 'Gray': { 'fg': s:palette.gray110, }
      \ 'Red': { 'fg': s:palette.red, },
      \ 'Orange': { 'fg': s:palette.orange, },
      \ 'Yellow': { 'fg': s:palette.yellow, },
      \ 'Green': { 'fg': s:palette.green, },
      \ 'Blue': { 'fg': s:palette.blue, },
      \ 'magenta': { 'fg': s:palette.magenta, },
      \ 'Teal': { 'fg': s:palette.teal, },
      \
      \ 'RedItalic': { 'fg': s:palette.red, 'style': 'italic' },
      \ 'GrayItalic': { 'fg': s:palette.gray110, 'tyle': 'italic' },
      \ 'OrangeItalic': { 'fg': s:palette.orange, 'style': 'italic' },
      \ 'YellowItalic': { 'fg': s:palette.yellow, 'style': 'italic' },
      \ 'GreenItalic': { 'fg': s:palette.green, 'style': 'italic' },
      \ 'BlueItalic': { 'fg': s:palette.blue, 'style': 'italic' },
      \ 'magentaItalic': { 'fg': s:palette.magenta, 'style': 'italic' },
      \ 'TealItalic': { 'fg': s:palette.teal, 'style': 'italic' },
      \
      \ 'RedBold': { 'fg': s:palette.red, 'style': 'bold' },
      \ 'GrayBold': { 'fg': s:palette.gray110, 'tyle': 'bold' },
      \ 'OrangeBold': { 'fg': s:palette.orange, 'style': 'bold' },
      \ 'YellowBold': { 'fg': s:palette.yellow, 'style': 'bold' },
      \ 'GreenBold': { 'fg': s:palette.green, 'style': 'bold' },
      \ 'BlueBold': { 'fg': s:palette.blue, 'style': 'bold' },
      \ 'magentaBold': { 'fg': s:palette.magenta, 'style': 'bold' },
      \ 'TealBold': { 'fg': s:palette.teal, 'style': 'bold' },
      \ })
" }}}

" }}}

" Plugins: {{{

" netrw {{{
call extend(colors, {
    \ 'netrwDir': { 'link': 'Green' } ,
    \ 'netrwClassify': { 'link': 'Green' } ,
    \ 'netrwLink': { 'link': 'Grey' } ,
    \ 'netrwSymLink': { 'link': 'Fg' } ,
    \ 'netrwExe': { 'link': 'Red' } ,
    \ 'netrwComment': { 'link': 'Grey' } ,
    \ 'netrwList': { 'link': 'Yellow' } ,
    \ 'netrwHelpCmd': { 'link': 'Blue' } ,
    \ 'netrwCmdSep': { 'link': 'Grey' } ,
    \ 'netrwVersion': { 'link': 'magenta' } ,
    \ })
" }}}

" nvim-treesitter/nvim-treesitter {{{
call extend(colors, {
    \ 'TSStrong': { 'style': 'bold' } ,
    \ 'TSEmphasis': { 'style': 'italic' } ,
    \ 'TSUnderline': { 'style': 'underline' } ,
    \ 'TSNote': { 'fg': s:palette.bg, 'bg': s:palette.green, 'style': 'bold' } ,
    \ 'TSWarning': { 'fg': s:palette.bg, 'bg': s:palette.yellow, 'style': 'bold' } ,
    \ 'TSDanger': { 'fg': s:palette.bg, 'bg': s:palette.red, 'style': 'bold' } ,
    \ 'TSAnnotation': { 'link': 'BlueItalic' } ,
    \ 'TSAttribute': { 'link': 'BlueItalic' } ,
    \ 'TSBoolean': { 'link': 'magenta' } ,
    \ 'TSCharacter': { 'link': 'Green' } ,
    \ 'TSCharacterSpecial': { 'link': 'SpecialChar' } ,
    \ 'TSComment': { 'link': 'GrayItalic' } ,
    \ 'TSConditional': { 'link': 'magentaBold' } ,
    \ 'TSConstBuiltin': { 'link': 'magentaItalic' } ,
    \ 'TSConstMacro': { 'link': 'magentaItalic' } ,
    \ 'TSConstant': { 'link': 'Fg' } ,
    \ 'TSConstructor': { 'link': 'Green' } ,
    \ 'TSDebug': { 'link': 'Debug' } ,
    \ 'TSDefine': { 'link': 'Define' } ,
    \ 'TSEnvironment': { 'link': 'Macro' } ,
    \ 'TSEnvironmentName': { 'link': 'Type' } ,
    \ 'TSError': { 'link': 'Error' } ,
    \ 'TSException': { 'link': 'Red' } ,
    \ 'TSField': { 'link': 'Orange' } ,
    \ 'TSFloat': { 'link': 'magenta' } ,
    \ 'TSFuncBuiltin': { 'link': 'Green' } ,
    \ 'TSFuncMacro': { 'link': 'BlueBold' } ,
    \ 'TSFunction': { 'link': 'BlueBold' } ,
    \ 'TSFunctionCall': { 'link': 'BlueBold' } ,
    \ 'TSInclude': { 'link': 'magentaBold' } ,
    \ 'TSKeyword': { 'link': 'magentaBold' } ,
    \ 'TSKeywordFunction': { 'link': 'magentaBold' } ,
    \ 'TSKeywordOperator': { 'link': 'magentaBold' } ,
    \ 'TSKeywordReturn': { 'link': 'magentaBold' } ,
    \ 'TSLabel': { 'link': 'magentaBold' } ,
    \ 'TSLiteral': { 'link': 'String' } ,
    \ 'TSMath': { 'link': 'Yellow' } ,
    \ 'TSMethod': { 'link': 'Green' } ,
    \ 'TSMethodCall': { 'link': 'Green' } ,
    \ 'TSNamespace': { 'link': 'BlueItalic' } ,
    \ 'TSNone': { 'link': 'Fg' } ,
    \ 'TSNumber': { 'link': 'Orange' } ,
    \ 'TSOperator': { 'link': 'Teal' } ,
    \ 'TSParameter': { 'link': 'BlueItalic' } ,
    \ 'TSParameterReference': { 'link': 'Fg' } ,
    \ 'TSPreProc': { 'link': 'PreProc' } ,
    \ 'TSProperty': { 'link': 'Blue' } ,
    \ 'TSPunctBracket': { 'link': 'Gray' } ,
    \ 'TSPunctDelimiter': { 'link': 'Gray' } ,
    \ 'TSPunctSpecial': { 'link': 'Yellow' } ,
    \ 'TSRepeat': { 'link': 'magentaBold' } ,
    \ 'TSStorageClass': { 'link': 'magentaBold' } ,
    \ 'TSStorageClassLifetime': { 'link': 'magentaBold' } ,
    \ 'TSStrike': { 'link': 'Gray' } ,
    \ 'TSString': { 'link': 'Green' } ,
    \ 'TSStringEscape': { 'link': 'Orange' } ,
    \ 'TSStringRegex': { 'link': 'Green' } ,
    \ 'TSStringSpecial': { 'link': 'SpecialChar' } ,
    \ 'TSSymbol': { 'link': 'BlueItalic' } ,
    \ 'TSTag': { 'link': 'BlueItalic' } ,
    \ 'TSTagAttribute': { 'link': 'Green' } ,
    \ 'TSTagDelimiter': { 'link': 'Red' } ,
    \ 'TSText': { 'link': 'Green' } ,
    \ 'TSTextReference': { 'link': 'Constant' } ,
    \ 'TSTitle': { 'link': 'Title' } ,
    \ 'TSTodo': { 'link': 'Todo' } ,
    \ 'TSType': { 'link': 'Teal' } ,
    \ 'TSTypeBuiltin': { 'link': 'Teal' } ,
    \ 'TSTypeDefinition': { 'link': 'BlueItalic' } ,
    \ 'TSTypeQualifier': { 'link': 'magentaBold' } ,
    \ 'TSVariable': { 'link': 'BlueItalic' } ,
    \ 'TSVariableBuiltin': { 'link': 'magentaItalic' } ,
    \ 'TSURI': { 'fg': s:palette.blue, 'style': 'underline' },
    \ 'TSModuleInfoGood': { 'link': 'Green' } ,
    \ 'TSModuleInfoBad': { 'link': 'Red' } ,
    \ })

if has('nvim-0.8')
    call extend(colors, {
        \ '@annotation': { 'link': 'TSAnnotation' } ,
        \ '@attribute': { 'link': 'TSAttribute' } ,
        \ '@boolean': { 'link': 'TSBoolean' } ,
        \ '@character': { 'link': 'TSCharacter' } ,
        \ '@character.special': { 'link': 'TSCharacterSpecial' } ,
        \ '@comment': { 'link': 'TSComment' } ,
        \ '@comment.error': { 'link': 'TSDanger' } ,
        \ '@comment.note': { 'link': 'TSNote' } ,
        \ '@comment.todo': { 'link': 'TSTodo' } ,
        \ '@comment.warning': { 'link': 'TSWarning' } ,
        \ '@conceal': { 'link': 'Gray' } ,
        \ '@conditional': { 'link': 'TSConditional' } ,
        \ '@constant': { 'link': 'TSConstant' } ,
        \ '@constant.builtin': { 'link': 'TSConstBuiltin' } ,
        \ '@constant.macro': { 'link': 'TSConstMacro' } ,
        \ '@constructor': { 'link': 'TSConstructor' } ,
        \ '@debug': { 'link': 'TSDebug' } ,
        \ '@define': { 'link': 'TSDefine' } ,
        \ '@diff.delta': { 'link': 'diffChanged' } ,
        \ '@diff.minus': { 'link': 'diffRemoved' } ,
        \ '@diff.plus': { 'link': 'diffAdded' } ,
        \ '@error': { 'link': 'TSError' } ,
        \ '@exception': { 'link': 'TSException' } ,
        \ '@field': { 'link': 'TSField' } ,
        \ '@float': { 'link': 'TSFloat' } ,
        \ '@function': { 'link': 'TSFunction' } ,
        \ '@function.builtin': { 'link': 'TSFuncBuiltin' } ,
        \ '@function.call': { 'link': 'TSFunctionCall' } ,
        \ '@function.macro': { 'link': 'TSFuncMacro' } ,
        \ '@function.method': { 'link': 'TSMethod' } ,
        \ '@function.method.call': { 'link': 'TSMethodCall' } ,
        \ '@function_definition.identifier': { 'link': 'Error' } ,
        \ '@include': { 'link': 'TSInclude' } ,
        \ '@keyword': { 'link': 'TSKeyword' } ,
        \ '@keyword.conditional': { 'link': 'TSConditional' } ,
        \ '@keyword.debug': { 'link': 'TSDebug' } ,
        \ '@keyword.directive': { 'link': 'TSPreProc' } ,
        \ '@keyword.directive.define': { 'link': 'TSDefine' } ,
        \ '@keyword.exception': { 'link': 'TSException' } ,
        \ '@keyword.function': { 'link': 'TSKeywordFunction' } ,
        \ '@keyword.import': { 'link': 'TSInclude' } ,
        \ '@keyword.operator': { 'link': 'TSKeywordOperator' } ,
        \ '@keyword.repeat': { 'link': 'TSRepeat' } ,
        \ '@keyword.return': { 'link': 'TSKeywordReturn' } ,
        \ '@keyword.storage': { 'link': 'TSStorageClass' } ,
        \ '@keyword.modifier': { 'link': 'TSStorageClass' } ,
        \ '@keyword.type': { 'link': 'TSType' } ,
        \ '@label': { 'link': 'TSLabel' } ,
        \ '@markup.emphasis': { 'link': 'TSEmphasis' } ,
        \ '@markup.environment': { 'link': 'TSEnvironment' } ,
        \ '@markup.environment.name': { 'link': 'TSEnvironmentName' } ,
        \ '@markup.heading': { 'link': 'TSTitle' } ,
        \ '@markup.link': { 'link': 'TSTextReference' } ,
        \ '@markup.link.label': { 'link': 'TSStringSpecial' } ,
        \ '@markup.link.url': { 'link': 'TSURI' } ,
        \ '@markup.list': { 'link': 'TSPunctSpecial' } ,
        \ '@markup.list.checked': { 'link': 'Green' } ,
        \ '@markup.list.unchecked': { 'link': 'Ignore' } ,
        \ '@markup.math': { 'link': 'TSMath' } ,
        \ '@markup.note': { 'link': 'TSNote' } ,
        \ '@markup.quote': { 'link': 'Gray' } ,
        \ '@markup.raw': { 'link': 'TSLiteral' } ,
        \ '@markup.strike': { 'link': 'TSStrike' } ,
        \ '@markup.strong': { 'link': 'TSStrong' } ,
        \ '@markup.underline': { 'link': 'TSUnderline' } ,
        \ '@math': { 'link': 'TSMath' } ,
        \ '@method': { 'link': 'TSMethod' } ,
        \ '@method.call': { 'link': 'TSMethodCall' } ,
        \ '@module': { 'link': 'TSNamespace' } ,
        \ '@namespace': { 'link': 'TSNamespace' } ,
        \ '@none': { 'link': 'TSNone' } ,
        \ '@number': { 'link': 'TSNumber' } ,
        \ '@number.float': { 'link': 'TSFloat' } ,
        \ '@operator': { 'link': 'TSOperator' } ,
        \ '@parameter': { 'link': 'TSParameter' } ,
        \ '@parameter.reference': { 'link': 'TSParameterReference' } ,
        \ '@preproc': { 'link': 'TSPreProc' } ,
        \ '@property': { 'link': 'TSProperty' } ,
        \ '@punctuation.bracket': { 'link': 'TSPunctBracket' } ,
        \ '@punctuation.delimiter': { 'link': 'TSPunctDelimiter' } ,
        \ '@punctuation.special': { 'link': 'TSPunctSpecial' } ,
        \ '@repeat': { 'link': 'TSRepeat' } ,
        \ '@storageclass': { 'link': 'TSStorageClass' } ,
        \ '@storageclass.lifetime': { 'link': 'TSStorageClassLifetime' } ,
        \ '@strike': { 'link': 'TSStrike' } ,
        \ '@string': { 'link': 'TSString' } ,
        \ '@string.escape': { 'link': 'TSStringEscape' } ,
        \ '@string.regex': { 'link': 'TSStringRegex' } ,
        \ '@string.regexp': { 'link': 'TSStringRegex' } ,
        \ '@string.special': { 'link': 'TSStringSpecial' } ,
        \ '@string.special.symbol': { 'link': 'TSSymbol' } ,
        \ '@string.special.uri': { 'link': 'TSURI' } ,
        \ '@symbol': { 'link': 'TSSymbol' } ,
        \ '@tag': { 'link': 'TSTag' } ,
        \ '@tag.attribute': { 'link': 'TSTagAttribute' } ,
        \ '@tag.delimiter': { 'link': 'TSTagDelimiter' } ,
        \ '@text': { 'link': 'TSText' } ,
        \ '@text.danger': { 'link': 'TSDanger' } ,
        \ '@text.diff.add': { 'link': 'diffAdded' } ,
        \ '@text.diff.delete': { 'link': 'diffRemoved' } ,
        \ '@text.emphasis': { 'link': 'TSEmphasis' } ,
        \ '@text.environment': { 'link': 'TSEnvironment' } ,
        \ '@text.environment.name': { 'link': 'TSEnvironmentName' } ,
        \ '@text.literal': { 'link': 'TSLiteral' } ,
        \ '@text.math': { 'link': 'TSMath' } ,
        \ '@text.note': { 'link': 'TSNote' } ,
        \ '@text.reference': { 'link': 'TSTextReference' } ,
        \ '@text.strike': { 'link': 'TSStrike' } ,
        \ '@text.strong': { 'link': 'TSStrong' } ,
        \ '@text.title': { 'link': 'TSTitle' } ,
        \ '@text.todo': { 'link': 'TSTodo' } ,
        \ '@text.todo.checked': { 'link': 'Green' } ,
        \ '@text.todo.unchecked': { 'link': 'Ignore' } ,
        \ '@text.underline': { 'link': 'TSUnderline' } ,
        \ '@text.uri': { 'link': 'TSURI' } ,
        \ '@text.warning': { 'link': 'TSWarning' } ,
        \ '@todo': { 'link': 'TSTodo' } ,
        \ '@type': { 'link': 'TSType' } ,
        \ '@type.identifier': { 'link': 'TSType' } ,
        \ '@type.builtin': { 'link': 'TSTypeBuiltin' } ,
        \ '@type.definition': { 'link': 'TSTypeDefinition' } ,
        \ '@type.qualifier': { 'link': 'TSTypeQualifier' } ,
        \ '@uri': { 'link': 'TSURI' } ,
        \ '@variable': { 'link': 'TSVariable' } ,
        \ '@variable.builtin': { 'link': 'TSVariableBuiltin' } ,
        \ '@variable.member': { 'link': 'TSField' } ,
        \ '@variable.parameter': { 'link': 'TSVariable' } ,
        \ })
endif

if has('nvim-0.9')
    call extend(colors, {
        \ '@lsp.type.class': { 'link': 'TSType' } ,
        \ '@lsp.type.comment': { 'link': 'TSComment' } ,
        \ '@lsp.type.decorator': { 'link': 'TSFunction' } ,
        \ '@lsp.type.enum': { 'link': 'TSType' } ,
        \ '@lsp.type.enumMember': { 'link': 'TSProperty' } ,
        \ '@lsp.type.events': { 'link': 'TSLabel' } ,
        \ '@lsp.type.function': { 'link': 'TSFunction' } ,
        \ '@lsp.type.interface': { 'link': 'TSType' } ,
        \ '@lsp.type.keyword': { 'link': 'TSKeyword' } ,
        \ '@lsp.type.macro': { 'link': 'TSConstMacro' } ,
        \ '@lsp.type.method': { 'link': 'TSMethod' } ,
        \ '@lsp.type.modifier': { 'link': 'TSTypeQualifier' } ,
        \ '@lsp.type.namespace': { 'link': 'TSNamespace' } ,
        \ '@lsp.type.number': { 'link': 'TSNumber' } ,
        \ '@lsp.type.operator': { 'link': 'TSOperator' } ,
        \ '@lsp.type.parameter': { 'link': 'TSParameter' } ,
        \ '@lsp.type.property': { 'link': 'TSProperty' } ,
        \ '@lsp.type.regexp': { 'link': 'TSStringRegex' } ,
        \ '@lsp.type.string': { 'link': 'TSString' } ,
        \ '@lsp.type.struct': { 'link': 'TSType' } ,
        \ '@lsp.type.type': { 'link': 'TSType' } ,
        \ '@lsp.type.typeParameter': { 'link': 'TSTypeDefinition' } ,
        \ '@lsp.type.variable': { 'link': 'TSVariable' } ,
        \ 'DiagnosticUnnecessary': { 'link': 'WarningText' } ,
        \ })
endif
" }}}

" }}}

for item in items(colors)
  call s:squirrelsong_hl(item[0], item[1])
endfor

" vim: set filetype=vim foldmethod=marker foldmarker={{{,}}}:
