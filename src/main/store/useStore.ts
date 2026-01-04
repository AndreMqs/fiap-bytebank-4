import { create } from 'zustand'
import { StoreState } from '../types/store'
import { Transaction } from '../types/api'

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  transactions: [],
  isLoading: false,
  error: null,

  fetchUser: async () => {
    console.warn(
      'fetchUser deve ser chamado via React Query. Use useQuery com queryKeys.user()'
    )
  },

  fetchTransactions: async () => {
    console.warn(
      'fetchTransactions deve ser chamado via React Query. Use useQuery com queryKeys.transactions()'
    )
  },

  addTransaction: async () => {
    console.warn(
      'addTransaction deve ser chamado via React Query Mutation. Use useMutation'
    )
  },

  deleteTransaction: async () => {
    console.warn(
      'deleteTransaction deve ser chamado via React Query Mutation. Use useMutation'
    )
  },

  setUser: (user: StoreState['user']) => {
    const current = get().user
    if (current?.id !== user?.id || current?.balance !== user?.balance || current?.name !== user?.name) {
      set({ user })
    }
  },
  setTransactions: (transactions: Transaction[]) => {
    const current = get().transactions
    if (current.length !== transactions.length || 
        current.some((t, i) => t.id !== transactions[i]?.id)) {
      set({ transactions })
    }
  },
  setLoading: (isLoading: boolean) => {
    const current = get().isLoading
    if (current !== isLoading) {
      set({ isLoading })
    }
  },
  setError: (error: string | null) => {
    const current = get().error
    if (current !== error) {
      set({ error })
    }
  },

  getTotalIncome: () => {
    const { transactions } = get()
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.value, 0)
  },

  getTotalExpense: () => {
    const { transactions } = get()
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.value, 0)
  },

  getCategoryData: () => {
    const { transactions } = get()
    const categoryMap = new Map<string, number>()

    transactions
      .filter((transaction) => transaction.type === 'expense')
      .forEach((transaction) => {
        const current = categoryMap.get(transaction.category) || 0
        categoryMap.set(transaction.category, current + transaction.value)
      })

    const colors = ['#2196F3', '#9C27B0', '#E91E63', '#FF9800', '#4CAF50']

    return Array.from(categoryMap.entries())
      .map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value)
  },
}))
