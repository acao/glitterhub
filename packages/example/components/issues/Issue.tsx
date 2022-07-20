import React from 'react'
import { graphql, useFragment } from 'react-relay'
import * as ItemCard from '../ItemCard'
import Labels from '../Labels'
import type { Issue_issue$key } from './__generated__/Issue_issue.graphql'

interface Props {
  issue: Issue_issue$key,
  nameWithOwner: string
}

// Simple component that renders the issue using GraphQL fragment.
const IssueComponent: React.FC<Props> = ({ issue, nameWithOwner }) => {
  const data = useFragment(
    graphql`
      fragment Issue_issue on Issue {
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
    issue
  )

  return (
    <ItemCard.ItemCard>
      <ItemCard.Header>
        <a href={`/repo/${nameWithOwner}/issues/${data.number}`}>{data.title}</a>
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

export default IssueComponent
