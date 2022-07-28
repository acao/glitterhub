import React from 'react'
import { graphql, useFragment } from 'react-relay'
import Labels from '~/components/Labels'
import * as ItemCard from '~/components/ItemCard'
import type { PullRequest_data$key } from './__generated__/PullRequest_data.graphql'
import LoginLink from '~/components/owner/LoginLink'
import Label from '~/components/Label'

interface Props {
  pull: PullRequest_data$key
  nameWithOwner: string
}

// Simple component that renders the issue using GraphQL fragment.
const PullRequestComponent: React.FC<Props> = ({ pull, nameWithOwner }) => {
  const data = useFragment(
    graphql`
      fragment PullRequest_data on PullRequest {
        id
        number
        title
        titleHTML
        author {
          login
        }
        createdAt
        url
        isDraft
        state
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
    `,
    pull
  )

  return (
    <ItemCard.ItemCard>
      <ItemCard.Header>
        <a
          dangerouslySetInnerHTML={{ __html: data.titleHTML }}
          href={`/${nameWithOwner}/pull/${data.number}`}
        />
        {data.isDraft && <Label name='Draft' size='xs' color="#eee" /> }
      </ItemCard.Header>
      <ItemCard.Body>
        by <LoginLink login={data.author?.login} /> on {new Date(data.createdAt).toLocaleString()}
      </ItemCard.Body>
      <ItemCard.Footer>
        <Labels labels={data?.labels?.nodes} />
      </ItemCard.Footer>
    </ItemCard.ItemCard>
  )
}

export default PullRequestComponent
