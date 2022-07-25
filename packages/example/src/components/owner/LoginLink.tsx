import React, { PropsWithChildren } from 'react'

type Props = {
    login: string
} & PropsWithChildren

const LoginLink: React.FC<Props> = ({ login, children }) => {
    return <a href={`/${login}`}>{children}@{login}</a>
}

export default LoginLink