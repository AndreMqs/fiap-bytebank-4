import CryptoJS from 'crypto-js';

const KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'dev-key-postech';

function encrypt(value: string): string {
  return CryptoJS.AES.encrypt(value, KEY).toString();
}

function decrypt(cipher: string): string | null {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || null;
  } catch {
    return null;
  }
}

export const secureStorage = {
  set<T>(key: string, value: T) {
    try {
      const serialized = JSON.stringify(value);
      const cipher = encrypt(serialized);
      localStorage.setItem(key, cipher);
    } catch {
      // se der erro, não deixa quebrar a app
    }
  },

  get<T>(key: string): T | null {
    try {
      const cipher = localStorage.getItem(key);
      if (!cipher) return null;
      const decrypted = decrypt(cipher);
      if (!decrypted) return null;
      return JSON.parse(decrypted) as T;
    } catch {
      return null;
    }
  },

  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};
