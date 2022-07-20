import React from 'react'
import { graphql, useFragment } from 'react-relay'
import Labels from '../Labels'
import * as ItemCard from '../ItemCard'
import type { PullRequest_data$key } from './__generated__/PullRequest_data.graphql'

interface Props {
  pull: PullRequest_data$key
}

// Simple component that renders the issue using GraphQL fragment.
const PullRequestComponent: React.FC<Props> = ({ pull, nameWithOwner }) => {
  const data = useFragment(
    graphql`
      fragment PullRequest_data on PullRequest {
        number
        title
        author {
          login
        }
        createdAt
        url
        labels(first: 10) {
          nodes {
            id
            name
            color
          }
        }
      }
    `,
    pull
  )

  return (
    <ItemCard.ItemCard>
      <ItemCard.Header>
      <a href={`/repo/${nameWithOwner}/pulls/${data.number}`}>{data.title}</a>
      </ItemCard.Header>
      <ItemCard.Body>
        by @{data.author?.login} on {new Date(data.createdAt).toLocaleString()}
      </ItemCard.Body>
      <ItemCard.Footer>
        <Labels labels={data.labels?.nodes} />
      </ItemCard.Footer>
    </ItemCard.ItemCard>
  )
}

export default PullRequestComponent
