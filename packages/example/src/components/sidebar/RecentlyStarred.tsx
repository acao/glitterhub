import { useLazyLoadQuery, graphql } from 'react-relay'

import { RecentlyStarredQuery } from './__generated__/RecentlyStarredQuery.graphql'

import { RepoItem } from '../repos/RepoItem'

const query = graphql`
  query RecentlyStarredQuery {
    viewer {
      starredRepositories(
        first: 10
        orderBy: { field: STARRED_AT, direction: DESC }
      ) {
        totalCount
        nodes {
          ...RepoItem_meta
        }
      }
    }
  }
`
export default function RecentlyStarred() {
  const data = useLazyLoadQuery<RecentlyStarredQuery>(query, {})
  return (
    <>
      <h2 className="my-6 text-xl">Recently Starred</h2>
        {data?.viewer.starredRepositories.nodes?.map(
          (node, i) =>
            node && <RepoItem key={`${'starred'}-${i}`} repo={node} />
        )}
    </>
  )
}
