import React from 'React'
import { graphql, useFragment } from 'react-relay'
import RepoLink from '~/components/repos/RepoLink'
import Labels from '~/components/Labels'

import type { RepoLayout_header$key } from './__generated__/RepoLayout_header.graphql'
import { usePageContext } from 'vilay'

interface Props extends React.PropsWithChildren {
  repository?: RepoLayout_header$key
  nameWithOwner: string
}

type NavLinkProps = {
  nameWithOwner: string
  active: boolean
  label: string
  urlSuffix?: string
}

const NavLink: React.FC<NavLinkProps> = ({
  label,
  urlSuffix,
  nameWithOwner,
  active,
}) => {
  const href = urlSuffix
    ? `/${nameWithOwner}/${urlSuffix}`
    : `/${nameWithOwner}`
  return (
    <li
      key={href}
      className="pl-2 pr-2 border-b dark:border-black dark:hover:border-white"
      style={{ borderColor: active ? 'white' : 'transparent' }}
    >
      <a href={href}>{label}</a>
    </li>
  )
}

const RepoLayout: React.FC<Props> = ({
  children,
  repository,
  nameWithOwner,
}) => {
  if (!repository) {
    return <div></div>
  }
  const data = useFragment(
    graphql`
      fragment RepoLayout_header on Repository {
        url
        isFork
        isPrivate
        isArchived
        description
        homepageUrl
        nameWithOwner
        name
        owner {
          login
        }
        latestRelease {
          url
          tagName
          publishedAt
        }
        languages(first: 10) {
          nodes {
            id
            name
            color
          }
        }
        openIssues: issues(filterBy: { states: [OPEN] }) {
          count: totalCount
        }
        closedIssues: issues(filterBy: { states: [CLOSED] }) {
          count: totalCount
        }
      }
    `,
    repository
  )

  if (!data) {
    return <div>repo {nameWithOwner} not found</div>
  }
  const publishedAt = new Date(data?.latestRelease?.publishedAt).toLocaleString(
    'en-GB'
  )



  const context = usePageContext()
  console.log(context)
  // const [activeTab] = useState('overview')
  return (
    <div className="flex-col flex-grow">
      <h2 className="text-3xl pb-4 flex-row">
        <RepoLink repo={data} labelSize='sm' />
      </h2>
      <p className="text-sm pb-4">{data?.description}</p>
      <p className="text-sm pb-4">
        <a href={data?.homepageUrl}>Homepage</a> |{' '}
        <a href={data?.url}>Github</a>
      </p>

      {data?.latestRelease ? (
        <p className="text-sm pb-4">
          <label>last release:</label>{' '}
          <a href={data?.latestRelease?.url}>{data?.latestRelease?.tagName}</a>{' '}
          at {publishedAt}
        </p>
      ) : undefined}

      <p className="text-xs">
        {data?.languages ? <Labels labels={data?.languages?.nodes} /> : <></>}
      </p>
      <ul className="flex-inline pt-4">
        <NavLink
          nameWithOwner={nameWithOwner}
          label="Overview"
          active={context?.url.endsWith(nameWithOwner)}
        />
        <NavLink
          nameWithOwner={nameWithOwner}
          label="Issues"
          active={context?.url.includes('/issues')}
          urlSuffix="issues"
        />
        <NavLink
          nameWithOwner={nameWithOwner}
          label="Pull Requests"
          active={context?.url.includes('/pulls')}
          urlSuffix="pulls"
        />
        <NavLink
          nameWithOwner={nameWithOwner}
          label="Readme"
          active={context?.url.includes('/readme')}
          urlSuffix="readme"
        />
      </ul>
      <div className="flex flex-row pt-4 w-full">{children}</div>
    </div>
  )
}

export default RepoLayout
