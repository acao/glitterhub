import React from 'react'
import type { PageContext } from 'vilay'
import { RouteManager, useRouteManager, VilayApp } from 'vilay'

interface Props {
  pageContext: PageContext
  routeManager: RouteManager
}

// Page root component
export const PageShell: React.FC<Props> = ({ pageContext, routeManager }) => {
  const PageLayout =
    pageContext.exports?.PageLayout ??
    pageContext.exports?.pageLayout ??
    Passthrough
  const [CurrentPage, queryRef, routeTransitioning] =
    useRouteManager(routeManager)

  return (
    <React.StrictMode>
      <VilayApp>
        <PageLayout routeTransitioning={routeTransitioning}>
          {CurrentPage && <CurrentPage queryRef={queryRef} />}
        </PageLayout>
      </VilayApp>
    </React.StrictMode>
  )
}

const Passthrough: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <>{children}</>
