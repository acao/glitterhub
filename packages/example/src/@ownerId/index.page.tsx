import { Suspense } from 'react'
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { defineVilay } from 'vilay'
import { RepoItem } from '~/components/repos/RepoItem'
import Avatar from '~/components/owner/Avatar'
import {
  OwnerIdPageQuery,
  OwnerIdPageQuery$variables,
} from './__generated__/OwnerIdPageQuery.graphql'
import { parseMarkdown } from '~/lib/service/marked'
import PaginatedOwnerRepoList from '~/components/repos/PaginatedOwnerRepoList'

interface Props {
  queryRef: PreloadedQuery<OwnerIdPageQuery>
}

// If a page has `query` exported, it will be prefetched and SSR'd.
export const query = graphql`
  query OwnerIdPageQuery(
    $ownerId: String!
    $first: Int
    $cursor: String
    $orderBy: RepositoryOrder
  ) {
    repositoryOwner(login: $ownerId) {
      avatarUrl
      url
      login
      repositories(first: 10, orderBy: { field: STARGAZERS, direction: DESC }) {
        nodes {
          ...RepoItem_meta
        }
      }
      newRepos: repositories(
        first: 10
        orderBy: { field: CREATED_AT, direction: DESC }
      ) {
        nodes {
          ...RepoItem_meta
        }
      }
      bioMarkdown: repository(name: $ownerId) {
        object(expression: "main:README.md") {
          ... on Blob {
            text
          }
        }
      }
      ...PaginatedOwnerRepoList_owner
    }
    user(login: $ownerId) {
      ...Avatar
      avatarUrl
      name
      bioHTML
      companyHTML
      isViewer
      isFollowingViewer
      viewerIsFollowing
    }

    organization(login: $ownerId) {
      ...AvatarOrg
      avatarUrl
      name
    }
  }
`

export default defineVilay<{
  PageProps: Props
  QueryVariables: OwnerIdPageQuery$variables
  RouteParams: { ownerId: string }
}>({
  // Basic data fetching example using Relay.
  getQueryVariables: ({ routeParams }) => ({
    ...routeParams,
    first: 25,
    orderBy: { direction: 'DESC', field: 'UPDATED_AT' },
  }),
  Page: ({ queryRef }) => {
    const data = usePreloadedQuery(query, queryRef)
    const isOrg = !!data?.organization
    const owner = data?.user ?? data?.organization
    const repoOwner = data?.repositoryOwner
    // const rendered = useMarkdown(owner?.bioMarkdown?.object?.text)

    return (
      <div className="flex flex-col flex-grow pl-2">
        {owner && (
          <Suspense>
            <Avatar user={owner} isOrg={isOrg} width="w-16" />
            <div className="flex flex-row mt-6">
              <div className="flex flex-col min-w-200px">
                <h2 className=" text-xl">Popular</h2>
                <ul>
                  {repoOwner?.repositories?.nodes?.map(
                    (node, i) =>
                      node && (
                        <li>
                          <RepoItem
                            key={`${owner.link}-popular-repos-${node.url}`}
                            repo={node}
                          />
                        </li>
                      )
                  )}
                </ul>
                <h2 className="my-6 text-xl">New Repos</h2>
                <ul>
                  {repoOwner?.newRepos?.nodes?.map((node) => (
                    <li>
                      <RepoItem
                        key={`${owner.link}-new-repos-${node.url}`}
                        repo={node}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col w-full ml-6 pl-4">
                <div>
                  <div
                    className="prose lg:prose-l markdown-body dark:bg-dark mb-6"
                    dangerouslySetInnerHTML={{ __html: owner?.bioHTML }}
                  />
                  {repoOwner?.bioMarkdown?.object?.text && (
                    <div
                      className="prose lg:prose-l markdown-body dark:bg-dark"
                      dangerouslySetInnerHTML={{
                        __html: parseMarkdown(owner?.bioMarkdown?.object?.text),
                      }}
                    ></div>
                  )}
                </div>
                <h2 className="my-6 text-2xl">All Repositories</h2>
                {repoOwner && <Suspense><PaginatedOwnerRepoList
                  owner={repoOwner}
                  pageLength={queryRef.variables.first}
                /></Suspense>}
              </div>
            </div>
          </Suspense>
        )}
      </div>
    )
  },
})
