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
      className={`p-1 inline-flex m-1 drop-shadow-md hover:text-.9rem hover:p-1.05 dark:color-black dark:drop-shadow-md:grayscale-9 rounded-4px text-${
        size ?? 'xs'
      }`}
      style={{
        backgroundColor: color?.startsWith('#') ? color : `#${color}`,
      }}
      key={name}
    >
      {name}
    </span>
  )
}

export default Label
