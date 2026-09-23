/**
 * Web Storage que nunca quebra a experiência: em aba privada, cookies
 * bloqueados ou SSR, cai para um Map em memória.
 */
const memory = new Map<string, string>()

const memoryStorage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> = {
  getItem: (k) => memory.get(k) ?? null,
  setItem: (k, v) => void memory.set(k, v),
  removeItem: (k) => void memory.delete(k),
}

export function safeStorage(kind: 'local' | 'session') {
  try {
    const storage = kind === 'local' ? window.localStorage : window.sessionStorage
    const probe = '__zamasu_probe__'
    storage.setItem(probe, probe)
    storage.removeItem(probe)
    return storage
  } catch {
    return memoryStorage
  }
}
