import React from 'react'
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { defineVilay } from 'vilay'
import defaultDefines from '../lib/renderer/_default.page'
import IssueListComponent from '../components/issues/IssueList'
import PullRequestListComponent from '../components/prs/PullRequestList'
import type {
  repoDataQuery,
  repoDataQuery$variables,
} from './__generated__/repoDataQuery.graphql'

import RepoLayout from './layouts/RepoLayout'

interface Props {
  queryRef: PreloadedQuery<repoDataQuery>
}

interface RouteParams {
  owner: string
  name: string
}

// Variables used in this query is constructed using the `getQueryVariables()` on preload.
export const query = graphql`
  query repoDataQuery(
    $owner: String!
    $name: String!
    $cursor: String
    $first: Int!
    $filter: IssueFilters
    $states: [PullRequestState!]!
  ) {
    repository(name: $name, owner: $owner) {
      id
      ...RepoLayout_header
      ...IssueList_repository
      ...PullRequestList_repository
    }
  }
`

export default defineVilay<{
  PageProps: Props
  RouteParams: RouteParams
  QueryVariables: repoDataQuery$variables
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
    const nameWithOwner = `${queryRef.variables.owner}/${queryRef.variables.name}`
    const issueData = usePreloadedQuery<repoDataQuery>(query, queryRef)

    if(!issueData?.repository) {
      return null
    }

    return (
      <RepoLayout
        repository={issueData.repository}
        nameWithOwner={nameWithOwner}
      >
        <div className="flex flex-col flex-grow w-full">
          <h3 className="text-xl">
            <a href={`/${nameWithOwner}/issues`}>Recent Issues</a>
          </h3>
          {issueData.repository && (
            <React.Suspense fallback="Loading...">
              <IssueListComponent repository={issueData.repository} />
            </React.Suspense>
          )}
        </div>
        <div className="flex flex-col flex-grow pl-4  w-full">
          <h3 className="text-xl">
            <a href={`/${nameWithOwner}/pulls`}>Recent Pull Requests</a>
          </h3>
          {issueData.repository && (
            <React.Suspense fallback="Loading...">
              <PullRequestListComponent repository={issueData.repository} />
            </React.Suspense>
          )}
        </div>
      </RepoLayout>
    )
  },
})
