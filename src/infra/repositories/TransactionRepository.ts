import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  where,
  limit,
  startAfter,
  type Firestore,
  type QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firebaseClient'
import { BankTransaction } from '../../domain/entities/BankTransaction'
import { TransactionFormData } from '../../main/types/api'

export interface TransactionDocument {
  userId: string
  type: 'income' | 'expense'
  category: 'Alimentação' | 'Moradia' | 'Saúde' | 'Estudo' | 'Transporte'
  value: number
  date: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface PaginationOptions {
  limit?: number
  startAfter?: QueryDocumentSnapshot
}

export class TransactionRepository {
  private idMap = new Map<number, string>()

  constructor(private firestore: Firestore | null = db) {}

  async getTransactions(userId: string): Promise<BankTransaction[]> {
    if (!this.firestore) {
      throw new Error('Firestore não está disponível')
    }

    const ref = collection(this.firestore, 'transactions')
    const q = query(
      ref,
      where('userId', '==', userId),
      orderBy('date', 'desc')
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => {
      const data = doc.data() as TransactionDocument
      const idNumber = this.hashStringToNumber(doc.id)
      this.idMap.set(idNumber, doc.id)
      return {
        id: idNumber,
        type: data.type,
        value: data.value,
        category: data.category,
        date: data.date,
      } as BankTransaction
    })
  }

  async getTransactionsPaginated(
    userId: string,
    options: PaginationOptions = {}
  ): Promise<{
    transactions: BankTransaction[]
    lastDoc: QueryDocumentSnapshot | null
  }> {
    if (!this.firestore) {
      throw new Error('Firestore não está disponível')
    }

    const ref = collection(this.firestore, 'transactions')
    const limitCount = options.limit || 20

    let q = query(
      ref,
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(limitCount)
    )

    if (options.startAfter) {
      q = query(
        ref,
        where('userId', '==', userId),
        orderBy('date', 'desc'),
        startAfter(options.startAfter),
        limit(limitCount)
      )
    }

    const snapshot = await getDocs(q)
    const transactions = snapshot.docs.map((doc) => {
      const data = doc.data() as TransactionDocument
      const idNumber = this.hashStringToNumber(doc.id)
      this.idMap.set(idNumber, doc.id)
      return {
        id: idNumber,
        type: data.type,
        value: data.value,
        category: data.category,
        date: data.date,
      } as BankTransaction
    })

    const lastDoc =
      snapshot.docs.length === limitCount && snapshot.docs.length > 0
        ? snapshot.docs[snapshot.docs.length - 1]
        : null

    return { transactions, lastDoc }
  }

  async getTransaction(
    transactionId: string
  ): Promise<BankTransaction | null> {
    if (!this.firestore) {
      throw new Error('Firestore não está disponível')
    }

    const ref = doc(this.firestore, 'transactions', transactionId)
    const snapshot = await getDoc(ref)

    if (!snapshot.exists()) {
      return null
    }

    const data = snapshot.data() as TransactionDocument
    const idNumber = this.hashStringToNumber(transactionId)
    this.idMap.set(idNumber, transactionId)
    return {
      id: idNumber,
      type: data.type,
      value: data.value,
      category: data.category,
      date: data.date,
    } as BankTransaction
  }

  async addTransaction(
    userId: string,
    data: TransactionFormData
  ): Promise<BankTransaction> {
    if (!this.firestore) {
      throw new Error('Firestore não está disponível')
    }

    const now = Timestamp.now()
    const transactionData: TransactionDocument = {
      userId,
      type: data.type as 'income' | 'expense',
      category: data.category as
        | 'Alimentação'
        | 'Moradia'
        | 'Saúde'
        | 'Estudo'
        | 'Transporte',
      value: typeof data.value === 'string' ? parseFloat(data.value) : data.value,
      date: data.date,
      createdAt: now,
      updatedAt: now,
    }

    const ref = collection(this.firestore, 'transactions')
    const docRef = await addDoc(ref, transactionData)

    const idNumber = this.hashStringToNumber(docRef.id)

    this.idMap.set(idNumber, docRef.id)

    return {
      id: idNumber,
      type: transactionData.type,
      value: transactionData.value,
      category: transactionData.category,
      date: transactionData.date,
    } as BankTransaction
  }

  async updateTransaction(
    transactionId: string,
    data: Partial<TransactionFormData>
  ): Promise<BankTransaction> {
    if (!this.firestore) {
      throw new Error('Firestore não está disponível')
    }

    const ref = doc(this.firestore, 'transactions', transactionId)
    const updateData: Partial<TransactionDocument> = {
      updatedAt: Timestamp.now(),
    }

    if (data.type) {
      updateData.type = data.type as 'income' | 'expense'
    }
    if (data.category) {
      updateData.category = data.category as
        | 'Alimentação'
        | 'Moradia'
        | 'Saúde'
        | 'Estudo'
        | 'Transporte'
    }
    if (data.value !== undefined) {
      updateData.value =
        typeof data.value === 'string'
          ? parseFloat(data.value)
          : data.value
    }
    if (data.date) {
      updateData.date = data.date
    }

    await updateDoc(ref, updateData)

    const updated = await this.getTransaction(transactionId)
    if (!updated) {
      throw new Error('Transação não encontrada após atualização')
    }

    return updated
  }

  async deleteTransaction(transactionId: string): Promise<void> {
    if (!this.firestore) {
      throw new Error('Firestore não está disponível')
    }

    const ref = doc(this.firestore, 'transactions', transactionId)
    await deleteDoc(ref)
  }

  getFirestoreId(numericId: number): string | null {
    return this.idMap.get(numericId) || null
  }

  async getTransactionByNumericId(
    userId: string,
    numericId: number
  ): Promise<{ transaction: BankTransaction; firestoreId: string } | null> {
    if (!this.firestore) {
      throw new Error('Firestore não está disponível')
    }

    const firestoreId = this.getFirestoreId(numericId)
    if (firestoreId) {
      const transaction = await this.getTransaction(firestoreId)
      if (transaction && transaction.id === numericId) {
        return { transaction, firestoreId }
      }
    }

    const ref = collection(this.firestore, 'transactions')
    const q = query(
      ref,
      where('userId', '==', userId),
      orderBy('date', 'desc')
    )
    const snapshot = await getDocs(q)
    
    for (const docSnap of snapshot.docs) {
      const idNumber = this.hashStringToNumber(docSnap.id)
      this.idMap.set(idNumber, docSnap.id)
      if (idNumber === numericId) {
        const data = docSnap.data() as TransactionDocument
        const transaction: BankTransaction = {
          id: idNumber,
          type: data.type,
          value: data.value,
          category: data.category,
          date: data.date,
        }
        return { transaction, firestoreId: docSnap.id }
      }
    }
    
    return null
  }

  private hashStringToNumber(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash) % 2147483647
  }
}

export const transactionRepository = new TransactionRepository()
