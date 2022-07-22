import React from 'react'
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { defineVilay } from 'vilay'
import defaultDefines from '../../lib/renderer/_default.page'
import PullRequestListComponent from '../../components/prs/PullRequestList'
import type {
  pullsByRepoQuery,
  pullsByRepoQuery$variables,
} from './__generated__/pullsByRepoQuery.graphql'
import RepoLayout from '../layouts/RepoLayout'

interface Props {
  queryRef: PreloadedQuery<pullsByRepoQuery>
}

interface RouteParams {
  owner: string
  name: string
}

// Variables used in this query is constructed using the `getQueryVariables()` on preload.
export const query = graphql`
  query pullsByRepoQuery(
    $owner: String!
    $name: String!
    $cursor: String
    $first: Int!
    $states: [PullRequestState!]
  ) {
    repository(name: $name, owner: $owner) {
      ...RepoLayout_header
      ...PullRequestList_repository
    }
  }
`

export default defineVilay<{
  PageProps: Props
  RouteParams: RouteParams
  QueryVariables: pullsByRepoQuery$variables
}>({
  // This overrides the application-wide <head> tag definition in `_default.page.tsx`
  head: { ...defaultDefines.head, title: 'repo overview' },
  // If a page has `getQueryVariables` exported, it'll be called to get the variables used for preloading the query.
  // If it's not exported, route params will be directly used as variables.
  getQueryVariables: (routeParams) => ({
    ...routeParams,
    states: ['OPEN'],
    first: 10,
    filter: {},
  }),
  // Relay pagination example.
  Page: ({ queryRef }) => {
    const issueData = usePreloadedQuery<pullsByRepoQuery>(query, queryRef)
    const nameWithOwner = `${queryRef.variables.owner}/${queryRef.variables.name}`
    return (
      <RepoLayout
        repository={issueData.repository}
        nameWithOwner={nameWithOwner}
      >
        <div className="flex flex-col flex-grow">
          {issueData.repository && (
            <>
              <React.Suspense fallback="Loading...">
                <PullRequestListComponent repository={issueData.repository} />
              </React.Suspense>
            </>
          )}
        </div>
      </RepoLayout>
    )
  },
})
