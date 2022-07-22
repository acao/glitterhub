import React, { Suspense, useEffect } from 'react'
import { graphql, usePaginationFragment } from 'react-relay'
import Button from '../Button'
import FullRepoItem from './FullRepoItem'
import type { PaginatedOwnerRepoList_owner$key } from './__generated__/PaginatedOwnerRepoList_owner.graphql'

interface Props {
  owner: PaginatedOwnerRepoList_owner$key
  isOrg?: boolean
  pageLength?: number
}
// const tabClass = (open: boolean) =>
//   `inline-flex pr-2 pl-2 border hover:border hover:border-black dark:hover:border-#eee cursor-pointer ${
//     open ? 'dark:border-#eee' : 'dark:border-black'
//   }`

const query = graphql`
  fragment PaginatedOwnerRepoList_owner on User
  @refetchable(queryName: "PaginatedOwnerRepoList") {
    filteredRepos: repositories(
      first: $first
      after: $cursor
      orderBy: $orderBy
    ) @connection(key: "PaginatedOwnerRepoList_filteredRepos") {
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
    filteredRepos: repositories(
      first: $first
      after: $cursor
      orderBy: $orderBy
    ) @connection(key: "PaginatedOrgOwnerRepoList_filteredRepos") {
      edges {
        node {
          ...FullRepoItem_meta
        }
      }
    }
  }
`
{
  /* <option value="CREATED_AT:ASC">Created (Ascending)</option>
            <option value="CREATED_AT:DESC">Created (Descending)</option>
            <option value="PUSHED_AT:ASC">Pushed (Ascending)</option>
            <option value="PUSHED_AT:DESC">Pushed (Descending)</option>
            <option value="UPDATED_AT:ASC">Updated (Ascending)</option>
            <option value="UPDATED_AT:DESC">Updated (Descending)</option>
            <option value="STARGAZERS:ASC">Stargazers (Ascending)</option>
            <option value="STARGAZERS:DESC">Stargazers (Descending)</option> */
}
const sortOptions = [
  'CREATED_AT',
  'UPDATED_AT',
  'PUSHED_AT',
  'STARGAZERS',
].reduce(
  (i, opt) => [
    ...i,
    { value: `${opt}:ASC`, label: opt.toLocaleLowerCase().replace('_', ' ') + ' (ascending)' },
    { value: `${opt}:DESC`, label: opt.toLocaleLowerCase().replace('_', ' ') + ' (descending)' },
  ],
  []
)

// Component that renders the list of issues for the owner using Relay's `usePaginationFragment()`.
const PaginatedOwnerRepoList: React.FC<Props> = ({
  owner,
  isOrg,
  pageLength = 10,
}) => {
  const { data, loadNext, isLoadingNext, refetch } = usePaginationFragment(
    isOrg ? orgQuery : query,
    owner
  )
  if (!data) {
    return null
  }

  // const [repoSort, setRepoSort] = React.useState<string>('UPDATED_AT:ASC')

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
        <div className="mb-6">
          <label htmlFor="owner--repo-sort">Sort by</label>
          <select
            className='ml-2 border rounded-1'
            name="owner--repo-sort"
            placeholder="Sort by"
            defaultValue={"UPDATED_AT:ASC"}
            onChange={(event) => {
              console.log('change')
           
              const [field, direction ] = event.target.value.split(':')
              
              console.log({field,direction})
              refetch({ orderBy: {field, direction} })
              // setRepoSort(event.target.value)
            }}
          >
            {sortOptions.map((opt) => {
              return (
                <option value={opt.value}>
                  {opt.label}
                </option>
              )
            })}
          </select>
        </div>
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
              <Button onClick={() => loadNext(pageLength)}>Load more</Button>
            )}
      </Suspense>
    </div>
  )
}

export default PaginatedOwnerRepoList
