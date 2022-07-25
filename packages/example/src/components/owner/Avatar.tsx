import React from 'react'
import { useFragment, graphql } from 'react-relay'
import Label from '../Label'
import LoginLink from './LoginLink'
import { Avatar$key } from './__generated__/Avatar.graphql'

interface Props {
  user: Avatar$key
  isOrg?: true
  width?: string
  stacked?: true
}

const query = graphql`
  fragment Avatar on User {
    avatarUrl
    name
    login
    isViewer
    isFollowingViewer
  }
`
const orgQuery = graphql`
  fragment AvatarOrg on Organization {
    avatarUrl
    name
    login
  }
`

const Avatar: React.FC<Props> = ({ user, isOrg, width, stacked }) => {
  const owner = useFragment(isOrg ? orgQuery : query, user)

  const Image = () => (
    <img className={`rounded-full ${width ?? 'w-32'}`} src={owner.avatarUrl} />
  )
  const stackedClass = stacked ? 'column' : 'row'
  const StackedWrapper = ({ children }) =>
    stacked ? (
      <div className="display-flex-row">{children}</div>
    ) : (
      <>{children}</>
    )

  const Link = ({ children }) => <a href={`/${owner.login}`}>{children} </a>
  return (
    <span className='display-inline-block'>
      <span className="flex flex-row">
        {owner.name ? (
          <>
            <span className={'flex flex-column self-start p1'}>
              <Link>
                <Image />
              </Link>
            </span>
            <span className="flex flex-column items-center">
              <StackedWrapper>
                <span className={`p1 flex flex-${stackedClass}`}>
                  <Link>{owner.name}</Link>
                </span>
                <span className={`p1 flex-${stackedClass}`}>
                  <Link>@{owner.login}</Link>
                </span>
              </StackedWrapper>
            </span>
          </>
        ) : (
          <LoginLink login={owner.login}>
            <Image />
          </LoginLink>
        )}
      <span className="flex flex-column items-center items-start">
        <span>
          {owner.isViewer && <Label name="You" />}
          {owner.isFollowingViewer && <Label name="Follows You" />}
        </span>
      </span>
    </span>
    </span>
  )
}

export default Avatar
