const NOKKEL = 'jobbreisen-v1'

export function lastLagring(): unknown | null {
  try {
    const raw = localStorage.getItem(NOKKEL)
    if (!raw) return null
    return JSON.parse(raw) as unknown
  } catch {
    return null
  }
}

export function lagre(data: unknown): boolean {
  try {
    localStorage.setItem(NOKKEL, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

export function slettLagring(): void {
  try {
    localStorage.removeItem(NOKKEL)
  } catch {
    // Lagring kan mangle i privat modus. Appen skal likevel virke.
  }
}
