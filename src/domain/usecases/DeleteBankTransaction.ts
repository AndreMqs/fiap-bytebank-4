import { TransactionRepository } from '../../infra/repositories/TransactionRepository'

export class DeleteBankTransaction {
  constructor(private repo: TransactionRepository) {}

  async execute(transactionId: string): Promise<void> {
    if (!transactionId) {
      throw new Error('ID da transação é obrigatório')
    }

    return this.repo.deleteTransaction(transactionId)
  }
}
