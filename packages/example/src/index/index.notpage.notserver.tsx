import { githubLogin } from '~/lib/service/github-login'

export { onBeforeRender }

async function onBeforeRender(pageContext) {
  if (!pageContext?.user && pageContext?.urlParsed?.search.code) {
    try {
      const user = await githubLogin(pageContext?.urlParsed?.search.code)

      if (user?.token) {
        return {
          pageContext: {
            documentHtml: null,
            redirectTo: `/${user?.login}`,
            user,
          },
        }
      } else {

        return {
          pageContext: {
            documentHtml: null,
            redirectTo: '/',
            error: user?.error ?? 'n/a',
          },
        }
      }
    } catch (err) {
      console.log('NO TOKEN s')
      console.error(err)
      return {
        pageContext: {
          documentHtml: null,
          redirectTo: '/glitterhub',
          error: err?.message,
        },
      }
    }
  }
  return {
    pageContext: {
      redirectTo: '/',
    },
  }
}
