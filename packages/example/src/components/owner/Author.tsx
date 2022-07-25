import React from 'react'
import { useFragment, graphql } from 'react-relay'
import Avatar from '~/components/owner/Avatar'

import {
  Author_issue$key,
  Author_issue$data,
} from './__generated__/Author_issue.graphql'
import {
  Author_pr$key,
  Author_pr$data,
} from './__generated__/Author_pr.graphql'

type Props = {
  issue?: Author_issue$key
  pr?: Author_pr$key
}

const query = graphql`
  fragment Author_issue on Issue {
    author {
      ...Avatar
    }
    createdAt
    publishedAt
    lastEditedAt
    editor {
      ...Avatar
    }
    userContentEdits(last: 1) {
      nodes {
        editor {
          ...Avatar
        }
      }
    }
    activeLockReason
    closed
    closedAt
  }
`

const prQuery = graphql`
  fragment Author_pr on PullRequest {
    author {
      ...Avatar
    }
    createdAt
    publishedAt
    lastEditedAt
    updatedAt
    editor {
      ...Avatar
      login
    }
    lastEdit: userContentEdits(last: 1) {
      nodes {
        editor {
          ...Avatar
        }
      }
    }
    activeLockReason
    closed
    closedAt
  }
`

const formatDate = (dateString) => new Date(dateString).toLocaleString()

const Author: React.FC<Props> = ({ issue, pr }) => {
  let issueOrPr: Author_issue$data | Author_pr$data
  if (issue) {
    issueOrPr = useFragment(query, issue)
  } else if (pr) {
    issueOrPr = useFragment(prQuery, pr)
  }
  return (
    <div className="pt-2">
      <Avatar stacked width="w-12" user={issueOrPr.author} />
      <div className="text-sm">
        <table className="mt-4">
          <tbody>
            <tr>
              <td>Created:</td>
              <td>{formatDate(issueOrPr.createdAt)}</td>
            </tr>
            <tr>
              <td>Updated:</td>
              <td>{formatDate(issueOrPr.createdAt)}</td>
            </tr>
            {issueOrPr.lastEditedAt && (
              <tr>
                <td>Last Edited At:  {issueOrPr.editor?.login} </td>
                <td>{formatDate(issueOrPr.lastEditedAt)}</td>
              </tr>
             
            )}
            {issueOrPr.closed && (
              <tr>
                <td>Closed At:</td>
                <td>{formatDate(issueOrPr.closedAt)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Author
