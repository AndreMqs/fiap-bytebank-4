import CryptoJS from 'crypto-js'

const KEY = import.meta.env.VITE_ENCRYPTION_KEY

if (!KEY) {
  const errorMessage = 
    'ERRO CRÍTICO: VITE_ENCRYPTION_KEY não está definida nas variáveis de ambiente.\n' +
    'Por favor, defina esta variável no arquivo .env antes de executar a aplicação.\n' +
    'Exemplo: VITE_ENCRYPTION_KEY=your-secret-key-here'
  
  console.error('%c' + errorMessage, 'color: red; font-weight: bold; font-size: 14px;')
  
  if (import.meta.env.PROD) {
    throw new Error('VITE_ENCRYPTION_KEY é obrigatória em produção')
  }
  
  console.warn(
    '%c⚠️  Executando em modo de desenvolvimento sem chave de criptografia. ' +
    'Isso não é seguro para produção!',
    'color: orange; font-weight: bold;'
  )
}

const ENCRYPTION_KEY = KEY || (import.meta.env.DEV ? 'dev-key-postech-unsafe' : '')

function encrypt(value: string): string {
  if (!ENCRYPTION_KEY) {
    throw new Error('Chave de criptografia não configurada')
  }
  return CryptoJS.AES.encrypt(value, ENCRYPTION_KEY).toString()
}

function decrypt(cipher: string): string | null {
  if (!ENCRYPTION_KEY) {
    throw new Error('Chave de criptografia não configurada')
  }
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, ENCRYPTION_KEY)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return decrypted || null
  } catch {
    return null
  }
}

export const secureStorage = {
  set<T>(key: string, value: T) {
    try {
      const serialized = JSON.stringify(value)
      const cipher = encrypt(serialized)
      localStorage.setItem(key, cipher)
    } catch (error) {
      console.error('Erro ao salvar no secureStorage:', error)
    }
  },

  get<T>(key: string): T | null {
    try {
      const cipher = localStorage.getItem(key)
      if (!cipher) return null
      const decrypted = decrypt(cipher)
      if (!decrypted) return null
      return JSON.parse(decrypted) as T
    } catch (error) {
      console.error('Erro ao ler do secureStorage:', error)
      return null
    }
  },

  remove(key: string) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Erro ao remover do secureStorage:', error)
    }
  },
}
