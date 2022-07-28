import { useFragment, graphql } from 'react-relay'
import Label from '~/components/Label'
import RepoLink from './RepoLink'

import type { FullRepoItem_meta$key } from './__generated__/FullRepoItem_meta.graphql'

interface Props {
  repo: FullRepoItem_meta$key
}

export const FullRepoItem: React.FC<Props> = ({ repo }) => {
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
    <div className="min-h-34px">
      <RepoLink repo={data} size="l" labelSize="xs" />
      <Label
        size={'xs'}
        name={`${data.stargazerCount} ✨`}
        color="#1c1c"
      />
      <Label
        size={'xs'}
        name={`${data.watchers.count} 👀`}
        color="#aaa"
      />
      <Label
        size={'xs'}
        name={`${data.forkCount} 🍴`}
        color="#3366c3"
      />
      {data?.primaryLanguage && <Label
        size={'xs'}
        name={data?.primaryLanguage?.name}
        color={data?.primaryLanguage?.color}
      />}
      
    </div>
  )
}
export default FullRepoItem
