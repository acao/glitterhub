import Label from '~/components/Label'

type Props = {
  repo: unknown
  size?: 'xs' | 'sm' | 'l' | 'md',
  labelSize?: 'xs' | 'sm' | 'l' | 'md'
}





const RepoLink: React.FC<Props> = ({ repo, labelSize = 'sm', size = 'md' }) => {
  return (
    <span className={`text-${size}`}>
      <a href={`/${repo?.owner?.login}`}>{repo?.owner?.login}</a>/
      <a href={`/${repo?.owner?.login}/${repo?.name}`}>{repo.name}</a>
      {repo?.isFork && (
        <Label size={labelSize} name="Fork" color="#eee" />
      )}{' '}
      {repo?.isPrivate && (
        <Label size={labelSize} name="Private" color="#eee" />
      )}
      {repo?.isAchived && (
        <Label size={labelSize} name="Archived" color="#eee" />
      )}
    </span>
  )
}

export default RepoLink
