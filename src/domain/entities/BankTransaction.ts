export type BankTransaction = {
  id: number
  type: 'income' | 'expense'
  value: number
  category: 'Alimentação' | 'Moradia' | 'Saúde' | 'Estudo' | 'Transporte'
  date: string
}
