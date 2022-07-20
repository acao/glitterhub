import React, { Suspense, useReducer, Reducer, useEffect, useState } from 'react'
import { graphql, usePaginationFragment } from 'react-relay'
import Button from '../Button'
import IssueComponent from './Issue'
import type { IssueList_repository$key } from './__generated__/IssueList_repository.graphql'

interface Props {
  repository: IssueList_repository$key
}
const tabClass = (open: boolean) =>
  `inline-flex pr-2 pl-2 border hover:border hover:border-black dark:hover:border-#eee cursor-pointer ${
    open ? 'dark:border-#eee' : 'dark:border-black'
  }`

// Component that renders the list of issues for the repository using Relay's `usePaginationFragment()`.
const IssueListComponent: React.FC<Props> = ({ repository }) => {
  const { data, loadNext, isLoadingNext, refetch } = usePaginationFragment(
    graphql`
      fragment IssueList_repository on Repository
      @refetchable(queryName: "IssueListPaginationQuery") {
        openIssues: issues(filterBy: { states: [OPEN] }) {
          count: totalCount
        }
        closedIssues: issues(filterBy: { states: [CLOSED] }) {
          count: totalCount
        }
        nameWithOwner
        issues(
          after: $cursor
          first: $first
          orderBy: { field: CREATED_AT, direction: DESC }
          filterBy: $filter
        ) @connection(key: "issuesPageQuery_issues") {
          edges {
            node {
              ...Issue_issue
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


  const [issueStates, setStateFilter] = useState<('OPEN' | 'CLOSED')[]>(['OPEN'])

  useEffect(() => {
    if(issueStates) {
      React.startTransition(() => {
        refetch({ filter: { states: issueStates }})
      })
    }
  }, [issueStates])


  return (
    <div className="py-4">
      <div className="mb-1">
        <span
          className={tabClass(!!issueStates.includes('OPEN'))}
          onClick={() => setStateFilter(['OPEN'])}
        >
          open: {data?.openIssues?.count}{' '}
        </span>
        <span
          className={tabClass(!!issueStates.includes('CLOSED'))}
          onClick={() => setStateFilter(['CLOSED'])}
        >
          {' '}
          closed: {data?.closedIssues?.count}
        </span>
      </div>
      <ul className="list-none">
        {(data.issues.edges ?? [])
          .map(
            (edge, i) =>
              edge?.node && (
                <li key={edge.node.url} className="">
                  <Suspense fallback={'Issue loading...'}>
                    <IssueComponent issue={edge.node} nameWithOwner={data.nameWithOwner} />
                  </Suspense>
                </li>
              )
          )
          .filter(Boolean)}
      </ul>
      {isLoadingNext
        ? 'Loading more...'
        : data.issues.pageInfo.hasNextPage && (
            <Button onClick={() => loadNext(10)}>Load more</Button>
          )}
    </div>
  )
}

export default IssueListComponent
