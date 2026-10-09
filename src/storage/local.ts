// Persistência local versionada. Falha silenciosa: modo privado/armazenamento bloqueado não quebra o jogo.
const PREFIX = 'anime-tcg:v1:'

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function save(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // sem armazenamento: o valor vale só nesta sessão
  }
}
