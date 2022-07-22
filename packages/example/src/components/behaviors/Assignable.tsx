// import React from 'react'
// import { graphql, useFragment } from 'react-relay'

// type Props = {
//   issueOrPull: string
// }

// const sharedFragments = graphql`
//   fragment Assigned on Assignable {
//     assignees {
//       nodes {
//         ...Avatar
//       }
//     }
//   }

//   fragment Closed on Closable {
//     closed
//     closedAt
//   }

//   fragment Locked on Lockable {
//     locked
//     activeLockReason
//   }

//   fragment Labels on Labelable {
//     labels(first: 10) {
//       nodes {
//         name
//         color
//       }
//     }
//   }
// `

// const issueFragment = graphql`
//   fragment FullIssue on Issue {
//           id
//           title
//           bodyHTML
//           titleHTML
//           createdAt
//           updatedAt
//           author {
//             ...Avatar
//           }
//           ...Labels
//           ...Assigned
//           ...Closed
//           ...Locked
//         }
// `

// const pullFragment = graphql`
//   fragment FullPull on Issue {
//           id
//           title
//           bodyHTML
//           titleHTML
//           createdAt
//           updatedAt
//           author {
//             ...Avatar
//           }
//           ...Labels
//           ...Assigned
//           ...Closed
//           ...Locked
//         }
// `

// const AssignableItem: React.FC<Props> = ({ issue, pull }) => {
//   let data
//   if (issue) {
//     data = useFragment(
//       issueFragment,
//       issue
//     )
//   }
//   else if(pull) {
//     data = useFragment(pullFragment,  )
//   }

//   return (
//     <>
//       <h3
//         className="text-3xl mb-4"
//         dangerouslySetInnerHTML={{
//           __html: repository.issue.titleHTML,
//         }}
//       />
//       <div className="flex flex-row">
//         <article
//           className="flex-column w-3/4 text-sm no-wrap overflow-y-noscroll whitespace-pre-wrap"
//           dangerouslySetInnerHTML={{
//             // __html: repository.issue.bodyHTML,
//             __html: repository.issue.bodyHTML.replace(
//               'highlight-source',
//               'language'
//             ),
//           }}
//         />
//         <aside className="flex flex-column w-1/4">
//           <div className="ml-4">
//             <ItemCard.ItemCard>
//               <ItemCard.Header>Meta</ItemCard.Header>
//               <ItemCard.Body>
//                 <p>{repository.issue.updatedAt}</p>
//                 <p>@{repository.issue.author.login}</p>
//               </ItemCard.Body>
//             </ItemCard.ItemCard>

//             {repository.issue?.labels?.nodes?.length > 0 ? (
//               <ItemCard.ItemCard>
//                 <ItemCard.Header>Labels</ItemCard.Header>
//                 <ItemCard.Body>
//                   <Labels labels={repository.issue?.labels?.nodes} size="xs" />
//                 </ItemCard.Body>
//               </ItemCard.ItemCard>
//             ) : (
//               <></>
//             )}
//           </div>
//         </aside>
//       </div>
//     </>
//   )
// }
