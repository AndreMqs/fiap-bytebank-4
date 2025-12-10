import React, { Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { RequireAuth } from '../presentation/components/layout/RequireAuth'

const LoginView = React.lazy(() => import('../presentation/views/LoginView'))
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
    path: '/login',
    element: (
      <Suspense fallback={<div>Carregando...</div>}>
        <LoginView />
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