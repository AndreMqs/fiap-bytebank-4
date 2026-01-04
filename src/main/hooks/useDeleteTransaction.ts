import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import { DeleteBankTransaction } from '../../domain/usecases/DeleteBankTransaction'
import { UpdateUser } from '../../domain/usecases/UpdateUser'
import { GetBankUser } from '../../domain/usecases/GetBankUser'
import { transactionRepository } from '../../infra/repositories/TransactionRepository'
import { userRepository } from '../../infra/repositories/UserRepository'
import { queryKeys } from '../../infra/react-query/queryKeys'
import { useStore } from '../store/useStore'

const deleteTransactionUseCase = new DeleteBankTransaction(transactionRepository)
const updateUserUseCase = new UpdateUser(userRepository)
const getUserUseCase = new GetBankUser(userRepository)

export function useDeleteTransaction() {
  const { user: authUser } = useAuth()
  const queryClient = useQueryClient()
  const { user, setUser } = useStore()

  const mutation = useMutation({
    mutationFn: async (transactionId: number) => {
      if (!authUser?.uid) {
        throw new Error('Usuário não autenticado')
      }

      const result = await transactionRepository.getTransactionByNumericId(
        authUser.uid,
        transactionId
      )
      
      if (!result) {
        throw new Error('Transação não encontrada')
      }

      const { transaction, firestoreId } = result

      await deleteTransactionUseCase.execute(firestoreId)

      const balanceChange = transaction.type === 'income' 
        ? -transaction.value 
        : transaction.value

      const currentUser = await getUserUseCase.execute(authUser.uid)
      const newBalance = currentUser.balance + balanceChange

      await updateUserUseCase.execute(authUser.uid, {
        balance: newBalance,
      })

      return { newBalance }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions(authUser?.uid) })
      queryClient.invalidateQueries({ queryKey: queryKeys.user(authUser?.uid) })

      if (user) {
        setUser({
          ...user,
          balance: data.newBalance,
        })
      }
    },
    onError: (error) => {
      console.error('Erro ao deletar transação:', error)
    },
  })

  return {
    deleteTransaction: mutation.mutate,
    deleteTransactionAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  }
}

