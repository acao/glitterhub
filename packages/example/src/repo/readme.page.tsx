import React from 'react'
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { defineVilay } from 'vilay'
import defaultDefines from '~/lib/renderer/_default.page'
import type {
  readmePageRepoQuery,
  readmePageRepoQuery$variables,
} from './__generated__/readmePageRepoQuery.graphql'
import RepoLayout from './layouts/RepoLayout'

import { parseMarkdown } from '~/lib/marked'


interface Props {
  queryRef: PreloadedQuery<readmePageRepoQuery>
}

interface RouteParams {
  owner: string
  name: string
}

// Variables used in this query is constructed using the `getQueryVariables()` on preload.
export const query = graphql`
  query readmePageRepoQuery($owner: String!, $name: String!) {
    repository(name: $name, owner: $owner) {
        ...RepoLayout_header
      main: object(expression: "main:README.md") {
        ... on Blob {
          text
        }
      }
      master: object(expression: "master  :README.md") {
        ... on Blob {
          text
        }
      }
    }
  }
`

export default defineVilay<{
  PageProps: Props
  RouteParams: RouteParams
  QueryVariables: readmePageRepoQuery$variables
}>({
  // This overrides the application-wide <head> tag definition in `_default.page.tsx`
  head: { ...defaultDefines.head, title: 'repo overview' },
  // If a page has `getQueryVariables` exported, it'll be called to get the variables used for preloading the query.
  // If it's not exported, route params will be directly used as variables.
  getQueryVariables: (routeParams) => ({
    ...routeParams,
  }),
  // Relay pagination example.
  Page: ({ queryRef }) => {
    const issueData = usePreloadedQuery<readmePageRepoQuery>(query, queryRef)
    const nameWithOwner = `${queryRef.variables.owner}/${queryRef.variables.name}`
    const readme =
      issueData?.repository?.main?.text ?? issueData?.repository?.master?.text
    return (
      <RepoLayout
        repository={issueData.repository}
        nameWithOwner={nameWithOwner}
      >
        <div className="flex flex-col flex-grow">
          {readme && (
            <>
              <React.Suspense fallback="Loading...">
                <article className="prose lg:prose-l font-serif markdown-body dark:bg-dark w-full"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(readme) }}
                />
              </React.Suspense>
            </>
          )}
        </div>
      </RepoLayout>
    )
  }
})
