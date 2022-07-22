import { marked } from 'marked'

import { createStarryNight, common } from '@wooorm/starry-night'
import langElixir from '@wooorm/starry-night/lang/source.elixir'
import langErlang from '@wooorm/starry-night/lang/source.erlang'
import langToml from '@wooorm/starry-night/lang/source.toml'
import langProto from '@wooorm/starry-night/lang/source.proto'
import langTextProto from '@wooorm/starry-night/lang/source.textproto'

import { toHtml } from 'hast-util-to-html'

const starryNight = await createStarryNight([
  ...common,
  langElixir,
  langErlang,
  langToml,
  langProto,
  langTextProto
])

marked.setOptions({
  // renderer: new marked.Renderer(),
  langPrefix: 'highlight highlight-source-',
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
  highlight: (value, lang) => {
    const scope = starryNight.flagToScope(lang)

    return toHtml({
      type: 'element',
      tagName: 'pre',
      properties: {
        className: scope
          ? [
              'highlight',
              'highlight-' + scope.replace(/^source\./, '').replace(/\./g, '-'),
            ]
          : undefined,
      },
      children: scope
        ? starryNight.highlight(value, scope).children
        : [{ type: 'text', value }],
    })
  },
})

export function parseMarkdown(text: string) {
  return marked.parse(text)
}
