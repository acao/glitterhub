import React, { useContext, useState } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { PageLayoutProps } from 'vilay'
import '@unocss/reset/tailwind.css'
import 'uno.css'
import 'github-markdown-css/github-markdown.css'

import '../style.css'

import RecentlyStarred from '~/components/sidebar/RecentlyStarred'
import MyRepos from '~/components/sidebar/MyRepos'

const FF_AUTH = import.meta.env.FF_AUTH


export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  // true while the route is transitioning with `startTransition()`
  routeTransitioning,
}) => {
  const links = {
    '/acao': 'My Profile',
  }
  let token

  return (
    <div className="dark:bg-dark dark:text-slate-100">
      {/* <link
          href="https://unpkg.com/prismjs@v1.x/themes/prism.css"
          rel="stylesheet"
        />

        <script
          src="https://unpkg.com/prismjs@v1.x/components/prism-core.min.js"
          data-filter-selector=".highlight"
        ></script>
        <script src="https://unpkg.com/prismjs@v1.x/plugins/autoloader/prism-autoloader.min.js"></script> */}
      <LoadingIndicator transitioning={routeTransitioning} />
      <div className="flex m-auto flex-row">
        <div className="p-7 flex-shrink-0 flex flex-col items-end leading-3 max-w-320px text-right">
          <h1 className="my-6 text-2xl">Glitterhub ✨</h1>
          <p className="text-sm">
            This is not a github project! This is created by @acao from the
            vilay example
          </p>
          {!FF_AUTH || token ? (
            <>
              <div className="mt-4">
                {Object.entries(links).map(([href, text]) => (
                  <a
                    href={href}
                    key={href}
                    className="text-base hover:text-1.05rem transition-all duration-300"
                  >
                    {text}
                  </a>
                ))}
              </div>
              <RecentlyStarred />
              <MyRepos />
            </>
          ) : (
            <div className="mt-4">
              <a href="https://github-oauth.glitterhub.org/">Github Login</a>
            </div>
          )}
        </div>
        <div className="p-5 pb-14 flex flex-col pt-12 border-l-2 border-#eee min-h-screen w-full flex-grow">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <React.Suspense fallback={'Loading...'}>{children}</React.Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  )
}

const LoadingIndicator: React.FC<{ transitioning: boolean }> = ({
  transitioning,
}) => {
  return (
    <div
      className="absolute left-0 right-0 top-0 h-2 bg-green-200 transition-opacity duration-300"
      style={{ opacity: transitioning ? 100 : 0 }}
    />
  )
}

const ErrorFallback: React.FC<FallbackProps> = ({ error }) => {
  return <>Error: {error.message}</>
}
