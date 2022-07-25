import React, { PropsWithChildren } from 'react'

export const ItemCard: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="border-t-1 border-light pl-1 pr-1 pt-2 pb-2 hover:bg-light hover:text-dark transition-all duration-300 ">
       {children}
    </div>
  )
}

export const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <h3 className="underline transition-colors text-sm pb-1 pt1 hover:text-1.20rem">
      {children}
    </h3>
  )
}
export const Body: React.FC<PropsWithChildren> = ({ children }) => {
    return <div className="text-sm">{children}</div>
}
export const Footer: React.FC<PropsWithChildren> = ({ children }) => {
    return <div className="text-xs">{children}</div>
}