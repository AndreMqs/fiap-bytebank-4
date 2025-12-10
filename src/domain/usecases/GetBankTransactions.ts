import { BankRepository } from '../../infra/repositories/BankRepository'
import { BankTransaction } from '../entities/BankTransaction'

export class GetBankTransactions {
  constructor(private repo: BankRepository) {}

  async execute(): Promise<BankTransaction[]> {
    return this.repo.getTransactions()
  }
}
