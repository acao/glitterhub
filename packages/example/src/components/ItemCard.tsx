import React, { PropsWithChildren } from 'react'

type Stylable = {
  className?: string
} & PropsWithChildren

export const ItemCard: React.FC<Stylable> = ({ children, className }) => {
  return (
    <div className={`border-t-1 border-light pl-1 pr-1 pt-2 pb-2 hover:bg-light hover:text-dark transition-all duration-300${className}`}>
       {children}
    </div>
  )
}

export const Header: React.FC<Stylable> = ({ children, className }) => {
  return (
    <h3 className={`underline transition-colors text-sm pb-1 pt1 hover:text-1.20rem ${className}`}>
      {children}
    </h3>
  )
}
export const Body: React.FC<Stylable> = ({ children, className }) => {
    return <div className={`text-sm ${className}`}>{children}</div>
}
export const Footer: React.FC<Stylable> = ({ children, className }) => {
  return <div className={`text-xs ${className}`}>{children}</div>
}