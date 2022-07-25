import { Suspense } from 'react'
import { useFragment, usePaginationFragment } from 'react-relay'
import { graphql } from 'relay-runtime'
import Avatar from '../owner/Avatar'
import { CommentData$key } from '../__generated__/CommentData.graphql'
import { IssueCommentList_comment$key } from './__generated__/IssueCommentList_comment.graphql'

import { Comment } from '../Comment'
import Button from '../Button'

const query = graphql`
  fragment IssueCommentList_comment on Issue
  @refetchable(queryName: "PaginatedIssueCommentList") {
    comments(after: $cursor, first: $first)
      @connection(key: "PaginatedIssueCommentList_comments") {
      edges {
        node {
          ...CommentData
        }
      }
    }
  }
`

export const IssueCommentList = ({
  issue,
}: {
  issue: IssueCommentList_comment$key
}) => {
  const { data, isLoadingNext, loadNext } = usePaginationFragment(
    query,
    issue
  )
  const comments = data?.comments
  return (
    <div className="flex flex-col">
      <ul className="list-none list-outside">
        {(comments.edges ?? [])
          .map(
            (edge) =>
              edge?.node && (
                <li key={edge.node.id}>
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
        : comments.pageInfo.hasNextPage && (
            <Button onClick={() => loadNext(10)}>Load more</Button>
          )}
    </div>
  )
}
