import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import { AddBankTransaction } from '../../domain/usecases/AddBankTransaction'
import { UpdateUser } from '../../domain/usecases/UpdateUser'
import { transactionRepository } from '../../infra/repositories/TransactionRepository'
import { userRepository } from '../../infra/repositories/UserRepository'
import { queryKeys } from '../../infra/react-query/queryKeys'
import { useStore } from '../store/useStore'
import { TransactionFormData as TransactionFormDataString } from '../types/transaction'
import { TransactionFormData } from '../types/api'

const addTransactionUseCase = new AddBankTransaction(transactionRepository)
const updateUserUseCase = new UpdateUser(userRepository)

export function useAddTransaction() {
  const { user: authUser } = useAuth()
  const queryClient = useQueryClient()
  const { user, setUser } = useStore()

  const mutation = useMutation({
    mutationFn: async (data: TransactionFormData | TransactionFormDataString) => {
      if (!authUser?.uid) {
        throw new Error('Usuário não autenticado')
      }

      const transactionValue = typeof data.value === 'string' 
        ? parseFloat(data.value.replace(',', '.')) 
        : data.value

      const transactionType = data.type === 'Receita' 
        ? 'income' 
        : data.type === 'Despesa' 
        ? 'expense' 
        : data.type

      const transactionDataForUseCase: TransactionFormDataString = {
        type: transactionType as 'income' | 'expense',
        category: data.category,
        value: typeof data.value === 'string' ? data.value : String(data.value),
        date: data.date,
      }

      const newTransaction = await addTransactionUseCase.execute(authUser.uid, transactionDataForUseCase)

      const balanceChange = transactionType === 'income' 
        ? transactionValue 
        : -transactionValue

      const newBalance = (user?.balance || 0) + balanceChange

      if (user) {
        await updateUserUseCase.execute(authUser.uid, {
          balance: newBalance,
        })
      }

      return { transaction: newTransaction, newBalance }
    },
    onSuccess: async (data, variables) => {
      if (user) {
        setUser({
          ...user,
          balance: data.newBalance,
        })
      }

      queryClient.resetQueries({ 
        queryKey: queryKeys.transactions(authUser?.uid)
      })
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.transactions(authUser?.uid),
        refetchType: 'active'
      })
      
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.user(authUser?.uid),
        refetchType: 'active'
      })

      await queryClient.refetchQueries({ 
        queryKey: queryKeys.transactions(authUser?.uid),
        type: 'active'
      })
    },
    onError: (error) => {
      console.error('Erro ao adicionar transação:', error)
    },
  })

  return {
    addTransaction: mutation.mutate,
    addTransactionAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  }
}

