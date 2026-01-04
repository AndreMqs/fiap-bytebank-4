import { useMemo } from 'react'
import { Transaction } from '../types/api'


export function useTransactionCalculations(transactions: Transaction[]) {
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.value, 0)
  }, [transactions])

  const totalExpense = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.value, 0)
  }, [transactions])

  const categoryData = useMemo(() => {
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
  }, [transactions])

  return {
    totalIncome,
    totalExpense,
    categoryData,
  }
}

