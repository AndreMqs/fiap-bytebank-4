import { Transaction } from '../entities/Transaction'
import { TransactionRepository } from '../../infra/repositories/TransactionRepository'

export class GetUserTransactions {
  constructor(private repo: TransactionRepository) {}

  async execute(userId: string): Promise<Transaction[]> {
    return this.repo.getUserTransactions(userId)
  }
}