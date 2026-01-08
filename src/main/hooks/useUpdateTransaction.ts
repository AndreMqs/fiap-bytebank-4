import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import { UpdateTransaction } from '../../domain/usecases/UpdateTransaction'
import { UpdateUser } from '../../domain/usecases/UpdateUser'
import { GetBankUser } from '../../domain/usecases/GetBankUser'
import { transactionRepository } from '../../infra/repositories/TransactionRepository'
import { userRepository } from '../../infra/repositories/UserRepository'
import { queryKeys } from '../../infra/react-query/queryKeys'
import { TransactionFormData as TransactionFormDataString } from '../types/transaction'
import { TransactionFormData } from '../types/api'

const updateTransactionUseCase = new UpdateTransaction(transactionRepository)
const updateUserUseCase = new UpdateUser(userRepository)
const getUserUseCase = new GetBankUser(userRepository)

/**
 * Hook para atualizar transação usando React Query Mutation
 * 
 * Invalida queries automaticamente após sucesso.
 * Não usa Zustand - React Query gerencia o estado.
 */
export function useUpdateTransaction() {
  const { user: authUser } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ transactionId, data }: { 
      transactionId: number; // ID numérico
      data: Partial<TransactionFormDataString> 
    }) => {
      if (!authUser?.uid) {
        throw new Error('Usuário não autenticado')
      }

      const result = await transactionRepository.getTransactionByNumericId(
        authUser.uid,
        transactionId
      )
      
      if (!result) {
        console.error('Transação não encontrada com ID:', transactionId)
        throw new Error('Transação não encontrada')
      }

      const { transaction: currentTransaction, firestoreId } = result

      const updateData: Partial<TransactionFormData> = {}
      if (data.type) updateData.type = data.type as 'income' | 'expense'
      if (data.category) updateData.category = data.category as 'Alimentação' | 'Moradia' | 'Saúde' | 'Estudo' | 'Transporte'
      if (data.value !== undefined) {
        updateData.value = typeof data.value === 'string' 
          ? parseFloat(data.value.replace(',', '.')) 
          : data.value
      }
      if (data.date) updateData.date = data.date

      const updatedTransaction = await updateTransactionUseCase.execute(firestoreId, updateData)

      const oldValue = currentTransaction.value
      const newValue = typeof data.value === 'string' 
        ? parseFloat(data.value.replace(',', '.')) 
        : (data.value !== undefined ? data.value : oldValue)

      const oldType = currentTransaction.type
      const newType = data.type || oldType

      const oldBalanceChange = oldType === 'income' ? oldValue : -oldValue
      const newBalanceChange = newType === 'income' ? newValue : -newValue
      const balanceDiff = newBalanceChange - oldBalanceChange

      const currentUser = await getUserUseCase.execute(authUser.uid)
      const newBalance = currentUser.balance + balanceDiff

      await updateUserUseCase.execute(authUser.uid, {
        balance: newBalance,
      })

      return { transaction: updatedTransaction, newBalance }
    },
    onSuccess: async () => {
      if (!authUser?.uid) return;
      await Promise.all([
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.transactions(authUser.uid),
          refetchType: 'active'
        }),
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.user(authUser.uid),
          refetchType: 'active'
        })
      ])
      
      await Promise.all([
        queryClient.refetchQueries({ 
          queryKey: queryKeys.user(authUser.uid)
        }),
        queryClient.refetchQueries({ 
          queryKey: queryKeys.transactions(authUser.uid)
        })
      ])
    },
    onError: (error) => {
      console.error('Erro ao atualizar transação:', error)
    },
  })

  return {
    updateTransaction: mutation.mutate,
    updateTransactionAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  }
}

