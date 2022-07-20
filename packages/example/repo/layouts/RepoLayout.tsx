import React, { useState } from 'React'
import { graphql, useFragment } from 'react-relay'
import { usePageContext } from 'vilay'
import Labels from '../../components/Labels'

import type { RepoLayout_header$key } from './__generated__/RepoLayout_header.graphql'

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
    ? `/repo/${nameWithOwner}/${urlSuffix}`
    : `/repo/${nameWithOwner}`
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
        description
        homepageUrl
        nameWithOwner
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

  const context = { url: ''}
  // const [activeTab] = useState('overview')

  return (
    <div className="flex-col flex-grow">
      <h2 className="text-2xl pt-6">
        <a href={`/repo/${nameWithOwner}`}> {nameWithOwner} </a>
      </h2>
      <p>{data?.description}</p>
      <p className="text-sm">
        <a href={data?.homepageUrl}>Homepage</a>
      </p>
      <p className="text-sm">
        <strong>last release:</strong>{' '}
        <a href={data?.latestRelease?.url}>{data?.latestRelease?.tagName}</a> at{' '}
        {publishedAt}
      </p>
      <p className="text-xs">
       {data?.languages ?  <Labels labels={data?.languages?.nodes} /> : <></>}
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
      </ul>
      <div className="flex flex-row pt-4 w-full">{children}</div>
    </div>
  )
}

export default RepoLayout
