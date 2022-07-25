import React, { useState, useContext, PropsWithChildren } from 'react'
import { githubLogin } from './github-login'

type LoginContext = {
  token?: string
  setToken?: React.Dispatch<string>
  // login: (code: string) => Promise<void>
}

const Context = React.createContext<LoginContext>(undefined as any)

type Props = PropsWithChildren

export const LoginContextProvider: React.FC<Props> = ({ children }) => {
  const [token, setToken] = useState<string>(null)
  return (
    <Context.Provider
      value={{
        token,
        setToken,
        // login: async (code: string) => {
        //   const tok = await githubLogin(code)
        //   if (tok) {
        //     setToken(tok)
        //   } else {
        //     console.error('login not successful')
        //   }
        // },
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useLoginContext = () => {
  const LoginContext = useContext(Context)
  return LoginContext
}
