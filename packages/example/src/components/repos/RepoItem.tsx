import { useFragment, graphql } from 'react-relay'
import { usePageContext } from 'vilay'

import type { RepoItem_meta$key } from './__generated__/RepoItem_meta.graphql'

interface Props {
  repo: RepoItem_meta$key
}

export const RepoItem: React.FC<Props> = ({ repo }) => {
  const data = useFragment(
    graphql`
      fragment RepoItem_meta on Repository {
        nameWithOwner
        isFork
        isPrivate
      }
    `,
    repo
  )

  const [owner, name] = data.nameWithOwner.split('/')

  const { urlPathname } = usePageContext()

  const repoPath = `/${data.nameWithOwner}`
  return (
    <span
      className={`text-base transition-all duration-300 text-sm border-b border-transparent  ${
        urlPathname.startsWith(repoPath) ?? 'dark:border-light border-dark'
      }`}
    >
      <a className={`hover:text-1.05rem `} href={`/${owner}`}>
        {owner}
      </a>
      {''}/{''}
      <a className="hover:text-1.05rem" href={`/${owner}/${name}`}>
        {name}
      </a>
    </span>
  )
}
