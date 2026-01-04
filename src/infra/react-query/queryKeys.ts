export const queryKeys = {
  user: (userId?: string) => ['user', userId] as const,
  users: () => ['users'] as const,

  transactions: (userId?: string) => ['transactions', userId] as const,
  transaction: (id: string) => ['transaction', id] as const,
  transactionsByCategory: (userId?: string, category?: string) =>
    ['transactions', userId, 'category', category] as const,
  transactionsByType: (userId?: string, type?: string) =>
    ['transactions', userId, 'type', type] as const,

  investments: (userId?: string) => ['investments', userId] as const,
  investment: (id: string) => ['investment', id] as const,
  investmentsByType: (userId?: string, type?: string) =>
    ['investments', userId, 'type', type] as const,
} as const

