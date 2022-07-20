import { graphql, usePreloadedQuery, type PreloadedQuery } from 'react-relay'
import { defineVilay } from 'vilay'
import { viewerPageQuery } from './__generated__/viewerPageQuery.graphql'

interface Props {
  queryRef: PreloadedQuery<viewerPageQuery>
}

// If a page has `query` exported, it will be prefetched and SSR'd.
export const query = graphql`
  query viewerPageQuery($first: Int!) {
    viewer {
      repositories(
        first: $first
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        edges {
          node {
            id
            name
            nameWithOwner
            url
            homepageUrl
            stargazerCount
            forkCount
            issues {
              totalCount
            }
            pullRequests {
              totalCount
            }
            latestRelease {
              id
              tagName
              description
            }
          }
        }
      }
    }
  }
`

export default defineVilay<{ PageProps: Props }>({
  // Basic data fetching example using Relay.
  getQueryVariables: () => ({
    first: 10
  }),
  Page: ({ queryRef }) => {
    // This will either pull the preloaded data or suspend.
    const data = usePreloadedQuery<viewerPageQuery>(query, queryRef)

    return (
      <>
        <h2 className="text-2xl mb-4">My repositories</h2>
        <ul className="pl-4">
          {data?.viewer?.repositories?.edges.map((item, i) => {
            if (!item?.node) {
              return null
            }
            const { node } = item

            return (
              <li
                key={i}
                className="my-2 w-fit list-none border-b dark:border-black border-dashed dark:hover:border-white transition-colors duration-400"
              >
                <a href={`/repo/${node?.nameWithOwner}`}>{node?.name}</a> |{' '}
                <a href={`/repo/${node?.nameWithOwner}`}>
                  Issues: {node?.issues.totalCount}
                </a>{' '}
                |{' '}
                <a href={`/repo/${node?.nameWithOwner}`}>
                  PRs: {node?.pullRequests.totalCount}
                </a>
              </li>
            )
          })}
        </ul>
      </>
    )
  },
})
