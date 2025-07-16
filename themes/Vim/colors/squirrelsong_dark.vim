" =============================================================================
" Name:         Squirrelsong Dark
" Description:  Low contrast dark theme for web developers.
" URL:          https://github.com/sapegin/squirrelsong/
" License:      MIT
" =============================================================================

" Set to v:false to disable everything but color
let g:squirrelsong_color_only = get(g:, 'squirrelsong_color_only', v:false)

" Initialization: {{{
let s:palette = {
  \ 'gray00':                ['#0a0909',   'NONE'],
  \ 'gray01':                ['#17120e',   'NONE'],
  \ 'gray02':                ['#292019',   'NONE'],
  \ 'gray03':                ['#352a21',   'NONE'],
  \ 'gray04':                ['#453327',   'NONE'],
  \ 'gray05':                ['#574131',   'NONE'],
  \ 'gray06':                ['#6b503c',   'NONE'],
  \ 'gray07':                ['#755945',   'NONE'],
  \ 'gray08':                ['#896b56',   'NONE'],
  \ 'gray09':                ['#9e8e7e',   'NONE'],
  \ 'gray0a':                ['#ad9c8b',   'NONE'],
  \ 'gray0b':                ['#bfac99',   'NONE'],
  \ 'gray0c':                ['#cfbaa5',   'NONE'],
  \ 'gray0d':                ['#dec8b1',   'NONE'],
  \ 'gray0e':                ['#edd5be',   'NONE'],
  \ 'gray0f':                ['#fae1c8',   'NONE'],
  \ 'green':                 ['#558240',   'NONE'],
  \ 'green_light':           ['#44603b',   'NONE'],
  \ 'green_lighter':         ['#445536',   'NONE'],
  \ 'green_contrast':        ['#709855',   'NONE'],
  \ 'teal':                  ['#4f9593',   'NONE'],
  \ 'teal_light':            ['#41635f',   'NONE'],
  \ 'teal_lighter':          ['#3e5550',   'NONE'],
  \ 'teal_contrast':         ['#72aaa8',   'NONE'],
  \ 'blue':                  ['#5993c2',   'NONE'],
  \ 'blue_light':            ['#425e79',   'NONE'],
  \ 'blue_lighter':          ['#3f5164',   'NONE'],
  \ 'blue_contrast':         ['#63a2d6',   'NONE'],
  \ 'purple':                ['#7f61b3',   'NONE'],
  \ 'purple_light':          ['#57427a',   'NONE'],
  \ 'purple_lighter':        ['#453461',   'NONE'],
  \ 'purple_contrast':       ['#ad8fcc',   'NONE'],
  \ 'red':                   ['#ac493e',   'NONE'],
  \ 'red_light':             ['#703a2f',   'NONE'],
  \ 'red_lighter':           ['#6c3b2f',   'NONE'],
  \ 'red_contrast':          ['#ce574a',   'NONE'],
  \ 'orange':                ['#b18433',   'NONE'],
  \ 'orange_light':          ['#73572a',   'NONE'],
  \ 'orange_lighter':        ['#644c28',   'NONE'],
  \ 'orange_contrast':       ['#d8a851',   'NONE'],
  \ 'yellow':                ['#ceb250',   'NONE'],
  \ 'yellow_light':          ['#87753d',   'NONE'],
  \ 'yellow_lighter':        ['#7d683a',   'NONE'],
  \ 'yellow_contrast':       ['#e2c358',   'NONE'],
  \ 'bright_pink':           ['#ca5a83',   'NONE'],
  \ 'bright_pink_dark':      ['#97576f',   'NONE'],
  \ 'bright_yellow':         ['#574131',   'NONE'],
  \ 'bright_yellow_dark':    ['#41352a',   'NONE'],
  \
  \ 'punctuation' :          ['#9e8e7e',   'NONE'],
  \ 'comment' :              ['#755945',   'NONE'],
  \ 'keyword' :              ['#7f61b3',   'NONE'],
  \ 'number' :               ['#b18433',   'NONE'],
  \ 'property' :             ['#5993c2',   'NONE'],
  \ 'variable' :             ['#5993c2',   'NONE'],
  \ 'function' :             ['#5993c2',   'NONE'],
  \ 'string' :               ['#558240',   'NONE'],
  \ 'type' :                 ['#4f9593',   'NONE'],
  \ 'class' :                ['#4f9593',   'NONE'],
  \ 'regexp' :               ['#ac493e',   'NONE'],
  \ 'important' :            ['#ac493e',   'NONE'],
  \ 'url' :                  ['#63a2d6',   'NONE'],
  \ 'selection' :            ['#574131',   'NONE'],
  \ 'line' :                 ['#453327',   'NONE'],
  \ 'fg' :                   ['#ad9c8b',   'NONE'],
  \ 'bg' :                   ['#352a21',   'NONE'],
  \
  \ 'none':                  ['NONE',      'NONE']
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

let g:colors_name = 'squirrelsong_dark'
" }}}

let colors = {}

" Common Highlight Groups {{{

" UI {{{
call extend(colors, {
      \ 'Normal':           { 'fg': s:palette.fg, 'bg': s:palette.bg     },
      \ 'Statusline':       { 'fg': s:palette.fg, 'bg': s:palette.gray0e },
      \ 'StatuslineNC':     { 'fg': s:palette.fg, 'bg': s:palette.gray0d },
      \ 'IncSearch':        { 'bg': s:palette.yellow_light },
      \ 'Search':           {  'bg': s:palette.yellow_light },
      \ 'Folded':           { 'fg': s:palette.fg, 'bg': s:palette.gray0e },
      \ 'Visual':           { 'fg': s:palette.none, 'bg': s:palette.yellow_light },
      \ })
" }}}

" Vanilla Syntax {{{
call extend(colors, {
      \ 'Type': { 'fg': s:palette.teal, 'style': 'bold' },
      \ 'Structure': { 'fg': s:palette.teal, 'style': 'bold' },
      \ 'StorageClass': { 'fg': s:palette.blue, 'style': 'italic' },
      \ 'Identifier': { 'fg': s:palette.blue, 'style': 'italic' },
      \ 'PreProc': { 'fg': s:palette.red },
      \ 'PreCondit': { 'fg': s:palette.purple },
      \ 'Include': { 'fg': s:palette.purple, 'style': 'bold' },
      \ 'Keyword': { 'fg': s:palette.purple },
      \ 'Define': { 'fg': s:palette.red },
      \ 'Typedef': { 'fg': s:palette.red },
      \ 'Exception': { 'fg': s:palette.red },
      \ 'Conditional': { 'fg': s:palette.purple },
      \ 'Repeat': { 'fg': s:palette.purple },
      \ 'Statement': { 'fg': s:palette.purple },
      \ 'Macro': { 'fg': s:palette.purple },
      \ 'Error': { 'fg': s:palette.red },
      \ 'Label': { 'fg': s:palette.purple },
      \ 'Special': { 'fg': s:palette.purple },
      \ 'SpecialChar': { 'fg': s:palette.purple },
      \ 'Boolean': { 'fg': s:palette.purple },
      \ 'String': { 'fg': s:palette.green },
      \ 'Character': { 'fg': s:palette.orange },
      \ 'Number': { 'fg': s:palette.orange },
      \ 'Float': { 'fg': s:palette.purple },
      \ 'Function': { 'fg': s:palette.blue, 'style': 'bold'},
      \ 'Operator': { 'fg': s:palette.gray0e },
      \ 'Title': { 'fg': s:palette.red, 'style': 'bold' },
      \ 'Tag': { 'fg': s:palette.orange },
      \ 'Delimiter': { 'fg': s:palette.fg },
      \ 'Todo': { 'fg': s:palette.bg, 'bg': s:palette.blue, 'style': 'bold' },
      \ 'Comment': { 'fg': s:palette.comment, 'style': 'italic' },
      \ 'SpecialComment': { 'fg': s:palette.comment, 'style': 'italic' },
      \ 'Ignore': { 'fg': s:palette.gray06 },
      \ 'Underlined': { 'style': 'underline' },
      \ 'Whitespace': { 'fg': s:palette.gray0d },
      \ })

if &diff
  call extend(colors, {
        \ 'CursorLine': { 'style': 'underline' },
        \ 'ColorColumn': { 'style': 'bold' },
        \ })
else
  call extend(colors, {
        \ 'CursorLine': { 'bg': s:palette.gray0d},
        \ 'ColorColumn': { 'bg': s:palette.gray0d },
        \ })
endif
" }}}

" Predefined Highlight Groups: {{{
call extend(colors, {
      \ 'Fg': { 'fg': s:palette.fg, },
      \ 'Gray': { 'fg': s:palette.gray09, },
      \ 'Red': { 'fg': s:palette.red, },
      \ 'Orange': { 'fg': s:palette.orange, },
      \ 'Yellow': { 'fg': s:palette.yellow, },
      \ 'Green': { 'fg': s:palette.green, },
      \ 'Blue': { 'fg': s:palette.blue, },
      \ 'Purple': { 'fg': s:palette.purple, },
      \ 'Teal': { 'fg': s:palette.teal, },
      \
      \ 'RedItalic': { 'fg': s:palette.red, 'style': 'italic' },
      \ 'GrayItalic': { 'fg': s:palette.gray09, 'style': 'italic' },
      \ 'OrangeItalic': { 'fg': s:palette.orange, 'style': 'italic' },
      \ 'YellowItalic': { 'fg': s:palette.yellow, 'style': 'italic' },
      \ 'GreenItalic': { 'fg': s:palette.green, 'style': 'italic' },
      \ 'BlueItalic': { 'fg': s:palette.blue, 'style': 'italic' },
      \ 'PurpleItalic': { 'fg': s:palette.purple, 'style': 'italic' },
      \ 'TealItalic': { 'fg': s:palette.teal, 'style': 'italic' },
      \
      \ 'RedBold': { 'fg': s:palette.red, 'style': 'bold' },
      \ 'GrayBold': { 'fg': s:palette.gray09, 'style': 'bold' },
      \ 'OrangeBold': { 'fg': s:palette.orange, 'style': 'bold' },
      \ 'YellowBold': { 'fg': s:palette.yellow, 'style': 'bold' },
      \ 'GreenBold': { 'fg': s:palette.green, 'style': 'bold' },
      \ 'BlueBold': { 'fg': s:palette.blue, 'style': 'bold' },
      \ 'PurpleBold': { 'fg': s:palette.purple, 'style': 'bold' },
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
    \ 'netrwVersion': { 'link': 'Purple' } ,
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
    \ 'TSBoolean': { 'link': 'Purple' } ,
    \ 'TSCharacter': { 'link': 'Green' } ,
    \ 'TSCharacterSpecial': { 'link': 'SpecialChar' } ,
    \ 'TSComment': { 'link': 'GrayItalic' } ,
    \ 'TSConditional': { 'link': 'PurpleBold' } ,
    \ 'TSConstBuiltin': { 'link': 'PurpleItalic' } ,
    \ 'TSConstMacro': { 'link': 'PurpleItalic' } ,
    \ 'TSConstant': { 'link': 'Fg' } ,
    \ 'TSConstructor': { 'link': 'Green' } ,
    \ 'TSDebug': { 'link': 'Debug' } ,
    \ 'TSDefine': { 'link': 'Define' } ,
    \ 'TSEnvironment': { 'link': 'Macro' } ,
    \ 'TSEnvironmentName': { 'link': 'Type' } ,
    \ 'TSError': { 'link': 'Error' } ,
    \ 'TSException': { 'link': 'Red' } ,
    \ 'TSField': { 'link': 'Orange' } ,
    \ 'TSFloat': { 'link': 'Purple' } ,
    \ 'TSFuncBuiltin': { 'link': 'Green' } ,
    \ 'TSFuncMacro': { 'link': 'BlueBold' } ,
    \ 'TSFunction': { 'link': 'BlueBold' } ,
    \ 'TSFunctionCall': { 'link': 'BlueBold' } ,
    \ 'TSInclude': { 'link': 'PurpleBold' } ,
    \ 'TSKeyword': { 'link': 'PurpleBold' } ,
    \ 'TSKeywordFunction': { 'link': 'PurpleBold' } ,
    \ 'TSKeywordOperator': { 'link': 'PurpleBold' } ,
    \ 'TSKeywordReturn': { 'link': 'PurpleBold' } ,
    \ 'TSLabel': { 'link': 'PurpleBold' } ,
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
    \ 'TSRepeat': { 'link': 'PurpleBold' } ,
    \ 'TSStorageClass': { 'link': 'PurpleBold' } ,
    \ 'TSStorageClassLifetime': { 'link': 'PurpleBold' } ,
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
    \ 'TSTypeQualifier': { 'link': 'PurpleBold' } ,
    \ 'TSVariable': { 'link': 'BlueItalic' } ,
    \ 'TSVariableBuiltin': { 'link': 'PurpleItalic' } ,
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
