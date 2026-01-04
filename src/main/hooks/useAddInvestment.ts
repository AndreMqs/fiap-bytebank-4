import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import { AddInvestment } from '../../domain/usecases/AddInvestment'
import { investmentRepository } from '../../infra/repositories/InvestmentRepository'
import { queryKeys } from '../../infra/react-query/queryKeys'

const addInvestmentUseCase = new AddInvestment(investmentRepository)

export function useAddInvestment() {
  const { user: authUser } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: { type: 'renda_fixa' | 'renda_variavel'; value: number }) => {
      if (!authUser?.uid) {
        throw new Error('Usuário não autenticado')
      }

      return addInvestmentUseCase.execute(authUser.uid, data)
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.investments(authUser?.uid),
        refetchType: 'active'
      })
      
      await queryClient.refetchQueries({ 
        queryKey: queryKeys.investments(authUser?.uid),
        type: 'active'
      })
    },
    onError: (error) => {
      console.error('Erro ao adicionar investimento:', error)
    },
  })

  return {
    addInvestment: mutation.mutate,
    addInvestmentAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  }
}

