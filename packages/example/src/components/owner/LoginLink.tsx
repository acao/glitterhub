import React from 'react'

type Props = {
    login: string
}

const LoginLink: React.FC<Props> = ({ login }) => {
    return <a href={`/${login}`}>@{login}</a>
}

export default LoginLink