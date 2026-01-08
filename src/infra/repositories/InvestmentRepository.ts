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
  type Firestore,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firebaseClient'
import { Investment } from '../../domain/entities/Investment'

export interface InvestmentDocument {
  userId: string
  type: 'renda_fixa' | 'renda_variavel'
  value: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface InvestmentFormData {
  type: 'renda_fixa' | 'renda_variavel'
  value: number
}

export class InvestmentRepository {
  constructor(private firestore: Firestore | null = db) {}

  async getInvestments(userId: string): Promise<Investment[]> {
    if (!this.firestore) {
      throw new Error('Firestore não está disponível')
    }

    const ref = collection(this.firestore, 'investments')
    const q = query(
      ref,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => {
      const data = doc.data() as InvestmentDocument
      return {
        id: doc.id,
        userId: data.userId,
        type: data.type,
        value: data.value,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      } as Investment
    })
  }

  async getInvestment(investmentId: string): Promise<Investment | null> {
    if (!this.firestore) {
      throw new Error('Firestore não está disponível')
    }

    const ref = doc(this.firestore, 'investments', investmentId)
    const snapshot = await getDoc(ref)

    if (!snapshot.exists()) {
      return null
    }

    const data = snapshot.data() as InvestmentDocument
    return {
      id: investmentId,
      userId: data.userId,
      type: data.type,
      value: data.value,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    } as Investment
  }

  async addInvestment(
    userId: string,
    data: InvestmentFormData
  ): Promise<Investment> {
    if (!this.firestore) {
      throw new Error('Firestore não está disponível')
    }

    const now = Timestamp.now()
    const investmentData: InvestmentDocument = {
      userId,
      type: data.type,
      value: data.value,
      createdAt: now,
      updatedAt: now,
    }

    const ref = collection(this.firestore, 'investments')
    const docRef = await addDoc(ref, investmentData)

    return {
      id: docRef.id,
      userId,
      type: data.type,
      value: data.value,
      createdAt: now,
      updatedAt: now,
    } as Investment
  }

  async updateInvestment(
    investmentId: string,
    data: Partial<InvestmentFormData>
  ): Promise<Investment> {
    if (!this.firestore) {
      throw new Error('Firestore não está disponível')
    }

    const ref = doc(this.firestore, 'investments', investmentId)
    const updateData: Partial<InvestmentDocument> = {
      updatedAt: Timestamp.now(),
    }

    if (data.type) {
      updateData.type = data.type
    }
    if (data.value !== undefined) {
      updateData.value = data.value
    }

    await updateDoc(ref, updateData)

    const updated = await this.getInvestment(investmentId)
    if (!updated) {
      throw new Error('Investimento não encontrado após atualização')
    }

    return updated
  }

  async deleteInvestment(investmentId: string): Promise<void> {
    if (!this.firestore) {
      throw new Error('Firestore não está disponível')
    }

    const ref = doc(this.firestore, 'investments', investmentId)
    await deleteDoc(ref)
  }
}

export const investmentRepository = new InvestmentRepository()

