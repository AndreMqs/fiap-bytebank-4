// src/viewmodels/auth/AuthViewModel.ts
import { BehaviorSubject } from 'rxjs'
import { auth, firebaseEnabled, db } from '../../infra/firebase/firebaseClient'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { secureStorage } from '../../infra/crypto/secureStorage'
import { userRepository } from '../../infra/repositories/UserRepository'

export type AuthUser = {
  uid: string
  email?: string | null
}

export type AuthState = {
  user: AuthUser | null
  loading: boolean
  error: string | null
  initialized: boolean
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
}

export class AuthViewModel {
  private state$ = new BehaviorSubject<AuthState>(initialState)

  constructor() {
    const savedUser = secureStorage.get<AuthUser>('auth_user')

    if (!firebaseEnabled || !auth) {
      this.state$.next({
        ...this.state$.value,
        user: savedUser || null,
        initialized: true,
      })
      return
    }

    onAuthStateChanged(auth, (fbUser) => {
      const current = this.state$.value

      const user = fbUser ? this.mapFirebaseUser(fbUser) : null

      if (user) {
        secureStorage.set('auth_user', user)
      } else {
        secureStorage.remove('auth_user')
      }

      this.state$.next({
        ...current,
        user,
        loading: false,
        error: null,
        initialized: true,
      })
    })
  }

  private mapFirebaseUser(fbUser: FirebaseUser): AuthUser {
    return {
      uid: fbUser.uid,
      email: fbUser.email,
    }
  }

  get state() {
    return this.state$.asObservable()
  }

  async login(email: string, password: string) {
    if (!firebaseEnabled || !auth) {
      this.state$.next({
        ...this.state$.value,
        loading: false,
        error: 'Firebase não está disponível. Verifique a configuração.',
        initialized: true,
      })
      return
    }

    this.state$.next({ ...this.state$.value, loading: true, error: null })
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const user = this.mapFirebaseUser(cred.user)

      secureStorage.set('auth_user', user)

      // Buscar dados do usuário no Firestore (se disponível)
      // Isso será feito nos componentes que usam React Query

      this.state$.next({
        user,
        loading: false,
        error: null,
        initialized: true,
      })
    } catch (err: unknown) {
      let errorMessage = 'Erro ao autenticar'
      const error = err as { code?: string; message?: string; error?: { message?: string } }
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário ou senha inválida'
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Usuário ou senha inválida'
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Usuário ou senha inválida'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.'
      } else if (error.error?.message === 'INVALID_LOGIN_CREDENTIALS' || 
                 error.message?.includes('INVALID_LOGIN_CREDENTIALS')) {
        errorMessage = 'Usuário ou senha inválida'
      } else if (typeof error.message === 'string' && error.message.includes('auth/invalid-credential')) {
        errorMessage = 'Usuário ou senha inválida'
      } else if (error.message && !error.message.includes('Firebase:')) {
        errorMessage = error.message
      }

      this.state$.next({
        ...this.state$.value,
        loading: false,
        error: errorMessage,
        initialized: true,
      })
    }
  }

  async register(email: string, password: string, name: string) {
    // Validações
    if (!email || !email.includes('@')) {
      this.state$.next({
        ...this.state$.value,
        loading: false,
        error: 'Email inválido',
        initialized: true,
      })
      return
    }

    if (!password || password.length < 6) {
      this.state$.next({
        ...this.state$.value,
        loading: false,
        error: 'Senha deve ter no mínimo 6 caracteres',
        initialized: true,
      })
      return
    }

    if (!name || name.trim().length === 0) {
      this.state$.next({
        ...this.state$.value,
        loading: false,
        error: 'Nome é obrigatório',
        initialized: true,
      })
      return
    }

    if (!firebaseEnabled || !auth) {
      this.state$.next({
        ...this.state$.value,
        loading: false,
        error: 'Firebase desabilitado neste ambiente',
        initialized: true,
      })
      return
    }

    this.state$.next({ ...this.state$.value, loading: true, error: null })

    try {

      const cred = await createUserWithEmailAndPassword(auth, email, password)
      const user = this.mapFirebaseUser(cred.user)

      if (db) {
        await userRepository.createUser(user.uid, {
          name: name.trim(),
          email: email.trim(),
          balance: 0,
        })
      }

      secureStorage.set('auth_user', user)

      this.state$.next({
        user,
        loading: false,
        error: null,
        initialized: true,
      })
    } catch (err: unknown) {
      let errorMessage = 'Erro ao criar conta'
      const error = err as { code?: string; message?: string }
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Senha muito fraca'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido'
      } else if (error.message) {
        errorMessage = error.message
      }

      this.state$.next({
        ...this.state$.value,
        loading: false,
        error: errorMessage,
        initialized: true,
      })
    }
  }

  async logout() {
    secureStorage.remove('auth_user')

    if (!firebaseEnabled || !auth) {
      this.state$.next({
        ...initialState,
        initialized: true,
      })
      return
    }

    try {
      await signOut(auth)
      this.state$.next({
        ...initialState,
        initialized: true,
      })
    } catch (err: unknown) {
      const error = err as { message?: string }
      this.state$.next({
        ...initialState,
        initialized: true,
        error: error.message || 'Erro ao fazer logout',
      })
    }
  }
}

export const authViewModel = new AuthViewModel()
