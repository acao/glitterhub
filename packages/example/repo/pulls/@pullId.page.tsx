import React from 'react'
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { defineVilay } from 'vilay'
import defaultDefines from '../../renderer/_default.page'

import type {
  PullIdByRepoQuery,
  PullIdByRepoQuery$variables,
} from './__generated__/PullIdByRepoQuery.graphql'
import RepoLayout from '../layouts/RepoLayout'
import Labels from '../../components/Labels'

interface Props {
  queryRef: PreloadedQuery<PullIdByRepoQuery>
}

interface RouteParams {
  owner: string
  name: string
  pullId: number
}

// Variables used in this query is constructed using the `getQueryVariables()` on preload.
export const query = graphql`
  query PullIdByRepoQuery($owner: String!, $name: String!, $pullId: Int!) {
    repository(name: $name, owner: $owner) {
      ...RepoLayout_header
      pullRequest(number: $pullId) {
        id
        title
        bodyHTML
        titleHTML
        createdAt
        updatedAt
        author {
          login
          url
        }
        labels(first: 10) {
          nodes {
            name
            color
          }
        }
      }
    }
  }
`

export default defineVilay<{
  PageProps: Props
  RouteParams: RouteParams
  QueryVariables: PullIdByRepoQuery$variables
}>({
  // This overrides the application-wide <head> tag definition in `_default.page.tsx`
  head: { ...defaultDefines.head, title: 'repo overview' },
  // If a page has `getQueryVariables` exported, it'll be called to get the variables used for preloading the query.
  // If it's not exported, route params will be directly used as variables.
  getQueryVariables: (routeParams) => ({
    ...routeParams,
    pullId: parseInt(routeParams?.pullId, 10),
  }),
  // Relay pagination example.
  Page: ({ queryRef }) => {
    const { repository } = usePreloadedQuery<PullIdByRepoQuery>(
      query,
      queryRef
    )
    const nameWithOwner = `${queryRef.variables.owner}/${queryRef.variables.name}`
    return (
      <RepoLayout repository={repository} nameWithOwner={nameWithOwner}>
        <div className="flex flex-col flex-grow">
          {repository?.pullRequest && (
            <>
              <React.Suspense fallback="Loading...">
                <h3
                  className="text-3xl mb-4"
                  dangerouslySetInnerHTML={{
                    __html: repository.pullRequest.titleHTML,
                  }}
                />
                <div className="flex flex-row">
                  <article
                    className="flex-column w-3/4 text-sm no-wrap overflow-y-noscroll whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: repository.pullRequest.bodyHTML.replace('highlight-source', 'language'),
                    }}
                  />
                  <aside className="flex flex-column w-1/4">
                    <div>
                      <h3 className="text-l">Meta</h3>
                      <p className="text-sm">{repository.pullRequest.updatedAt}</p>
                      <p className="text-sm">@{repository.pullRequest.author.login}</p>
                      <h3 className="text-l">Labels</h3>
                      <p className="text-xs">
                        {repository.pullRequest?.labels ? (
                          <Labels labels={repository.pullRequest?.labels?.nodes} />
                        ) : (
                          <></>
                        )}
                      </p>
                    </div>
                  </aside>
                </div>
              </React.Suspense>
            </>
          )}
        </div>
      </RepoLayout>
    )
  },
})
