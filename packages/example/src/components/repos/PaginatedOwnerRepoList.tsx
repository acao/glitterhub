import React, { Suspense, useEffect } from 'react'
import { graphql, usePaginationFragment } from 'react-relay'
import Button from '../Button'
import FullRepoItem from './FullRepoItem'
import type { PaginatedOwnerRepoList_owner$key } from './__generated__/PaginatedOwnerRepoList_owner.graphql'

interface Props {
  owner: PaginatedOwnerRepoList_owner$key
  isOrg?: boolean
}
// const tabClass = (open: boolean) =>
//   `inline-flex pr-2 pl-2 border hover:border hover:border-black dark:hover:border-#eee cursor-pointer ${
//     open ? 'dark:border-#eee' : 'dark:border-black'
//   }`

const query = graphql`
  fragment PaginatedOwnerRepoList_owner on User
  @refetchable(queryName: "PaginatedOwnerRepoList") {
    filteredRepos: repositories(first: $first, after: $cursor)
      @connection(key: "PaginatedOwnerRepoList_filteredRepos") {
      edges {
        node {
          ...FullRepoItem_meta
        }
      }
    }
  }
`
const orgQuery = graphql`
  fragment PaginatedOwnerRepoListOrg_owner on Organization
  @refetchable(queryName: "PaginatedOwnerRepoListOrg") {
    filteredRepos: repositories(first: $first, after: $cursor)
      @connection(key: "PaginatedOrgOwnerRepoList_filteredRepos") {
      edges {
        node {
          ...FullRepoItem_meta
        }
      }
    }
  }
`

// Component that renders the list of issues for the owner using Relay's `usePaginationFragment()`.
const PaginatedOwnerRepoList: React.FC<Props> = ({ owner, isOrg }) => {
  const { data, loadNext, isLoadingNext, refetch } = usePaginationFragment(
    isOrg ? orgQuery : query,
    owner
  )
  const filteredRepos = data
  console.log(filteredRepos)
  if(!data) {
    return null
  }

  // const [prStates, setStateFilter] = React.useState<
  //   ('OPEN' | 'CLOSED' | 'MERGED')[]
  // >(['OPEN'])

  // useEffect(() => {
  //   if (prStates) {
  //     React.startTransition(() => {
  //       refetch({ states: prStates })
  //     })
  //   }
  // }, [prStates])
  return (
    <div className="py-4">
      {/* <div className="mb-1">
        <span
          className={tabClass(!!prStates.includes('OPEN'))}
          onClick={() => setStateFilter(['OPEN'])}
        >
          open: {data?.openPullRequests?.count}
        </span>{' '}
        <span
          className={tabClass(!!prStates.includes('MERGED'))}
          onClick={() => setStateFilter(['MERGED'])}
        >
          merged: {data?.mergedPullRequests?.count}
        </span>
        <span
          className={tabClass(!!prStates.includes('CLOSED'))}
          onClick={() => setStateFilter(['CLOSED'])}
        >
          {' '}
          closed: {data?.closedPullRequests?.count}
        </span>
      </div> */}

      <Suspense fallback={'Repo loading...'}>
        <ul className="list-none list-outside">
          {(data?.filteredRepos?.edges ?? [])
            .map(
              (edge) =>
                edge?.node && (
                  <li key={edge?.node?.url || edge.node.id} className="card">
                    <FullRepoItem repo={edge.node} />
                  </li>
                )
            )
            .filter(Boolean)}
        </ul>
        {isLoadingNext
          ? 'Loading more...'
          : data.filteredRepos.pageInfo.hasNextPage && (
              <Button onClick={() => loadNext(10)}>Load more</Button>
            )}
      </Suspense>
    </div>
  )
}

export default PaginatedOwnerRepoList
