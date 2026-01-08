import { TransactionRepository } from '../../infra/repositories/TransactionRepository'
import { BankTransaction } from '../entities/BankTransaction'
import { TransactionFormData } from '../../main/types/api'

export class AddBankTransaction {
  constructor(private repo: TransactionRepository) {}

  async execute(userId: string, data: TransactionFormData): Promise<BankTransaction> {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório')
    }

    if (!data.type || !['income', 'expense'].includes(data.type)) {
      throw new Error('Tipo deve ser "income" ou "expense"')
    }

    const value = typeof data.value === 'string' ? parseFloat(data.value) : data.value
    if (isNaN(value) || value <= 0) {
      throw new Error('Valor deve ser um número positivo')
    }

    if (!data.category) {
      throw new Error('Categoria é obrigatória')
    }

    if (!data.date) {
      throw new Error('Data é obrigatória')
    }

    const date = new Date(data.date)
    if (isNaN(date.getTime())) {
      throw new Error('Data inválida')
    }

    if (date > new Date()) {
      throw new Error('Data não pode ser futura')
    }

    return this.repo.addTransaction(userId, data)
  }
}
