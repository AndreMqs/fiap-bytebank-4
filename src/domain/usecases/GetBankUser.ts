import { BankRepository } from '../../infra/repositories/BankRepository'
import { BankUser } from '../entities/BankUser'

export class GetBankUser {
  constructor(private repo: BankRepository) {}

  async execute(): Promise<BankUser> {
    return this.repo.getUser()
  }
}
