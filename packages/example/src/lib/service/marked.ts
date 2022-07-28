import { useAsync } from 'react-async-hook'

// import rehypeHighlight from 'rehype-highlight'
// import ts from 'highlight.js/lib/languages/typescript'
// we already get these back as HTML fields,
// such as bioHTML or bodyHTML
// import remarkFrontmatter from 'remark-frontmatter'
// import remarkGithub from 'remark-github'
// import remarkBreaks from 'remark-breaks'

const paths = ['commits', 'issues', 'pulls', 'branches', 'releases']

export const parseMarkdown = async (text, nameWithOwner, defaultBranch) => {
  if (!text || text == '') {
    return ''
  }

  const { unified } = await import('unified')
  const { default: remarkParse } = await import('https://esm.run/remark-parse')
  const { default: remarkGfm } = await import('https://esm.run/remark-gfm')
  const { default: remarkRehype } = await import(
    'https://esm.run/remark-rehype'
  )
  const { default: rehypeStringify } = await import(
    'https://esm.run/rehype-stringify'
  )
  const { default: remarkGemoji } = await import(
    'https://esm.run/remark-gemoji'
  )
  const { default: rehypeSlug } = await import('https://esm.run/rehype-slug')
  const { default: rehypeUrls } = await import('https://esm.run/rehype-urls')
  const { default: rehypeLinkHeadings } = await import(
    'https://esm.run/rehype-autolink-headings'
  )
  const { rehypeStarryNight, common } = await import('./rehype-starry-night.js')

  console.log(nameWithOwner, defaultBranch)

  // TODO: hast-util-to-html bloats the bundle size so much that it gets rejected by CFW!
  // remark instead of marked,  and remark-rehype would be a much better combination to solve this problem.
  // they already solve this problem of "universal" markdown rendering quite efficiently

  // the reason we need HAST to html is so that we can convert the starry night output from HAST to html
  // for the code syntax highlight replacements. then the github markdown css will just work.
  //
  // another way to get this output is to POST to an api.github.com/markdown or some such route,
  // which could also be done universally but might be slower

  // perhaps we should forget server side processing of the code blocks and instead use monaco to load them?

  // bloats the bundle, need to use lowlight!
  const { default: langElixir } = await import(
    'https://esm.run/@wooorm/starry-night/lang/source.elixir'
  )
  const { default: langErlang } = await import(
    'https://esm.run/@wooorm/starry-night/lang/source.erlang'
  )
  const { default: langToml } = await import(
    'https://esm.run/@wooorm/starry-night/lang/source.toml'
  )
  const { default: langProto } = await import(
    'https://esm.run/@wooorm/starry-night/lang/source.proto'
  )
  const { default: langTextProto } = await import(
    'https://esm.run/@wooorm/starry-night/lang/source.textproto'
  )

  const file = await unified()
    .use(remarkParse)

    .use(remarkGfm)
    // .use(remarkGithub)
    // .use(remarkFrontmatter)
    .use(remarkGemoji)
    .use(remarkRehype)

    .use(rehypeStarryNight, {
      grammars: [
        ...common,
        langElixir,
        langErlang,
        langToml,
        langProto,
        langTextProto,
      ],
    })
    .use(rehypeSlug)
    .use(rehypeUrls, (url, node) => {
      if(!url.host || url?.host === 'github.com') {
        if(url?.pathname && url?.pathname?.split('.').length > 1) {
          return `https://github.com/${nameWithOwner}/raw/${defaultBranch}${
            url.path.startsWith('/') ? `${url.path}` : `/${url.path}`
          }`
        }
        return url.path
      }
      // if (url?.host === 'github.com') {
      //   // if (url.href == '.md' &&
      //   //   url?.path?.startsWith(`/${nameWithOwner}`)
      //   // ) {
      //   //   return `${nameWithOwner}/${defaultBranch}/${url.path}`
      //   // }
      //   return url.path
      // }
      // if(!url?.host) {
      //   if(url?.path?.beginsWith(nameWithOwner)) {
      //     console.log(url.path)
      //   }
      // }
      // if(!url.host && url.path.beginsWith(`/${nameWithOwner}`)) {
      //   return `/${nameWithOwner}/${defaultBranch}/${url.path}`
      // }
      // if(!url.host && !url.path.beginsWith('/')) {

      //   return `/${nameWithOwner}/${defaultBranch}/${url.path}`
      // }
    })
    .use(rehypeLinkHeadings)

    .use(rehypeStringify)
    .process(text)
  return file
}
export function useMarkdown(
  text: string,
  nameWithOwner: string,
  defaultBranch: string
) {
  if (!text) {
    return null
  }

  const result = useAsync(async () => {
    const result = await parseMarkdown(text, nameWithOwner, defaultBranch)
    return result
  }, [text])

  return result
}
