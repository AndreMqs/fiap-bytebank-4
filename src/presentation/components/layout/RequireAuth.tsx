import React, { PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'

export function RequireAuth({ children }: PropsWithChildren) {
  const { user, initialized, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (initialized && !loading && !user) {
      navigate('/login', { replace: true })
    }
  }, [initialized, loading, user, navigate])

  if (!initialized || loading) {
    return <div>Verificando autenticação...</div>
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}