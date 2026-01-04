import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  type Firestore,
  Timestamp,
} from 'firebase/firestore'
import { db } from '../firebase/firebaseClient'
import { BankUser } from '../../domain/entities/BankUser'

export interface UserDocument {
  id: string
  name: string
  email: string
  balance: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export class UserRepository {
  constructor(private firestore: Firestore | null = db) {}

  async getUser(userId: string): Promise<BankUser> {
    if (!this.firestore) {
      throw new Error('Firestore não está disponível')
    }

    const userRef = doc(this.firestore, 'users', userId)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      throw new Error(`Usuário com ID ${userId} não encontrado`)
    }

    const data = userSnap.data() as UserDocument

    return {
      id: parseInt(userId) || 0,
      name: data.name,
      balance: data.balance,
    }
  }

  async createUser(
    userId: string,
    data: { name: string; email: string; balance?: number }
  ): Promise<BankUser> {
    if (!this.firestore) {
      throw new Error('Firestore não está disponível')
    }

    const now = Timestamp.now()
    const userData: UserDocument = {
      id: userId,
      name: data.name,
      email: data.email,
      balance: data.balance || 0,
      createdAt: now,
      updatedAt: now,
    }

    const userRef = doc(this.firestore, 'users', userId)
    await setDoc(userRef, userData)

    return {
      id: parseInt(userId) || 0,
      name: data.name,
      balance: data.balance || 0,
    }
  }

  async updateUser(
    userId: string,
    data: Partial<{ name: string; balance: number }>
  ): Promise<BankUser> {
    if (!this.firestore) {
      throw new Error('Firestore não está disponível')
    }

    const userRef = doc(this.firestore, 'users', userId)
    const updateData: Partial<UserDocument> = {
      ...data,
      updatedAt: Timestamp.now(),
    }

    await updateDoc(userRef, updateData)

    return this.getUser(userId)
  }

  async updateBalance(userId: string, newBalance: number): Promise<void> {
    if (!this.firestore) {
      throw new Error('Firestore não está disponível')
    }

    const userRef = doc(this.firestore, 'users', userId)
    await updateDoc(userRef, {
      balance: newBalance,
      updatedAt: Timestamp.now(),
    })
  }
}

export const userRepository = new UserRepository()

