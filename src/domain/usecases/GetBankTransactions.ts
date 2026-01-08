import { TransactionRepository } from '../../infra/repositories/TransactionRepository'
import { BankTransaction } from '../entities/BankTransaction'

export class GetBankTransactions {
  constructor(private repo: TransactionRepository) {}

  async execute(userId: string): Promise<BankTransaction[]> {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório')
    }

    return this.repo.getTransactions(userId)
  }
}
