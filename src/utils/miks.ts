export function stokk<T>(liste: readonly T[]): T[] {
  const kopi = [...liste]
  for (let i = kopi.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = kopi[i]
    const b = kopi[j]
    if (a !== undefined && b !== undefined) {
      kopi[i] = b
      kopi[j] = a
    }
  }
  return kopi
}
