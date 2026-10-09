import type { Oppgave } from '../modell/typer'

const HJELP: Record<Oppgave['type'], string> = {
  flervalg: 'Klikk på riktig svar.',
  lytt_og_velg: 'Lytt først. Klikk deretter på riktig svar.',
  sant_usant: 'Les setningen. Trykk på Sant eller Usant.',
  ordbank: 'Trykk på ordet som passer i setningen.',
  sorter_setning: 'Trykk på ordene i den rekkefølgen de skal stå.',
  matching: 'Trykk på ordet, og velg forklaringen under som passer til ordet.',
  finn_og_rett: 'Klikk på ordet som er feil. Velg deretter riktig form.',
  bygg_melding: 'Velg en start, en tekst og en slutt. De vises på telefonen. Trykk så på Send.',
  sorter_kategori: 'Trykk på et kort. Trykk så på boksen det hører til.',
  egenskap_kobling: 'Velg tre egenskaper. Trykk på ordet, og velg forklaringen som passer.',
  cv_valg: 'Trykk på setningen som passer personen.',
  portal_sok: 'Les kravene for Molde. Trykk Start oppgave. Velg søkeord, sted og heltid eller deltid. Lagre søket og slå på varsel.',
  match_sjekkliste: 'Trykk på Passer eller Passer ikke.',
  registrer_aktiviteter: 'Velg status og dato for hver jobb.',
  bygg_soknad: 'Velg en start, en grunn og en slutt.',
  velg_jobber: 'Trykk på jobbene du vil søke på.',
  intervju_svar: 'Les spørsmålet. Trykk på svaret du vil si.',
  reiseplan: 'Trykk på bussen du vil ta. Trykk så på Sjekk tiden.',
  fyll_tall: 'Trykk på det riktige tallet.',
  finn_i_dokument: 'Trykk på linjen spørsmålet handler om.',
}

const GENERELL =
  /^(Velg det riktige svaret\.|Velg sant eller usant\.|Les påstanden\. Velg sant eller usant\.|Velg ordet som passer\.|Velg ordet som passer i setningen\.|Trykk på ordene i riktig rekkefølge\.|Trykk på trinnene i riktig rekkefølge\.|Trykk først på |Trykk på ordet,|Klikk på riktig svar\.)/

export function oppgaveHjelp(type: Oppgave['type']): string {
  return HJELP[type]
}

export function visEgenInstruksjon(instruksjon: string, type?: Oppgave['type']): boolean {
  const tekst = instruksjon.trim()
  if (GENERELL.test(tekst)) return false
  if (type && tekst === HJELP[type]) return false
  return true
}

/** «Gjør oppgave 1 og 2 ferdig. Etterpå kan du gå videre.» */
export function oppgaveVidereTekst(antall: number): string {
  if (antall <= 0) return ''
  if (antall === 1) return 'Gjør oppgave 1 ferdig. Etterpå kan du gå videre.'
  const tall = Array.from({ length: antall }, (_, i) => String(i + 1))
  const siste = tall.pop()!
  const liste = tall.length === 1 ? tall[0]! : `${tall.join(', ')}`
  return `Gjør oppgave ${liste} og ${siste} ferdig. Etterpå kan du gå videre.`
}
