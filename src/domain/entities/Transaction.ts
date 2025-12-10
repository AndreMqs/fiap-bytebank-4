export type Transaction = {
  id: string
  date: string
  description: string
  type: 'DEBIT' | 'CREDIT'
  amount: number
}