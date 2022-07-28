import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

const fragment = graphql`
    fragment ReactionList_reactable on Reactable {
        id
        reactionGroups {
            content
            reactors {
                totalCount
                nodes {
                    ...Avatar
                }
            }
        }
    }
`

export default function ReactionList({ reactable }) {
    const data = useFragment(fragment, reactable)
    return 
}