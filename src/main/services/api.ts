import { User, Transaction, TransactionFormData } from '../types';
import dbData from '../../db.json';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

let userCache: { data: User; at: number } | null = null
let transactionsCache: { data: Transaction[]; at: number } | null = null

const isFresh = (entry: { at: number }) => Date.now() - entry.at < CACHE_TTL


export const api = {
  async fetchUser(): Promise<User> {
    if (userCache && isFresh(userCache)) {
      return userCache.data;
    }

    await delay(300); 
    const user = dbData.user;
    userCache = { data: user, at: Date.now() };
    return user;
  },

  async fetchTransactions(): Promise<Transaction[]> {
    if (transactionsCache && isFresh(transactionsCache)) {
      return transactionsCache.data;
    }

    await delay(300); 
    const mapped = dbData.transactions.map(transaction => ({
      id: typeof transaction.id === 'string' ? parseInt(transaction.id) : transaction.id,
      type: transaction.type as 'income' | 'expense',
      value: transaction.value,
      category: transaction.category as 'Alimentação' | 'Moradia' | 'Saúde' | 'Estudo' | 'Transporte',
      date: transaction.date
    }));
    transactionsCache = { data: mapped, at: Date.now() };
    return mapped;
  },

  async addTransaction(transactionData: TransactionFormData): Promise<Transaction> {
    await delay(300); 
    
    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now(),
    };
    
    // Adicionar à lista local (em uma aplicação real, isso seria persistido)
    dbData.transactions.push(newTransaction);
    transactionsCache = null;
    
    return newTransaction;
  },

  async deleteTransaction(id: number): Promise<void> {
    await delay(300); // Simular delay de rede
    
    const index = dbData.transactions.findIndex(t => 
      typeof t.id === 'string' ? parseInt(t.id) === id : t.id === id
    );
    if (index !== -1) {
      dbData.transactions.splice(index, 1);
      transactionsCache = null;
    }
  },
}; 