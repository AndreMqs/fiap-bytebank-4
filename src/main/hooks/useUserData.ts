import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import { GetBankUser } from '../../domain/usecases/GetBankUser'
import { userRepository } from '../../infra/repositories/UserRepository'
import { queryKeys } from '../../infra/react-query/queryKeys'
import { useEffect } from 'react'

const getUserUseCase = new GetBankUser(userRepository)

export function useUserData() {
  const { user: authUser } = useAuth()

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.user(authUser?.uid),
    queryFn: async () => {
      if (!authUser?.uid) {
        throw new Error('Usuário não autenticado')
      }
      return getUserUseCase.execute(authUser.uid)
    },
    enabled: !!authUser?.uid,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  useEffect(() => {
    if (error) {
      console.error('Erro ao buscar dados do usuário:', error)
    }
  }, [error])


  const formattedUser = user ? {
    id: user.id,
    name: user.name,
    balance: user.balance,
  } : null

  return {
    user: formattedUser,
    isLoading,
    error,
    refetch,
  }
}

