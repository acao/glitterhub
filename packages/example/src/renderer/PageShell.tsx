import React from 'react'
import { RelayEnvironmentProvider, type Environment } from 'react-relay'
import type { PageContext } from 'vilay'
import { RouteManager, useRouteManager } from 'vilay'
import { LoginContextProvider } from '../service/useLoginContext'
import { PageContextProvider } from './usePageContext'

interface Props {
  pageContext: PageContext
  relayEnvironment: Environment
  routeManager: RouteManager
}

// Page root component
export const PageShell: React.FC<Props> = ({
  pageContext,
  relayEnvironment,
  routeManager,
}) => {
  const PageLayout =
    pageContext.exports?.PageLayout ??
    pageContext.exports?.pageLayout ??
    Passthrough
  const [CurrentPage, queryRef, routeTransitioning] =
    useRouteManager(routeManager)

    console.log('my page shell')

  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
      <LoginContextProvider>
        <RelayEnvironmentProvider environment={relayEnvironment}>
          
            <PageLayout routeTransitioning={routeTransitioning}>
              {CurrentPage && <CurrentPage queryRef={queryRef} />}
            </PageLayout>
         
        </RelayEnvironmentProvider>
        </LoginContextProvider>
      </PageContextProvider>
    </React.StrictMode>
  )
}

const Passthrough: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <>{children}</>
