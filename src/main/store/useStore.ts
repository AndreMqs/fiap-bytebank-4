import { create } from 'zustand';
import { StoreState } from '../types/store';
import { TransactionFormData } from '../types/api';
import { useUser } from '../hooks/useParentApp';
import { bankRepository } from '../../infra/repositories/BankRepository';
import { GetBankUser } from '../../domain/usecases/GetBankUser';
import { GetBankTransactions } from '../../domain/usecases/GetBankTransactions';
import { AddBankTransaction } from '../../domain/usecases/AddBankTransaction';
import { DeleteBankTransaction } from '../../domain/usecases/DeleteBankTransaction';

const getBankUser = new GetBankUser(bankRepository);
const getBankTransactions = new GetBankTransactions(bankRepository);
const addBankTransaction = new AddBankTransaction(bankRepository);
const deleteBankTransaction = new DeleteBankTransaction(bankRepository);

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  transactions: [],
  isLoading: false,
  error: null,

  fetchUser: async () => {
    const { getUserName } = useUser();
    set({ isLoading: true, error: null });

    try {
      const user = await getBankUser.execute();
      const userName = getUserName();

      set({
        user: {
          ...user,
          name: userName !== 'Cliente' ? userName : user.name,
        },
        isLoading: false,
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      set({ error: 'Erro ao buscar usuário', isLoading: false });
    }
  },

  fetchTransactions: async () => {
    set({ isLoading: true, error: null });

    try {
      const transactions = await getBankTransactions.execute();
      set({ transactions, isLoading: false });
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      set({ error: 'Erro ao buscar transações', isLoading: false });
    }
  },

  addTransaction: async (formData: TransactionFormData) => {
    set({ isLoading: true, error: null });

    try {
      const newTransaction = await addBankTransaction.execute(formData);

      set((state) => ({
        transactions: [...state.transactions, newTransaction],
        user: state.user
          ? {
              ...state.user,
              balance:
                state.user.balance +
                (newTransaction.type === 'income'
                  ? newTransaction.value
                  : -newTransaction.value),
            }
          : null,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      set({ error: 'Erro ao adicionar transação', isLoading: false });
    }
  },

  deleteTransaction: async (id: number) => {
    set({ isLoading: true, error: null });

    try {
      await deleteBankTransaction.execute(id);

      const { transactions, user } = get();
      const transactionToDelete = transactions.find((t) => t.id === id);

      set({
        transactions: transactions.filter((t) => t.id !== id),
        user: user
          ? {
              ...user,
              balance:
                user.balance -
                (transactionToDelete
                  ? transactionToDelete.type === 'income'
                    ? transactionToDelete.value
                    : -transactionToDelete.value
                  : 0),
            }
          : null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      set({ error: 'Erro ao deletar transação', isLoading: false });
    }
  },

  // --- API usada pelos componentes atuais ---

  getTotalIncome: () => {
    const { transactions } = get();
    return transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.value, 0);
  },

  getTotalExpense: () => {
    const { transactions } = get();
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.value, 0);
  },

  getCategoryData: () => {
    const { transactions } = get();
    const categoryMap = new Map<string, number>();

    transactions.forEach((transaction) => {
      const current = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, current + transaction.value);
    });

    const colors = ['#2196F3', '#9C27B0', '#E91E63', '#FF9800', '#4CAF50'];

    return Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  },
}));
