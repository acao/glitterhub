import React from 'react'
import { useFragment, graphql } from 'react-relay'
import LoginLink from './LoginLink'
import { Avatar$key } from './__generated__/Avatar.graphql'

interface Props {
  user: Avatar$key,
  isOrg?: true
  width?: string
}

const query = graphql`
  fragment Avatar on User {
    avatarUrl
    name
    login
  }
  
`
const orgQuery = graphql`
  fragment AvatarOrg on Organization {
    avatarUrl
    name
    login
  }
`

const widths  = ['w-32', 'w-64', 'w-16', 'w-8'];


const Avatar: React.FC<Props> = ({ user, isOrg, width }) => {
  if(width && !widths.includes(width)) {
    throw Error (`width prop must be one of ${widths.join(',')}`)
  }
  const owner = useFragment(isOrg ? orgQuery : query, user)
  return (
    <div>
      <img className={`${width ?? 'w-32'} rounded-full inline-flex mr-2`} src={owner.avatarUrl} />

      {owner.name ? (
        <a href={`/${owner.login}`}>
          {owner.name} (@{owner.login})
        </a>
      ) : (
        <LoginLink login={owner.login} />
      )}
    </div>
  )
}

export default Avatar
