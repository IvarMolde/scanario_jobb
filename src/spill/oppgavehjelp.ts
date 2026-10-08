import type { Oppgave } from '../modell/typer'

const HJELP: Record<Oppgave['type'], string> = {
  flervalg: 'Trykk på ett svar. Svaret blir lysegrønt.',
  lytt_og_velg: 'Lytt først. Trykk så på ett svar. Svaret blir lysegrønt.',
  sant_usant: 'Les setningen. Trykk på Sant eller Usant. Valget blir lysegrønt.',
  ordbank: 'Trykk på ordet som passer i setningen. Ordet blir lysegrønt.',
  sorter_setning: 'Trykk på ordene i den rekkefølgen de skal stå. Ordene blir lysegrønne.',
  matching: 'Trykk på ordet. Trykk så på det som betyr det samme. Valget blir lysegrønt.',
  finn_og_rett: 'Trykk på ordet som er feil. Velg så det riktige ordet. Valget blir lysegrønt.',
  bygg_melding: 'Velg en start, en tekst og en slutt. De blir lysegrønne og vises på telefonen. Trykk så på Send.',
  sorter_kategori: 'Trykk på et kort. Trykk så på boksen det hører til. Kortet blir lysegrønt.',
  egenskap_kobling: 'Trykk på ordene som passer. De blir lysegrønne.',
  cv_valg: 'Trykk på setningen som passer personen. Den blir lysegrønn.',
  portal_sok: 'Trykk på ett valg i hver gruppe. Valget blir lysegrønt.',
  match_sjekkliste: 'Trykk på Passer eller Passer ikke. Valget blir lysegrønt.',
  registrer_aktiviteter: 'Velg status og dato for hver jobb. Valget blir lysegrønt.',
  bygg_soknad: 'Velg en start, en grunn og en slutt. De blir lysegrønne.',
  velg_jobber: 'Trykk på jobbene du vil søke på. De blir lysegrønne.',
  intervju_svar: 'Les spørsmålet. Trykk på svaret du vil si. Det blir lysegrønt.',
  reiseplan: 'Trykk på bussen du vil ta. Den blir lysegrønn. Trykk så på Sjekk tiden.',
  fyll_tall: 'Trykk på det riktige tallet. Tallet blir lysegrønt.',
  finn_i_dokument: 'Trykk på linjen spørsmålet handler om. Linjen blir lysegrønn.',
}

const GENERELL =
  /^(Velg det riktige svaret\.|Velg sant eller usant\.|Les påstanden\. Velg sant eller usant\.|Velg ordet som passer\.|Velg ordet som passer i setningen\.|Trykk på ordene i riktig rekkefølge\.|Trykk på trinnene i riktig rekkefølge\.|Trykk først på )/

export function oppgaveHjelp(type: Oppgave['type']): string {
  return HJELP[type]
}

export function visEgenInstruksjon(instruksjon: string): boolean {
  return !GENERELL.test(instruksjon.trim())
}
