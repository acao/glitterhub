import type React from 'react'
import Label, { LabelProps } from './Label'

interface Props {
  labels: LabelProps[],
  size?: 'xs' | 'sm' | 'l' | 'md',
}

const Labels: React.FC<Props> = ({ labels, size }) => {
  if (!labels) return <></>
  return (
    <span className="transition-all duration-300">
      {labels.map((label) => (
        <Label {...label} size={size}  key={label.name} />
      ))}
    </span>
  )
}

export default Labels
