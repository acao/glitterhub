import React, { Suspense, useEffect } from 'react'
import { graphql, usePaginationFragment } from 'react-relay'
import Button from '~/components/Button'
import PullRequestComponent from '~/components/prs/PullRequest'
import type { PullRequestList_repository$key } from './__generated__/PullRequestList_repository.graphql'

interface Props {
  repository: PullRequestList_repository$key
}
const tabClass = (open: boolean) =>
  `inline-flex pr-2 pl-2 border hover:border hover:border-black dark:hover:border-#eee cursor-pointer ${
    open ? 'dark:border-#eee' : 'border-transparent'
  }`

// Component that renders the list of issues for the repository using Relay's `usePaginationFragment()`.
const PullRequestListComponent: React.FC<Props> = ({ repository }) => {
  const { data, loadNext, isLoadingNext, refetch } = usePaginationFragment(
    graphql`
      fragment PullRequestList_repository on Repository
      @refetchable(queryName: "PullRequestListPaginationQuery") {
        openPullRequests: pullRequests(states: [OPEN]) {
          count: totalCount
        }
        mergedPullRequests: pullRequests(states: [MERGED]) {
          count: totalCount
        }
        closedPullRequests: pullRequests(states: [CLOSED]) {
          count: totalCount
        }
        nameWithOwner
        pullRequests(
          after: $cursor
          first: $first
          orderBy: { field: CREATED_AT, direction: DESC }
          states: $states
        ) @connection(key: "Repo_pullRequests") {
          edges {
            node {
              ...PullRequest_data
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `,
    repository
  )

  const [prStates, setStateFilter] = React.useState<
    ('OPEN' | 'CLOSED' | 'MERGED')[] | null
  >(null)

  useEffect(() => {
    if (prStates) {
      React.startTransition(() => {
        refetch({ states: prStates })
      })
    }
  }, [prStates])
  return (
    <div className="py-4">
      <div className="mb-1">
        <span
          className={tabClass(!!prStates?.includes('OPEN'))}
          onClick={() => setStateFilter(['OPEN'])}
        >
          open: {data?.openPullRequests?.count}
        </span>{' '}
        <span
          className={tabClass(!!prStates?.includes('MERGED'))}
          onClick={() => setStateFilter(['MERGED'])}
        >
          merged: {data?.mergedPullRequests?.count}
        </span>
        <span
          className={tabClass(!!prStates?.includes('CLOSED'))}
          onClick={() => setStateFilter(['CLOSED'])}
        >
          {' '}
          closed: {data?.closedPullRequests?.count}
        </span>
      </div>
      <ul className="list-none list-outside">
        {(data.pullRequests.edges ?? [])
          .map(
            (edge) =>
              edge?.node && (
                <li key={ edge.node.id ?? edge?.node?.url} className="card">
                  <Suspense fallback={'PR loading...'}>
                    <PullRequestComponent
                      pull={edge.node}
                      nameWithOwner={data.nameWithOwner}
                    />
                  </Suspense>
                </li>
              )
          )
          .filter(Boolean)}
      </ul>
      {isLoadingNext
        ? 'Loading more...'
        : data.pullRequests.pageInfo.hasNextPage && (
            <Button onClick={() => loadNext(10)}>Load more</Button>
          )}
    </div>
  )
}

export default PullRequestListComponent
