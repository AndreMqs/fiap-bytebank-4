import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from '../firebase/firebaseClient'
import { Transaction } from '../../domain/entities/Transaction'

export class TransactionRepository {
  async getUserTransactions(userId: string): Promise<Transaction[]> {
    const ref = collection(db, 'transactions')
    const q = query(ref, where('userId', '==', userId), orderBy('date', 'desc'))

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => {
      const data = doc.data() as any
      return {
        id: doc.id,
        date: data.date,
        description: data.description,
        type: data.type,
        amount: data.amount,
      } as Transaction
    })
  }
}