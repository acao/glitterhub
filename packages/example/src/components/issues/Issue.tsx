import React from 'react'
import { graphql, useFragment } from 'react-relay'
import * as ItemCard from '../ItemCard'
import Labels from '../Labels'
import LoginLink from '../owner/LoginLink'
import type { Issue_issue$key } from './__generated__/Issue_issue.graphql'

interface Props {
  issue: Issue_issue$key
  nameWithOwner: string
}

const query = graphql`
  fragment Issue_issue on Issue {
    id
    number
    title
    titleHTML
    author {
      login
    }
    createdAt
    updatedAt
    url
    comments {
      count: totalCount
    }
    labels(first: 10) {
      nodes {
        id
        name
        color
      }
    }
  }
`

// Simple component that renders the issue using GraphQL fragment.
const IssueComponent: React.FC<Props> = ({ issue, nameWithOwner }) => {
  const data = useFragment(query, issue)

  return (
    <ItemCard.ItemCard className="hover:text-sm">
      <ItemCard.Header>
        <a
          dangerouslySetInnerHTML={{ __html: data.titleHTML }}
          href={`/${nameWithOwner}/issues/${data.number}`}
        />
      </ItemCard.Header>
      <ItemCard.Body className="text-xs">
        by <LoginLink login={data.author?.login} /> on{' '}
        {new Date(data.createdAt).toLocaleString()} | {data.comments.count}{' '} Comments
      </ItemCard.Body>
      <ItemCard.Footer>
        <Labels labels={data.labels?.nodes} />
      </ItemCard.Footer>
    </ItemCard.ItemCard>
  )
}

export default IssueComponent
