import type { MatchKrav, MatchSvar } from '../../modell/typer'

export function erRiktigMatchSvar(krav: MatchKrav, personId: string, svar: MatchSvar): boolean {
  if (svar === 'vet_ikke') return false
  return krav.fasit[personId] === svar
}

export function forklaringForKrav(krav: MatchKrav, personId: string, svar: MatchSvar): string {
  if (svar === 'vet_ikke') {
    return 'Velg passer eller passer ikke. Se på personens erfaring, egenskaper og reise.'
  }
  const fasit = krav.fasit[personId]
  return fasit === 'passer' ? krav.forklaringPasser : krav.forklaringPasserIkke
}

export const KATEGORI_NAVN: Record<MatchKrav['kategori'], string> = {
  kompetanse: 'Kompetanse',
  egenskaper: 'Egenskaper',
  logistikk: 'Logistikk',
}

export const MATCH_SVAR: Array<{ id: MatchSvar; tekst: string }> = [
  { id: 'passer', tekst: 'Passer' },
  { id: 'passer_ikke', tekst: 'Passer ikke' },
  { id: 'vet_ikke', tekst: 'Vet ikke' },
]
