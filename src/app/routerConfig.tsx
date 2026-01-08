import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RequireAuth } from '../presentation/components/layout/RequireAuth'
import { RouteLoadingFallback } from '../presentation/components/layout/LoadingFallback'
import { lazy, Suspense } from 'react'

const HomeModule = lazy(() => import('../home/App'))
const MainModule = lazy(() => import('../main/App'))

export const prefetchRoute = (route: 'home' | 'main') => {
  if (route === 'home') {
    void import('../home/App')
  } else if (route === 'main') {
    void import('../main/App')
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

