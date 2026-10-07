import type { Person } from '../modell/typer'

const TOKEN = /\{\{([^}|]+)(?:\|([^}]+))?\}\}/g

export interface OrdToken {
  id: string
  visning: string
}

export function trekkUtOrdId(tekst: string): string[] {
  const ider = new Set<string>()
  const kopi = tekst.matchAll(TOKEN)
  for (const treff of kopi) {
    const id = treff[1]
    if (id) ider.add(id)
  }
  return [...ider]
}

export function fyllNavn(tekst: string, person: Person | null): string {
  if (!person) return tekst.replaceAll('[navn]', '')
  return tekst.replaceAll('[navn]', person.fornavn)
}

export function delTekstIAvsnitt(tekst: string): string[] {
  return tekst.split(/\n+/).filter((linje) => linje.trim().length > 0)
}

export function parseOrdTokens(avsnitt: string): Array<{ type: 'tekst'; verdi: string } | { type: 'ord'; id: string; visning: string }> {
  const deler: Array<{ type: 'tekst'; verdi: string } | { type: 'ord'; id: string; visning: string }> = []
  let siste = 0
  const monster = new RegExp(TOKEN.source, 'g')
  let treff = monster.exec(avsnitt)
  while (treff) {
    if (treff.index > siste) {
      deler.push({ type: 'tekst', verdi: avsnitt.slice(siste, treff.index) })
    }
    const id = treff[1] ?? ''
    const visning = treff[2] ?? id
    deler.push({ type: 'ord', id, visning })
    siste = treff.index + treff[0].length
    treff = monster.exec(avsnitt)
  }
  if (siste < avsnitt.length) {
    deler.push({ type: 'tekst', verdi: avsnitt.slice(siste) })
  }
  return deler
}
