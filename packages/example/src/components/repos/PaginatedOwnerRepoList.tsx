import React, { Suspense } from 'react'
import { graphql, usePaginationFragment } from 'react-relay'
import Button from '~/components/Button'
import FullRepoItem from './FullRepoItem'

import { PaginatedOwnerRepoList_owner$key } from './__generated__/PaginatedOwnerRepoList_owner.graphql'

type Props = {
  owner: PaginatedOwnerRepoList_owner$key
  pageLength: number
}

const sortOptions = [
  'CREATED_AT',
  'UPDATED_AT',
  'PUSHED_AT',
  'STARGAZERS',
].reduce(
  (i, opt) => [
    ...i,
    {
      value: `${opt}:ASC`,
      label: opt.toLocaleLowerCase().replace('_', ' ') + ' (ascending)',
    },
    {
      value: `${opt}:DESC`,
      label: opt.toLocaleLowerCase().replace('_', ' ') + ' (descending)',
    },
  ],
  []
)

const query = graphql`
  fragment PaginatedOwnerRepoList_owner on RepositoryOwner
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

// Component that renders the list of issues for the owner using Relay's `usePaginationFragment()`.
const PaginatedRepoList: React.FC<Props> = ({ owner, pageLength }) => {
  // const [repoSort, setRepoSort] = React.useState<string>('UPDATED_AT:ASC')
  const { data, refetch, isLoadingNext, loadNext } = usePaginationFragment(
    query,
    owner
  )
  return (
    <div className="py-4">
      <div className="mb-6">
        <label htmlFor="owner--repo-sort">Sort by</label>
        <select
          className="ml-2 border rounded-1"
          name="owner--repo-sort"
          placeholder="Sort by"
          defaultValue="UPDATED_AT:DESC"
          onChange={(event) => {
            console.log('change')
            event.preventDefault()
            const [field, direction] = event.target.value.split(':')

            console.log({ field, direction })
            refetch({ orderBy: { field, direction } })
            // setRepoSort(event.target.value)
          }}
        >
          {sortOptions.map((opt) => {
            return (
              <option value={opt.value} key={opt.value}>
                {opt.label}
              </option>
            )
          })}
        </select>
      </div>
      <ul className="list-none list-outside">
        {data && (
          <Suspense fallback={'Repos loading...'}>
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
          </Suspense>
        )}
      </ul>
      {isLoadingNext
        ? 'Loading more...'
        : data.filteredRepos.pageInfo.hasNextPage && (
            <Button onClick={() => loadNext(pageLength)}>Load more</Button>
          )}
    </div>
  )
}

export default PaginatedRepoList
