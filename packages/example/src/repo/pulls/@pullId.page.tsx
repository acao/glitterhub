import React from 'react'
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { defineVilay, usePageContext } from 'vilay'
import defaultDefines from '../../lib/renderer/_default.page'
import type {
  PullIdByRepoQuery,
  PullIdByRepoQuery$variables,
} from './__generated__/PullIdByRepoQuery.graphql'
import RepoLayout from '../layouts/RepoLayout'
import Labels from '~/components/Labels'
import LoginLink from '~/components/owner/LoginLink'
import Label from '~/components/Label'
import { PullRequestCommentList } from '~/components/prs/PullRequestCommentList'


interface Props {
  queryRef: PreloadedQuery<PullIdByRepoQuery>
}

interface RouteParams {
  owner: string
  name: string
  pullId: string
}

// Variables used in this query is constructed using the `getQueryVariables()` on preload.
export const query = graphql`
  query PullIdByRepoQuery($owner: String!, $name: String!, $pullId: Int!, $first: Int!, $cursor: String) {
    repository(name: $name, owner: $owner) {
      ...RepoLayout_header
      pullRequest(number: $pullId) {
        ...PullRequestCommentList_comment
        id
        title
        bodyHTML
        titleHTML
        createdAt
        updatedAt
        closed
        closedAt
        publishedAt
        permalink
        lastEditedAt
        activeLockReason
        state
        viewerSubscription
        viewerCanReact
        viewerCanUpdate
        viewerCanSubscribe
        author {
          login
          url
        }
        checksResourcePath
        changedFiles
        isDraft
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
  PageProps: Props,
  RouteParams: RouteParams,
  QueryVariables: PullIdByRepoQuery$variables
}>({
  // This overrides the application-wide <head> tag definition in `_default.page.tsx`
  head: { ...defaultDefines.head, title: 'repo overview' },
  // If a page has `getQueryVariables` exported, it'll be called to get the variables used for preloading the query.
  // If it's not exported, route params will be directly used as variables.
  getQueryVariables: (routeParams) => ({
    ...routeParams,
    pullId: parseInt(routeParams?.pullId, 10),
    first: 10,
  }),
  // Relay pagination example.
  Page: ({ queryRef }) => {
    const context = usePageContext()
    console.log({context})
    const { repository } = usePreloadedQuery<PullIdByRepoQuery>(query, queryRef)
    const nameWithOwner = `${queryRef.variables.owner}/${queryRef.variables.name}`
    const pr = repository?.pullRequest
    return (
      <RepoLayout repository={repository} nameWithOwner={nameWithOwner}>
        <div className="flex flex-col flex-grow">
          {pr && (
            <>
              <React.Suspense fallback="Loading...">
                <p>
                  <h3 className="text-3xl mb-4">
                    <span
                      className="mr-2"
                      dangerouslySetInnerHTML={{
                        __html: pr.titleHTML,
                      }}
                    />
                    {pr.isDraft && (
                      <Label name="Draft" color="#ddd" size="sm" />
                    )}
                    {pr.state === 'OPEN' && (
                      <Label name="Open" color="#89e051" size="sm" />
                    )}
                    {pr.state === 'MERGED' && (
                      <Label name="Merged" color="#3178c6" size="sm" />
                    )}
                    {pr.state === "CLOSED" && (
                      <Label name="Closed" color="#eb4d13" size="sm" />
                    )}
                  </h3>
                </p>
                <div className="flex flex-row">
                <div className="flex-column w-3/4 flex-grow">
                    <article
                      className="w-full prose lg:prose-l markdown-body dark:bg-dark min-h-64"
                      dangerouslySetInnerHTML={{
                        // __html: repository.issue.bodyHTML,
                        __html: repository.pullRequest.bodyHTML,
                      }}
                    />
                    {repository?.pullRequest && (
                      <React.Suspense>
                        <PullRequestCommentList pull={repository?.pullRequest} />
                      </React.Suspense>
                    )}
                  </div>
                  <aside className="flex flex-column w-1/4">
                    <div>
                      <h3 className="text-l">Meta</h3>
                      <p className="text-sm">{pr.updatedAt}</p>
                      <p>
                        author: <LoginLink login={pr.author.login} />
                      </p>
                     
                        {pr?.labels?.nodes?.length > 0 && ( 
                          <div>
                            <h3 className="text-l">Labels</h3>
                            <Labels size='xs' labels={pr?.labels?.nodes} />
                          </div>
                        )}
                    
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
