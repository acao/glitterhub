import { Suspense } from 'react'
import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { defineVilay } from 'vilay'
import { RepoItem } from '~/components/repos/RepoItem'
import Avatar from '~/components/owner/Avatar'
import LoginLink from '~/components/owner/LoginLink'
import { viewerPageQuery } from './__generated__/viewerPageQuery.graphql'
import { parseMarkdown } from '~/lib/marked'
import PaginatedOwnerRepoList from '~/components/repos/PaginatedOwnerRepoList'

interface Props {
  queryRef: PreloadedQuery<viewerPageQuery>
}

// If a page has `query` exported, it will be prefetched and SSR'd.
export const query = graphql`
  query OwnerIdPageQuery($ownerId: String!, $cursor: String, $first: Int) {
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

export default defineVilay<{ PageProps: Props }>({
  // Basic data fetching example using Relay.
  getQueryVariables: (routeParams) => ({
    ...routeParams,
    first: 10,
  }),
  Page: ({ queryRef }) => {
    const data = usePreloadedQuery(query, queryRef)

    const owner = data.user ?? data.organization
    return (
      <div className="flex flex-col flex-grow pl-2">
        {owner && (
          <Suspense>
            <Avatar user={owner} isOrg={data.organization} width="w-16" />
            <div className="flex flex-row">
              <div className="flex flex-col">
                <h2 className="my-6 text-xl">Popular</h2>
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
              <div className="flex flex-col ml-2 p-2 prose lg:prose-l markdown-body dark:bg-dark">
                <div dangerouslySetInnerHTML={{ __html: owner?.bioHTML }} />{' '}
                {owner?.bioMarkdown?.object?.text && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: parseMarkdown(owner?.bioMarkdown?.object?.text),
                    }}
                  ></div>
                )}
                <PaginatedOwnerRepoList owner={owner} isOrg={data.organization} />
              </div>
            </div>
          </Suspense>
        )}
      </div>
    )
  },
})
