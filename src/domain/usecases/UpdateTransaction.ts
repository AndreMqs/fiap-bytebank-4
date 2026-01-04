import { TransactionRepository } from '../../infra/repositories/TransactionRepository'
import { BankTransaction } from '../entities/BankTransaction'
import { TransactionFormData } from '../../main/types/api'

export class UpdateTransaction {
  constructor(private repo: TransactionRepository) {}

  async execute(
    transactionId: string,
    data: Partial<TransactionFormData>
  ): Promise<BankTransaction> {
    if (!transactionId) {
      throw new Error('ID da transação é obrigatório')
    }

    if (data.value !== undefined) {
      const value =
        typeof data.value === 'string' ? parseFloat(data.value) : data.value
      if (isNaN(value) || value <= 0) {
        throw new Error('Valor deve ser um número positivo')
      }
    }

    if (data.date) {
      const date = new Date(data.date)
      if (isNaN(date.getTime())) {
        throw new Error('Data inválida')
      }
      if (date > new Date()) {
        throw new Error('Data não pode ser futura')
      }
    }

    if (data.type && !['income', 'expense'].includes(data.type)) {
      throw new Error('Tipo deve ser "income" ou "expense"')
    }

    return this.repo.updateTransaction(transactionId, data)
  }
}

