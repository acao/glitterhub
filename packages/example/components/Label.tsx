import type React from 'react'
export interface LabelProps {
  name: string
  color: string
  key: string
}
const Label: React.FC<LabelProps> = ({ name, color }) => {
  return (
    <span
      className={`p-1 inline-flex mr-1 drop-shadow-md dark:drop-shadow-md:grayscale-9 `}
      style={{
        backgroundColor: color?.startsWith('#') ? color : `#${color}`,
        borderRadius: '4px',
        textShadow: '3',
      }}
      key={name}
    >
      {name}
    </span>
  )
}

export default Label
