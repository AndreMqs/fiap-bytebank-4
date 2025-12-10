// src/viewmodels/auth/AuthViewModel.ts
import { BehaviorSubject } from 'rxjs'
import { auth, firebaseEnabled } from '../../infra/firebase/firebaseClient'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { secureStorage } from '../../infra/crypto/secureStorage'

export type AuthUser = {
  uid: string
  email?: string | null
}

export type AuthState = {
  user: AuthUser | null
  loading: boolean
  error: string | null
  initialized: boolean
  bypass: boolean
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
  bypass: false,
}

export class AuthViewModel {
  private state$ = new BehaviorSubject<AuthState>(initialState)

  constructor() {
    // tenta recuperar usuário salvo em storage seguro
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

      if (current.bypass) {
        return
      }

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
    // BYPASS de teste
    if (email === 'teste@teste.com' && password === '123456') {
      const user: AuthUser = { uid: 'bypass-user', email }

      secureStorage.set('auth_user', user)

      this.state$.next({
        user,
        loading: false,
        error: null,
        initialized: true,
        bypass: true,
      })
      return
    }

    if (!firebaseEnabled || !auth) {
      this.state$.next({
        ...this.state$.value,
        loading: false,
        error: 'Firebase desabilitado neste ambiente. Use o usuário de teste.',
        initialized: true,
        bypass: false,
      })
      return
    }

    this.state$.next({ ...this.state$.value, loading: true, error: null, bypass: false })
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const user = this.mapFirebaseUser(cred.user)

      secureStorage.set('auth_user', user)

      this.state$.next({
        user,
        loading: false,
        error: null,
        initialized: true,
        bypass: false,
      })
    } catch (err: any) {
      this.state$.next({
        ...this.state$.value,
        loading: false,
        error: err?.message ?? 'Erro ao autenticar',
        initialized: true,
        bypass: false,
      })
    }
  }

  async logout() {
    const current = this.state$.value

    secureStorage.remove('auth_user')

    if (current.bypass || !firebaseEnabled || !auth) {
      this.state$.next({
        ...initialState,
        initialized: true,
        bypass: false,
      })
      return
    }

    await signOut(auth)
    this.state$.next({
      ...initialState,
      initialized: true,
      bypass: false,
    })
  }
}

export const authViewModel = new AuthViewModel()
