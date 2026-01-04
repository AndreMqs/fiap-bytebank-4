// src/domain/entities/Investment.ts
import { Timestamp } from 'firebase/firestore'

export type Investment = {
  id: string
  userId: string
  type: 'renda_fixa' | 'renda_variavel'
  value: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

