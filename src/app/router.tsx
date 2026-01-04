import React, { Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { RequireAuth } from '../presentation/components/layout/RequireAuth'

const HomeModule = React.lazy(() => import('../home/App'))
const MainModule = React.lazy(() => import('../main/App'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<div>Carregando...</div>}>
        <HomeModule />
      </Suspense>
    ),
  },
  {
    path: '/main',
    element: (
      <RequireAuth>
        <Suspense fallback={<div>Carregando área logada...</div>}>
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