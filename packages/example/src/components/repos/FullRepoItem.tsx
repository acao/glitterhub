import { useFragment, graphql } from 'react-relay'
import Label from '../Label'
import RepoLink from './RepoLink'

import type { RepoItem_meta$key } from './__generated__/RepoItem_meta.graphql'

interface Props {
    repo: RepoItem_meta$key
}

export const FullRepoItem : React.FC<Props> = ({ repo }) => {
  const data = useFragment(
    graphql`
      fragment FullRepoItem_meta on Repository {
        name
        url
        owner {
          login
        }
        nameWithOwner
        isFork
        isPrivate
        isArchived
        updatedAt
        isLocked
        stargazerCount
        forkCount
        watchers {
          count: totalCount
        }
        primaryLanguage {
          name
          color
        }
      }
    `,
    repo
  )

  return (
    <div>
      <RepoLink repo={data} size="sml" labelSize='sm' />
    </div>
    
  )
}
export default FullRepoItem