import { useInfiniteQuery } from '@tanstack/react-query'
import { useAuth } from '../../hooks/useAuth'
import { transactionRepository } from '../../infra/repositories/TransactionRepository'
import { queryKeys } from '../../infra/react-query/queryKeys'
import { useStore } from '../store/useStore'
import { useEffect, useMemo, useRef } from 'react'
import type { QueryDocumentSnapshot } from 'firebase/firestore'

const ITEMS_PER_PAGE = 20

export function useTransactionsData() {
  const { user: authUser } = useAuth()
  const { setTransactions, setLoading } = useStore()

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

  const allTransactions = useMemo(() => {
    if (!data?.pages) return []
    return data.pages.flatMap(page => page.transactions)
  }, [data?.pages])

  const transactionsKey = useMemo(() => {
    return allTransactions.map(t => `${t.id}-${t.type}-${t.value}-${t.date}`).join('|')
  }, [allTransactions])

  const lastTransactionsRef = useRef<string>('')

  useEffect(() => {
    if (isFetchingNextPage && lastTransactionsRef.current === transactionsKey) return;
    
    const mappedTransactions = allTransactions.map((t) => ({
      id: t.id,
      type: t.type,
      value: t.value,
      category: t.category,
      date: t.date,
    }))
    
    if (lastTransactionsRef.current !== transactionsKey) {
      lastTransactionsRef.current = transactionsKey
      setTransactions(mappedTransactions)
    }
  }, [transactionsKey, isFetchingNextPage])

  const lastLoadingRef = useRef<boolean>(false)
  useEffect(() => {
    const newLoading = isLoading || isFetchingNextPage
    if (lastLoadingRef.current !== newLoading) {
      lastLoadingRef.current = newLoading
      setLoading(newLoading)
    }
  }, [isLoading, isFetchingNextPage, setLoading])

  return {
    transactions: allTransactions,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  }
}

