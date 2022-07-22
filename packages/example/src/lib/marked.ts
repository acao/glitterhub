import { useAsync } from 'react-async-hook'

const parseMarkdown = async (text) => {
  const marked = await import('marked')
  // const { toHtml } = await import('hast-util-to-html')
  // const { createStarryNight, common } = await import('@wooorm/starry-night')
  // const { default: langElixir } = await import(
  //   '@wooorm/starry-night/lang/source.elixir'
  // )
  // const { default: langErlang } = await import(
  //   '@wooorm/starry-night/lang/source.erlang'
  // )
  // const { default: langToml } = await import(
  //   '@wooorm/starry-night/lang/source.toml'
  // )
  // const { default: langProto } = await import(
  //   '@wooorm/starry-night/lang/source.proto'
  // )
  // const { default: langTextProto } = await import(
  //   '@wooorm/starry-night/lang/source.textproto'
  // )

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
    // highlight: (value, lang, cb) => {
    //   createStarryNight([
    //     ...common,
    //     langElixir,
    //     langErlang,
    //     langToml,
    //     langProto,
    //     langTextProto,
    //   ]).then((starryNight) => {
    //     const scope = starryNight.flagToScope(lang)

    //     cb(
    //       null,
    //       toHtml({
    //         type: 'element',
    //         tagName: 'pre',
    //         properties: {
    //           className: scope
    //             ? [
    //                 'highlight',
    //                 'highlight-' +
    //                   scope.replace(/^source\./, '').replace(/\./g, '-'),
    //               ]
    //             : undefined,
    //         },
    //         children: scope
    //           ? starryNight.highlight(value, scope).children
    //           : [{ type: 'text', value }],
    //       })
    //     )
    //   })
    // },
  })
  return marked.parse(text)
}
export function useMarkdown(text: string) {
  if (!text) {
    return null
  }

  const result = useAsync(parseMarkdown, [text])


  return result
}
