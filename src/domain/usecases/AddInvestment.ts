import { InvestmentRepository } from '../../infra/repositories/InvestmentRepository'
import { Investment } from '../entities/Investment'
import { InvestmentFormData } from '../../infra/repositories/InvestmentRepository'

export class AddInvestment {
  constructor(private repo: InvestmentRepository) {}

  async execute(userId: string, data: InvestmentFormData): Promise<Investment> {
    if (!userId) {
      throw new Error('ID do usuário é obrigatório')
    }

    if (!data.type || !['renda_fixa', 'renda_variavel'].includes(data.type)) {
      throw new Error('Tipo deve ser "renda_fixa" ou "renda_variavel"')
    }

    if (!data.value || data.value <= 0) {
      throw new Error('Valor deve ser um número positivo')
    }

    return this.repo.addInvestment(userId, data)
  }
}

