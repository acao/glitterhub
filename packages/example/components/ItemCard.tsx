import React, { PropsWithChildren } from 'react'

export const ItemCard: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="border-t-1 border-#eee pl-1 pt-2 pb-2 hover:bg-white hover:text-dark">
       {children}
    </div>
  )
}

export const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <h3 className="underline transition-colors hover:text-gray-500 text-sm">
      {children}
    </h3>
  )
}
export const Body: React.FC<PropsWithChildren> = ({ children }) => {
    return <p className="text-sm">{children}</p>
}
export const Footer: React.FC<PropsWithChildren> = ({ children }) => {
    return <p className="text-xs">{children}</p>
}