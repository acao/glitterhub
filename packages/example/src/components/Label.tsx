import type React from 'react'

export interface LabelProps {
  name: string
  color: string
  key?: string
  size?: 'xs' | 'sm' | 'l' | 'md'
}

const DEFAULT_LABEL_COLOR = '#eee'

const Label: React.FC<LabelProps> = ({ name, color, size }) => {
  if(!color) {
    color = DEFAULT_LABEL_COLOR
  }
  return (
    <span
      className={`p-1 inline-flex m-1 drop-shadow-md dark:color-black dark:drop-shadow-md:grayscale-9 text-${
        size ?? 'xs'
      } `}
      style={{
        backgroundColor: color?.startsWith('#') ? color : `#${color}`,
        borderRadius: '4px',
      }}
      key={name}
    >
      {name}
    </span>
  )
}

export default Label
