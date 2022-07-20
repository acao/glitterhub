import type React from 'react'
import Label, { LabelProps } from './Label'

interface Props {
  labels: LabelProps[]
}

const Labels: React.FC<Props> = ({ labels }) => {
  if (!labels) return <></>
  return (
    <>
      {labels.map((label) => (
        <Label {...label}  key={label.name} />
      ))}
    </>
  )
}

export default Labels
