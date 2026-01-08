import { UserRepository } from '../../infra/repositories/UserRepository'
import { BankUser } from '../entities/BankUser'

export class GetUser {
  constructor(private repo: UserRepository) {}

  async execute(userId: string): Promise<BankUser> {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório')
    }

    return this.repo.getUser(userId)
  }
}

