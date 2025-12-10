import { api } from '../../main/services/api'
import { BankUser } from '../../domain/entities/BankUser'
import { BankTransaction } from '../../domain/entities/BankTransaction'
import { TransactionFormData } from '../../main/types/api'

/**
 * BankRepository
 *
 * Camada de infraestrutura responsável por conversar com a API (mockada em db.json hoje).
 * No futuro, basta adaptar estes métodos para consumir um backend real ou Firestore,
 * sem precisar alterar a camada de domínio ou de apresentação.
 */
export class BankRepository {
  async getUser(): Promise<BankUser> {
    const user = await api.fetchUser()
    return user as BankUser
  }

  async getTransactions(): Promise<BankTransaction[]> {
    const txs = await api.fetchTransactions()
    return txs as BankTransaction[]
  }

  async addTransaction(data: TransactionFormData): Promise<BankTransaction> {
    const tx = await api.addTransaction(data)
    return tx as BankTransaction
  }

  async deleteTransaction(id: number): Promise<void> {
    await api.deleteTransaction(id)
  }
}

export const bankRepository = new BankRepository()
