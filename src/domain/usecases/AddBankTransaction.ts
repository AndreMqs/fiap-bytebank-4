import { BankRepository } from '../../infra/repositories/BankRepository'
import { BankTransaction } from '../entities/BankTransaction'
import { TransactionFormData } from '../../main/types/api'

export class AddBankTransaction {
  constructor(private repo: BankRepository) {}

  async execute(data: TransactionFormData): Promise<BankTransaction> {
    return this.repo.addTransaction(data)
  }
}
