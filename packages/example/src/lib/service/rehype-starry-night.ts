import {createStarryNight, common} from 'https://esm.run/@wooorm/starry-night?bundle'
import {visit} from 'https://esm.run/unist-util-visit?bundle'
import {toString} from 'https://esm.run/hast-util-to-string?bundle'

export { common }
/**
 * Plugin to highlight code with `starry-night`.
 *
 */
export function rehypeStarryNight(options = {}) {
  const grammars = options?.grammars || common
  const starryNightPromise = createStarryNight(grammars)
  const prefix = 'language-'

  return async function (tree) {
    const starryNight = await starryNightPromise

    visit(tree, 'element', function (node, index, parent) {
      if (!parent || index === null || node.tagName !== 'pre') {
        return
      }

      const head = node.children[0]

      if (
        !head ||
        head.type !== 'element' ||
        head.tagName !== 'code' ||
        !head.properties
      ) {
        return
      }

      const classes = head.properties.className

      if (!Array.isArray(classes)) return

      const language = classes.find(
        (d) => typeof d === 'string' && d.startsWith(prefix)
      )

      if (typeof language !== 'string') return

      const scope = starryNight.flagToScope(language.slice(prefix.length))

      // Maybe warn?
      if (!scope) return

      const fragment = starryNight.highlight(toString(head), scope)
      const children = /** @type {Array<ElementContent>} */ (fragment.children)

      parent.children.splice(index, 1, {
        type: 'element',
        tagName: 'div',
        properties: {
          className: [
            'source-language',
            'source-language-' + scope.replace(/^source\./, '').replace(/\./g, '-')
          ]
        },
        children: [{type: 'element', tagName: 'pre', properties: {}, children}]
      })
    })
  }
}