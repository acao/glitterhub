import { useFragment, graphql } from 'react-relay'

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
        owner {
          login
        }
      }
    `,
    repo
  )

  return (
    <span className="text-base hover:text-1.05rem transition-all duration-300 text-sm">
    <a
      href={`/${data?.owner?.login}`}
    >
      {data?.owner?.login} 
    </a>
    {""}/{""}
    <a
      href={`/${data?.owner?.login}/${data?.name}`}
    >
      {data?.name} 
    </a>
    </span>
  )
}
