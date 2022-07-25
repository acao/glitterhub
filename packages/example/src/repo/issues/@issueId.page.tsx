import React, { useEffect } from 'react'
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { defineVilay } from 'vilay'
import defaultDefines from '~/renderer/_default.page'
import type {
  IssueIdByRepoQuery,
  IssueIdByRepoQuery$variables,
} from './__generated__/IssueIdByRepoQuery.graphql'
import RepoLayout from '../layouts/RepoLayout'
import Labels from '~/components/Labels'
import Label from '~/components/Label'
import * as ItemCard from '~/components/ItemCard'
import { IssueCommentList } from '~/components/issues/IssueCommentList'
import Author from '~/components/owner/Author'

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
  query IssueIdByRepoQuery(
    $owner: String!
    $name: String!
    $issueId: Int!
    $first: Int!
    $cursor: String
  ) {
    repository(name: $name, owner: $owner) {
      ...RepoLayout_header
      issue(number: $issueId) {
        id
        title
        bodyHTML
        bodyText
        titleHTML
        createdAt
        updatedAt
        # closed
        # closedAt
        author {
          login
        }
        labels(first: 10) {
          nodes {
            name
            color
          }
        }
        ...Author_issue
        ...IssueCommentList_comment
        closed
        closedAt
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
  getQueryVariables: (routeParams) => {
    return {
      ...routeParams,
      issueId: parseInt(routeParams?.issueId, 10),
      first: 10,
    }
  },
  // Relay pagination example.
  Page: ({ queryRef }) => {
    const { repository } = usePreloadedQuery<IssueIdByRepoQuery>(
      query,
      queryRef
    )

    const nameWithOwner = `${queryRef.variables.owner}/${queryRef.variables.name}`
    const issue = repository?.issue
    return (
      <RepoLayout repository={repository} nameWithOwner={nameWithOwner}>
        <div className="flex flex-col flex-grow">
          {issue && (
            <>
              <React.Suspense fallback="Loading...">
                <h3 className="text-3xl mb-4">
                  <span
                    className="mr-2"
                    dangerouslySetInnerHTML={{
                      __html: issue.titleHTML,
                    }}
                  />

                  {issue?.closed && (
                    <Label name="Closed" color="#eb4d13" size="sm" />
                  )}
                </h3>
                <div className="flex flex-grow flex-row w-full">
                  <div className="flex-column w-3/4 flex-grow">
                    <article
                      className="w-full prose lg:prose-l markdown-body dark:bg-dark min-h-6"
                      dangerouslySetInnerHTML={{
                        // __html: issue.bodyHTML,
                        __html: issue.bodyHTML,
                      }}
                    />
                    {issue && (
                      <React.Suspense>
                        <IssueCommentList issue={issue} />
                      </React.Suspense>
                    )}
                  </div>
                  <aside className="flex flex-column w-1/4 min-w-200px">
                    <div className="ml-4 w-full">
                      <ItemCard.ItemCard>
                        <ItemCard.Body>
                          <Author issue={issue} />
                        </ItemCard.Body>
                      </ItemCard.ItemCard>

                      {issue?.labels?.nodes?.length > 0 && (
                        <ItemCard.ItemCard>
                          <ItemCard.Header>Labels</ItemCard.Header>
                          <ItemCard.Body>
                            <Labels labels={issue?.labels?.nodes} size="xs" />
                          </ItemCard.Body>
                        </ItemCard.ItemCard>
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
