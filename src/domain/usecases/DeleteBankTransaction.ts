import { BankRepository } from '../../infra/repositories/BankRepository'

export class DeleteBankTransaction {
  constructor(private repo: BankRepository) {}

  async execute(id: number): Promise<void> {
    return this.repo.deleteTransaction(id)
  }
}
