import { useEffect, useState } from 'react'
import { useAsync } from 'react-async-hook'
import { defineVilay } from 'vilay'
import { usePageContext } from 'renderer/usePageContext'
import { githubLogin } from '~/lib/service/github-login'
import { useLoginContext } from '~/lib/service/useLoginContext'


const FF_AUTH = import.meta.env.FF_AUTH

export default defineVilay({
  // Basic data fetching example using Relay.
  Page: ({ queryRef }) => {

    if(!FF_AUTH) {
      return <div>Welcome to glitterhub!</div>
    }
    // This will either pull the preloaded data or suspend.
    const page = usePageContext()

    const user = useLoginContext()

    const [code, setCode] = useState(null)


    useEffect(() => {
      if (!code) {
        console.log('set code', page)
        setCode(page?.urlParsed?.search?.code)
      }
    }, [page?.urlParsed?.search?.code])

    if (user || !user?.token) {
      const result = useAsync(githubLogin, [code])

      if (result.loading) {
        return <div>Logging in</div>
      }
      if (result.error) {
        return <div>{result.error.toString()}</div>
      }
      if (result.result && user) {
        user.setToken(result.result.token)
        page.navigate(result.result.login)
        return (
          <div>
            <h1>Welcome, {result.result?.login}</h1>
          </div>
        )
      }
    }

    // login time!

    return (
      <div>
        <h1>
          Please, <a href="https://github-oauth.glitterhub.org">login!</a>
        </h1>
      </div>
    )
  },
})
