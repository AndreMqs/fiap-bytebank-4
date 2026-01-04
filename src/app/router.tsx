import React, { Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { RequireAuth } from '../presentation/components/layout/RequireAuth'
import { RouteLoadingFallback } from '../presentation/components/layout/LoadingFallback'

const HomeModule = React.lazy(() => import('../home/App'))
const MainModule = React.lazy(() => import('../main/App'))

export const prefetchRoute = (route: 'home' | 'main') => {
  if (route === 'home') {
    import('../home/App')
  } else if (route === 'main') {
    import('../main/App')
  }
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<RouteLoadingFallback />}>
        <HomeModule />
      </Suspense>
    ),
  },
  {
    path: '/main',
    element: (
      <RequireAuth>
        <Suspense fallback={<RouteLoadingFallback />}>
          <MainModule />
        </Suspense>
      </RequireAuth>
    ),
  },
  {
    path: '*',
    element: <Navigate to='/' replace />,
  },
])

export default function RouterApp() {
  return <RouterProvider router={router} />
}