import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../infra/react-query/queryClient'
import RouterApp from './router'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterApp />
    </QueryClientProvider>
  )
}