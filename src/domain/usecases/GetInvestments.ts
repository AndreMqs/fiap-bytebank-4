import { InvestmentRepository } from '../../infra/repositories/InvestmentRepository'
import { Investment } from '../entities/Investment'

export class GetInvestments {
  constructor(private repo: InvestmentRepository) {}

  async execute(userId: string): Promise<Investment[]> {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório')
    }

    return this.repo.getInvestments(userId)
  }
}

