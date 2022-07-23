import { Suspense } from 'react'
import { useLazyLoadQuery, graphql } from 'react-relay'
import { RepoItem } from '../repos/RepoItem'

import { MyReposQuery } from './__generated__/MyReposQuery.graphql'

const query = graphql`
  query MyReposQuery {
    viewer {
      repositories(first: 10, orderBy: { field: STARGAZERS, direction: DESC }) {
        nodes {
          ...RepoItem_meta
        }
      }
    }
  }
`
export default function MyRepos() {
  const data = useLazyLoadQuery<MyReposQuery>(query, {})
  return (
    <>
      <h2 className="my-6 text-xl">My Repos</h2>
      <Suspense loading="Repos...">
        {data?.viewer.repositories.nodes?.map(
          (node, i) =>
            node && <RepoItem key={`${'my-repos'}-${i}`} repo={node} />
        )}
        </Suspense>
    </>
  )
}
