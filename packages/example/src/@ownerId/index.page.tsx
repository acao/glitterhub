import { Suspense } from 'react'
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { defineVilay } from 'vilay'
import { RepoItem } from '~/components/repos/RepoItem'
import Avatar from '~/components/owner/Avatar'
import {
  OwnerIdPageQuery,
  OwnerIdPageQuery$variables,
} from './__generated__/OwnerIdPageQuery.graphql'
import { useMarkdown } from '~/lib/marked'
import PaginatedOwnerRepoList from '~/components/repos/PaginatedOwnerRepoList'

interface Props {
  queryRef: PreloadedQuery<OwnerIdPageQuery>
}

// If a page has `query` exported, it will be prefetched and SSR'd.
export const query = graphql`
  query OwnerIdPageQuery(
    $ownerId: String!
    $cursor: String
    $first: Int
    $orderBy: RepositoryOrder
  ) {
    user(login: $ownerId) {
      ...Avatar
      avatarUrl
      name
      bioHTML
      companyHTML
      isViewer
      isFollowingViewer
      viewerIsFollowing
      bioMarkdown: repository(name: $ownerId) {
        object(expression: "main:README.md") {
          ... on Blob {
            text
          }
        }
      }
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
      ...PaginatedOwnerRepoList_owner
    }

    organization(login: $ownerId) {
      ...AvatarOrg
      avatarUrl
      name
      ...PaginatedOwnerRepoListOrg_owner

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
    }
  }
`

export default defineVilay<{
  PageProps: Props
  QueryVariables: OwnerIdPageQuery$variables
  RouteParams: { ownerId: string }
}>({
  // Basic data fetching example using Relay.
  getQueryVariables: (routeParams) => ({
    ...routeParams,
    first: 25,
    orderBy: { direction: 'DESC', field: 'UPDATED_AT' },
  }),
  Page: ({ queryRef }) => {
    const data = usePreloadedQuery(query, queryRef)
    const isOrg = !!data?.organization
    const owner = data.user ?? data.organization

    const rendered = useMarkdown(owner?.bioMarkdown?.object?.text)

    console.log(rendered)
    return (
      <div className="flex flex-col flex-grow pl-2">
        {owner && (
          <Suspense>
            <Avatar user={owner} isOrg={isOrg} width="w-16" />
            <div className="flex flex-row mt-6">
              <div className="flex flex-col min-w-200px">
                <h2 className=" text-xl">Popular</h2>
                <ul>
                  {owner.repositories.nodes?.map(
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
                  {owner.newRepos.nodes?.map(
                    (node, i) =>
                      node && (
                        <li>
                          <RepoItem
                            key={`${owner.link}-repos-${node.url}`}
                            repo={node}
                          />
                        </li>
                      )
                  )}
                </ul>
              </div>
              <div className="flex flex-col w-full ml-6 pl-4">
                <div>
                  <div
                    className="prose lg:prose-l markdown-body dark:bg-dark mb-6"
                    dangerouslySetInnerHTML={{ __html: owner?.bioHTML }}
                  />{' '}
                  {rendered?.result && (
                    <div className='prose lg:prose-l markdown-body dark:bg-dark'
                      dangerouslySetInnerHTML={{
                        __html: rendered.result,
                      }}
                    ></div>
                  )}
                </div>
                <h2 className="my-6 text-2xl">All Repositories</h2>
                <PaginatedOwnerRepoList
                  owner={owner}
                  isOrg={isOrg}
                  pageLength={queryRef.variables.first}
                />
              </div>
            </div>
          </Suspense>
        )}
      </div>
    )
  },
})
