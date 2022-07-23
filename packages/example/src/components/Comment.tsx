import { useFragment } from 'react-relay'
import { graphql } from 'relay-runtime'
import Avatar from './owner/Avatar'
import { CommentData$key } from './__generated__/CommentData.graphql'

const query = graphql`
  fragment CommentData on Comment {
    id
    author {
      ...Avatar
    }
    authorAssociation
    bodyHTML
    createdAt
    updatedAt
    lastEditedAt
    publishedAt
    editor {
      ...Avatar
    }
    viewerDidAuthor
    includesCreatedEdit
  }
`

export const Comment = ({ comment }: { comment: CommentData$key }) => {
  const data = useFragment(query, comment)
  return (
    <div className="flex flex-row flex-grow">
      <div className="flex flex-col flex-grow p-6">
        <div className="">
          <Avatar width={'w-8'} user={data.author} /> | Created: {data.createdAt}
        </div>
        <div
          className="prose prose-m"
          dangerouslySetInnerHTML={{ __html: data.bodyHTML }}
        />
      </div>
    </div>
  )
}
