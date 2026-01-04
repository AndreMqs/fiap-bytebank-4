import { useInfiniteQuery } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import { transactionRepository } from '../../infra/repositories/TransactionRepository'
import { queryKeys } from '../../infra/react-query/queryKeys'
import { useMemo } from 'react'
import type { QueryDocumentSnapshot } from 'firebase/firestore'

const ITEMS_PER_PAGE = 20


export function useTransactionsData() {
  const { user: authUser } = useAuth()

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: queryKeys.transactions(authUser?.uid),
    queryFn: async ({ pageParam }) => {
      if (!authUser?.uid) {
        throw new Error('Usuário não autenticado')
      }
      
      return transactionRepository.getTransactionsPaginated(authUser.uid, {
        limit: ITEMS_PER_PAGE,
        startAfter: pageParam,
      })
    },
    getNextPageParam: (lastPage) => lastPage.lastDoc,
    enabled: !!authUser?.uid,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    initialPageParam: undefined,
  })

  // Flatten todas as páginas em um array único de transações
  const allTransactions = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap(page => page.transactions)
  }, [data?.pages])

  // Formatar transações para compatibilidade com componentes existentes
  const formattedTransactions = useMemo(() => {
    return allTransactions.map((t) => ({
      id: t.id,
      type: t.type,
      value: t.value,
      category: t.category,
      date: t.date,
    }))
  }, [allTransactions])

  return {
    transactions: formattedTransactions,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  }
}

