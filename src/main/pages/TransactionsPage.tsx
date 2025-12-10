import React, { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useReactive } from '../../hooks/useReactive'
import { dashboardViewModel } from '../../viewmodels/dashboard/DashboardViewModel'

export default function TransactionsPage() {
  const { user } = useAuth()
  const state = useReactive(dashboardViewModel.state)

  useEffect(() => {
    if (user?.uid) {
      dashboardViewModel.load(user.uid)
    }
  }, [user?.uid])

  if (!state) return null

  if (state.loading) return <div>Carregando transações...</div>
  if (state.error) return <div style={{ color: 'red' }}>{state.error}</div>

  return (
    <div style={{ padding: 24 }}>
      <h2>Extrato</h2>
      {state.transactions.length === 0 && <p>Nenhuma transação encontrada.</p>}
      <ul>
        {state.transactions.map((t) => (
          <li key={t.id}>
            <strong>{t.description}</strong> — {t.type === 'DEBIT' ? '-' : '+'}
            {t.amount.toFixed(2)} em {new Date(t.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  )
}