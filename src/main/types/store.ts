
import { User, Transaction, TransactionFormData } from './api';

export interface StoreState {
  user: User | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  fetchUser: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  addTransaction: (transaction: TransactionFormData) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  
  setUser: (user: User | null) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  getTotalIncome: () => number;
  getTotalExpense: () => number;
  getCategoryData: () => Array<{ name: string; value: number; color: string }>;
}

export type { UIStoreState } from '../store/useStore'; 