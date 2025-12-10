// src/viewmodels/auth/AuthViewModel.ts
import { BehaviorSubject } from 'rxjs'
import { auth, firebaseEnabled } from '../../infra/firebase/firebaseClient'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'

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
    // Se o Firebase estiver desligado, só marcamos como inicializado
    if (!firebaseEnabled || !auth) {
      this.state$.next({
        ...this.state$.value,
        initialized: true,
      })
      return
    }

    onAuthStateChanged(auth, (fbUser) => {
      const current = this.state$.value

      // Se estamos em modo bypass, não sobrescreve o estado
      if (current.bypass) {
        return
      }

      const user = fbUser ? this.mapFirebaseUser(fbUser) : null
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
    // 🔓 BYPASS DE TESTE
    if (email === 'teste@teste.com' && password === '123456') {
      this.state$.next({
        user: { uid: 'bypass-user', email },
        loading: false,
        error: null,
        initialized: true,
        bypass: true,
      })
      return
    }

    // Se Firebase estiver desligado, não tenta autenticar de verdade
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

    // Se estamos em bypass ou Firebase desligado, só limpa o estado
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
