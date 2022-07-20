import React from 'react'
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { defineVilay } from 'vilay'
import defaultDefines from '../../renderer/_default.page'
import IssueListComponent from '../../components/issues/IssueList'
import type {
  IssueIdByRepoQuery,
  IssueIdByRepoQuery$variables,
} from './__generated__/IssueIdByRepoQuery.graphql'
import RepoLayout from '../layouts/RepoLayout'
import Labels from '../../components/Labels'

interface Props {
  queryRef: PreloadedQuery<IssueIdByRepoQuery>
}

interface RouteParams {
  owner: string
  name: string
  issueId: number
}

// Variables used in this query is constructed using the `getQueryVariables()` on preload.
export const query = graphql`
  query IssueIdByRepoQuery($owner: String!, $name: String!, $issueId: Int!) {
    repository(name: $name, owner: $owner) {
      ...RepoLayout_header
      issue(number: $issueId) {
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
  QueryVariables: IssueIdByRepoQuery$variables
}>({
  // This overrides the application-wide <head> tag definition in `_default.page.tsx`
  head: { ...defaultDefines.head, title: 'repo overview' },
  // If a page has `getQueryVariables` exported, it'll be called to get the variables used for preloading the query.
  // If it's not exported, route params will be directly used as variables.
  getQueryVariables: (routeParams) => ({
    ...routeParams,
    issueId: parseInt(routeParams?.issueId, 10),
  }),
  // Relay pagination example.
  Page: ({ queryRef }) => {
    const { repository } = usePreloadedQuery<IssueIdByRepoQuery>(
      query,
      queryRef
    )
    const nameWithOwner = `${queryRef.variables.owner}/${queryRef.variables.name}`
    return (
      <RepoLayout repository={repository} nameWithOwner={nameWithOwner}>
        <div className="flex flex-col flex-grow">
          {repository?.issue && (
            <>
              <React.Suspense fallback="Loading...">
                <h3
                  className="text-3xl mb-4"
                  dangerouslySetInnerHTML={{
                    __html: repository.issue.titleHTML,
                  }}
                />
                <div className="flex flex-row">
                  <article
                    className="flex-column w-3/4 text-sm no-wrap overflow-y-noscroll whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: repository.issue.bodyHTML.replace('highlight-source', 'language'),
                    }}
                  />
                  <aside className="flex flex-column w-1/4">
                    <div>
                      <h3 className="text-l">Meta</h3>
                      <p className="text-sm">{repository.issue.updatedAt}</p>
                      <p className="text-sm">@{repository.issue.author.login}</p>
                      <h3 className="text-l">Labels</h3>
                      <p className="text-xs">
                        {repository.issue?.labels ? (
                          <Labels labels={repository.issue?.labels?.nodes} />
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
