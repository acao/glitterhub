
export async function githubLogin(
  code: string
): Promise<{ token: string; login: string } | { error: string }> {
  console.log({ code })
  if(!code) {
    return { error: 'no code provided'}
  }

  try {
    const response = await fetch('https://github-oauth.glitterhub.org/', {
      method: 'POST',
      mode: import.meta.env.DEV ? "cors" : undefined,
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ code }),
    })

    const text = await response.text()

    console.log('response', text)

    const result = JSON.parse(text)

    if (result.error) {
      return { error: result.error }
    }
    console.log('got the token!')
    const getUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        accept: 'application/vnd.github.v3+json',
        authorization: `token ${result.token}`,
      },
    })
    const { login } = await getUserResponse.json()
    if(!import.meta.env.SSR) {
      window.localStorage.set('user.token', result.token)
      window.localStorage.set('user.login', login)
    }
    return { token: result.token, login }
  } catch (err) {
    console.error(err)
    return { error: err.message }
  }
}
