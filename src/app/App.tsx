import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../infra/react-query/queryClient'
import RouterApp from './router'
import './App.styles.scss'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterApp />
    </QueryClientProvider>
  )
}