import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function LoginView() {
  const { user, loading, error, initialized, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (initialized && user) {
      navigate('/main', { replace: true })
    }
  }, [initialized, user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  if (!initialized) {
    return <div>Carregando sessão...</div>
  }

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: '0 auto' }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>
            Email
            <input
              style={{ display: 'block', width: '100%' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            Senha
            <input
              style={{ display: 'block', width: '100%' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </label>
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
    </div>
  )
}