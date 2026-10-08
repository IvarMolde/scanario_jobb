import type { MatchKrav, MatchSvar } from '../../modell/typer'

export function erRiktigMatchSvar(krav: MatchKrav, personId: string, svar: MatchSvar): boolean {
  if (svar === 'vet_ikke') return false
  return krav.fasit[personId] === svar
}

export function forklaringForKrav(krav: MatchKrav, personId: string, svar: MatchSvar): string {
  if (svar === 'vet_ikke') {
    return 'Trykk på Passer eller Passer ikke. Se på hva personen kan, og hvordan personen kommer seg til jobben.'
  }
  const fasit = krav.fasit[personId]
  return fasit === 'passer' ? krav.forklaringPasser : krav.forklaringPasserIkke
}

export const KATEGORI_NAVN: Record<MatchKrav['kategori'], string> = {
  kompetanse: 'Det du kan',
  egenskaper: 'Slik du er',
  logistikk: 'Reise til jobben',
}

export const MATCH_SVAR: Array<{ id: MatchSvar; tekst: string }> = [
  { id: 'passer', tekst: 'Passer' },
  { id: 'passer_ikke', tekst: 'Passer ikke' },
  { id: 'vet_ikke', tekst: 'Vet ikke' },
]
