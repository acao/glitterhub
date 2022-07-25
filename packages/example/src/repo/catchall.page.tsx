import React from 'react'
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { defineVilay } from 'vilay'
import defaultDefines from '../renderer/_default.page'
import type {
  catchallPageRepoQuery,
  catchallPageRepoQuery$variables,
} from './__generated__/catchallPageRepoQuery.graphql'
import RepoLayout from './layouts/RepoLayout'


interface Props {
  queryRef: PreloadedQuery<catchallPageRepoQuery>
}

interface RouteParams {
  owner: string
  name: string
}

// Variables used in this query is constructed using the `getQueryVariables()` on preload.
export const query = graphql`
  query catchallPageRepoQuery($owner: String!, $name: String!) {
    repository(name: $name, owner: $owner) {
        ...RepoLayout_header
    }
  }
`

export default defineVilay<{
  PageProps: Props
  RouteParams: RouteParams
  QueryVariables: catchallPageRepoQuery$variables
}>({
  // This overrides the application-wide <head> tag definition in `_default.page.tsx`
  getPageHead: () => ({ ...defaultDefines.head, title: 'repo overview' }),
  // If a page has `getQueryVariables` exported, it'll be called to get the variables used for preloading the query.
  // If it's not exported, route params will be directly used as variables.
  getQueryVariables: ({ routeParams }) => ({
    ...routeParams,
  }),
  // Relay pagination example.
  Page: ({ queryRef }) => {
    const repoData = usePreloadedQuery<catchallPageRepoQuery>(query, queryRef)
    const nameWithOwner = `${queryRef.variables.owner}/${queryRef.variables.name}`
 
    return (
      <RepoLayout
        repository={repoData.repository}
        nameWithOwner={nameWithOwner}
      >
        <div className="flex flex-col flex-grow">
          <p>Oops! probably a relative link from an issue or readme.</p><p> We don't support this github-style repo route yet, should we?</p>
        </div>
      </RepoLayout>
    )
  }
})
