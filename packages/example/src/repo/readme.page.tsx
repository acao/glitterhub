import React, { useMemo } from 'react'
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { defineVilay } from 'vilay'
import defaultDefines from '~/renderer/_default.page'
import type {
  readmePageRepoQuery,
  readmePageRepoQuery$variables,
} from './__generated__/readmePageRepoQuery.graphql'
import RepoLayout from './layouts/RepoLayout'

import { useMarkdown } from '~/lib/service/marked'

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
      defaultBranchRef {
        name
      }
      main: object(expression: "main:README.md") {
        ... on Blob {
          text
        }
      }
      master: object(expression: "master:README.md") {
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
  getPageHead: () => ({ ...defaultDefines.head, title: 'repo overview' }),
  // If a page has `getQueryVariables` exported, it'll be called to get the variables used for preloading the query.
  // If it's not exported, route params will be directly used as variables.
  getQueryVariables: ({ routeParams }) => ({
    ...routeParams,
  }),
  // Relay pagination example.
  Page: ({ queryRef }) => {
    const repoData = usePreloadedQuery<readmePageRepoQuery>(query, queryRef)
    const nameWithOwner = `${queryRef.variables.owner}/${queryRef.variables.name}`
    const readme =
      repoData?.repository?.main?.text ?? repoData?.repository?.master?.text

    const rendered = useMarkdown(
      readme,
      nameWithOwner,
      repoData?.repository?.defaultBranchRef?.name
    )

    return (
      <RepoLayout
        repository={repoData.repository}
        nameWithOwner={nameWithOwner}
      >
        <div className="flex flex-col flex-grow">
          {rendered?.loading && (
            <>
              <p className="text-md">Loading.... </p>
            </>
          )}
          {
            <>
              <React.Suspense fallback="Loading...">
                <article
                  className="prose lg:prose-l font-serif markdown-body dark:bg-dark w-full"
                  dangerouslySetInnerHTML={{ __html: rendered?.result }}
                />
              </React.Suspense>
            </>
          }
        </div>
      </RepoLayout>
    )
  },
})
