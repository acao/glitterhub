import { defineVilay } from 'vilay'
import { PageLayout } from './PageLayout'
import { initRelayEnvironment } from './RelayEnvironment'

export default defineVilay({
  // Export that has the name `PageLayout` is used as the layout component
  PageLayout,
  // Export that has the name `initRelayEnvironment` is used for initializing Relay Environment
  initRelayEnvironment,
  // Application-wide <head> tags
  // Meta tags are inserted as <meta name="${KEY}" content="${VALUE}">.
  // Other tags are inserted as <${KEY}>${VALUE}</${KEY}>.
  getPageHead: () => ({
    title: 'Vite SSR app',
    meta: {
      description: 'App using Vite + vite-plugin-ssr',
    },
  }),
  // // @ts-expect-error hah
  // createInitialContextFromRequest: async (initialContext, req) => {
  //   if (req.url === '/' || req.url === '') {
  //     const code = new URL(req.url).searchParams.get('code')
  //     if (code) {
  //       const { token, error } = await githubOauthWithCallback(code)
  //       // maybe do more stuff to look up user data before the render
  //       if (token) {
  //         return {
  //           ...initialContext,
  //           token,
  //         }
  //       }
  //       if (error) {
  //         return {
  //           error,
  //           ...initialContext,
  //         }
  //       }
  //     }
  //   }
  // },
})
