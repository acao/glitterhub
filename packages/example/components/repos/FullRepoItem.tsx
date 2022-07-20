import { useFragment, graphql } from 'react-relay'

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
        nameWithOwner
        description
        homepageUrl
      }
    `,
    repo
  )

  return (
    <div>
        <a
        className="text-base hover:text-1.05rem transition-all duration-300 text-sm dark:bg-transparent"
        key={data?.url}
        href={`/repo/${data?.nameWithOwner}`}
        >
        {data?.nameWithOwner}
        </a>
    </div>
  )
}
