import { useReactive } from './useReactive'
import { authViewModel, AuthState } from '../viewmodels/auth/AuthViewModel'

export function useAuth(): AuthState & {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
} {
  const state = useReactive<AuthState>(authViewModel.state)

  return {
    ...(state || {
      user: null,
      loading: true,
      error: null,
      initialized: false,
      bypass: false,
    }),
    login: (email: string, password: string) => authViewModel.login(email, password),
    logout: () => authViewModel.logout(),
  }
}
