import { BehaviorSubject } from 'rxjs'
import { Transaction } from '../../domain/entities/Transaction'
import { GetUserTransactions } from '../../domain/usecases/GetUserTransactions'
import { TransactionRepository } from '../../infra/repositories/TransactionRepository'

export type DashboardState = {
  loading: boolean
  error: string | null
  transactions: Transaction[]
}

const initialState: DashboardState = {
  loading: false,
  error: null,
  transactions: [],
}

export class DashboardViewModel {
  private state$ = new BehaviorSubject<DashboardState>(initialState)
  private getTransactionsUseCase: GetUserTransactions

  constructor() {
    const repo = new TransactionRepository()
    this.getTransactionsUseCase = new GetUserTransactions(repo)
  }

  get state() {
    return this.state$.asObservable()
  }

  async load(userId: string) {
    this.state$.next({ ...this.state$.value, loading: true, error: null })
    try {
      const transactions = await this.getTransactionsUseCase.execute(userId)
      this.state$.next({ loading: false, error: null, transactions })
    } catch (err: any) {
      this.state$.next({
        ...this.state$.value,
        loading: false,
        error: err?.message ?? 'Erro ao carregar transações',
      })
    }
  }
}

export const dashboardViewModel = new DashboardViewModel()