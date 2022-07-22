import { useFragment, graphql } from 'react-relay'
import Label from '../Label'

import type { RepoItem_meta$key } from './__generated__/RepoItem_meta.graphql'

interface Props {
    repo: RepoItem_meta$key
}

export const RepoItem : React.FC<Props> = ({ repo }) => {
  const data = useFragment(
    graphql`
      fragment RepoItem_meta on Repository {
        name
        url
        nameWithOwner
        isFork
        isPrivate
      }
    `,
    repo
  )

  return (
    <a
      className="text-base hover:text-1.05rem transition-all duration-300 text-sm"
      href={`/${data?.nameWithOwner}`}
    >
      {data?.nameWithOwner} 
    </a>
  )
}
