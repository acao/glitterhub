import React, { useEffect } from 'react'
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { defineVilay } from 'vilay'
import defaultDefines from '~/lib/renderer/_default.page'
import type {
  IssueIdByRepoQuery,
  IssueIdByRepoQuery$variables,
} from './__generated__/IssueIdByRepoQuery.graphql'
import RepoLayout from '../layouts/RepoLayout'
import Labels from '~/components/Labels'
import * as ItemCard from '~/components/ItemCard'
import LoginLink from '~/components/owner/LoginLink'
import { parseMarkdown } from '~/lib/marked'
import { IssueCommentList } from '~/components/issues/IssueCommentList'

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
  query IssueIdByRepoQuery($owner: String!, $name: String!, $issueId: Int!, $first: Int!, $cursor: String) {
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
        author {
          login
        }
        labels(first: 10) {
          nodes {
            name
            color
          }
        }
        ...IssueCommentList_comment
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
                <div className="flex flex-grow flex-row w-full">
                  <div className="flex-column w-3/4 flex-grow">
                    <article
                      className="w-full prose lg:prose-l markdown-body dark:bg-dark"
                      dangerouslySetInnerHTML={{
                        // __html: repository.issue.bodyHTML,
                        __html: repository.issue.bodyHTML,
                      }}
                    />
                    {repository?.issue && (
                      <React.Suspense>
                        <IssueCommentList issue={repository?.issue} />
                      </React.Suspense>
                    )}
                  </div>
                  <aside className="flex flex-column w-1/4 min-w-200px">
                    <div className="ml-4 w-full">
                      <ItemCard.ItemCard>
                        <ItemCard.Header>Meta</ItemCard.Header>
                        <ItemCard.Body>
                          <p>{repository.issue.updatedAt}</p>
                          <p>
                            author:{' '}
                            <LoginLink login={repository.issue.author.login} />
                          </p>
                        </ItemCard.Body>
                      </ItemCard.ItemCard>

                      {repository.issue?.labels?.nodes?.length > 0 && (
                        <ItemCard.ItemCard>
                          <ItemCard.Header>Labels</ItemCard.Header>
                          <ItemCard.Body>
                            <Labels
                              labels={repository.issue?.labels?.nodes}
                              size="xs"
                            />
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