import { Suspense } from 'react'
import { usePaginationFragment } from 'react-relay'
import { graphql } from 'relay-runtime'
import { PullRequestCommentList_comment$key } from './__generated__/PullRequestCommentList_comment.graphql'

import { Comment } from '../Comment'
import Button from '../Button'

const query = graphql`
  fragment PullRequestCommentList_comment on PullRequest
  @refetchable(queryName: "PaginatedPullRequestCommentList") {
    comments(after: $cursor, first: $first)
      @connection(key: "PaginatedPullRequestCommentList_comments") {
      edges {
        node {
          ...CommentData
        }
      }
    }
  }
`

export const PullRequestCommentList = ({
  pull,
}: {
  pull: PullRequestCommentList_comment$key
}) => {
  const { data, isLoadingNext, loadNext } = usePaginationFragment(
    query,
    pull
  )
  return (
    <div className="flex flex-col">
      <ul className="list-none list-outside">
        {(data.comments.edges ?? [])
          .map(
            (edge) =>
              edge?.node && (
                <li key={edge?.node?.url || edge.node.id}>
                  <Suspense fallback={'Comment loading...'}>
                    <Comment comment={edge.node} />
                  </Suspense>
                </li>
              )
          )
          .filter(Boolean)}
      </ul>
      {isLoadingNext
        ? 'Loading more...'
        : data.comments.pageInfo.hasNextPage && (
            <Button onClick={() => loadNext(10)}>Load more</Button>
          )}
    </div>
  )
}
