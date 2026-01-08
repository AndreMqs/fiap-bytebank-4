import { UserRepository } from '../../infra/repositories/UserRepository'
import { BankUser } from '../entities/BankUser'

export interface UpdateUserData {
  name?: string
  balance?: number
}

export class UpdateUser {
  constructor(private repo: UserRepository) {}

  async execute(userId: string, data: UpdateUserData): Promise<BankUser> {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório')
    }

    if (data.name !== undefined && data.name.trim().length === 0) {
      throw new Error('Nome não pode ser vazio')
    }

    return this.repo.updateUser(userId, data)
  }
}

