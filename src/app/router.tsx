import { RouterProvider } from 'react-router-dom'
import { router } from './routerConfig'

export default function RouterApp() {
  return <RouterProvider router={router} />
}