import type { ArbeidInnhold, Arbeidsforhold, Person } from '../modell/typer'
import {
  SATSER_2026,
  beregnSkatt,
  forventetAarsinntekt,
  formatKr,
  frikortTrekkDenneMaaned,
  gammeltTabelltrekk,
  kveldKroner,
  maanedslonnFraTimer,
  maanedstrekk,
  overtidKroner,
} from './skatt'
import type { LagretSkattekort } from './skatt'

export interface LonnsslippLinje {
  id: string
  tekst: string
  belop: number | null
}

export interface Lonnsslipp {
  arbeidsgiver: Arbeidsforhold['arbeidsgiver']
  navn: string
  ansattnummer: string
  stilling: string
  stillingsprosent: number
  periode: string
  utbetalingsdato: string
  kontonummerSkjult: string
  timerOrdinare: number
  timelonn: number
  fastlonn: number
  overtid: number
  kveld: number
  visOvertid: boolean
  brutto: number
  skattetrekk: number
  trekkBeskrivelse: string
  fagforening: number
  netto: number
  feriepengegrunnlagMaaned: number
  feriepengerMaaned: number
  hittilBrutto: number
  hittilSkatt: number
  hittilFeriegrunnlag: number
  kontakt: string
  forenkling: string
}

export function bruttoUtenOvertid(forhold: Arbeidsforhold): number {
  return maanedslonnFraTimer(forhold) + kveldKroner(forhold)
}

export function bruttoMedTillegg(forhold: Arbeidsforhold): number {
  return bruttoUtenOvertid(forhold) + overtidKroner(forhold)
}

export function skattetrekkDenneMaaned(
  forhold: Arbeidsforhold,
  brutto: number,
  skattekort: LagretSkattekort | null,
  maanederIgjen: number,
): { belop: number; beskrivelse: string } {
  if (skattekort?.endret) {
    const trekk = maanedstrekk(skattekort.aarsskatt, forhold.skattHittil, maanederIgjen)
    return {
      belop: trekk,
      beskrivelse: skattekort.trekkprosent
        ? `Omtrentlig trekk ${skattekort.trekkprosent} % (øving)`
        : 'Omtrentlig månedstrekk (øving)',
    }
  }
  if (forhold.skattekortType === 'frikort') {
    const belop = frikortTrekkDenneMaaned(brutto, forhold.inntektHittil)
    return {
      belop,
      beskrivelse: 'Frikort. 50 % trekk av det som går over 100 000 kr.',
    }
  }
  const belop = gammeltTabelltrekk(brutto, forhold)
  return {
    belop,
    beskrivelse: `Tabelltrekk ${forhold.tabellnummer ?? ''} med for lav forventet inntekt.`,
  }
}

export function byggLonnsslipp(
  person: Person,
  arbeid: ArbeidInnhold,
  skattekort: LagretSkattekort | null,
  visOvertid = false,
): Lonnsslipp | null {
  const forhold = arbeid.personer[person.id]
  if (!forhold) return null
  const fastlonn = maanedslonnFraTimer(forhold)
  const overtid = overtidKroner(forhold)
  const kveld = kveldKroner(forhold)
  const brutto = visOvertid ? fastlonn + overtid + kveld : fastlonn + kveld
  const trekk = skattetrekkDenneMaaned(forhold, brutto, skattekort, arbeid.maanederIgjen)
  const fag = skattekort?.fagforening ? SATSER_2026.fagforeningMaaned : 0
  const netto = brutto - trekk.belop - fag
  const feriegrunnlag = brutto
  const ferie = Math.round(feriegrunnlag * SATSER_2026.feriepengeSats)
  return {
    arbeidsgiver: forhold.arbeidsgiver,
    navn: `${person.fornavn} ${person.etternavn}`,
    ansattnummer: forhold.ansattnummer,
    stilling: forhold.stilling,
    stillingsprosent: forhold.stillingsprosent,
    periode: `1.–30. ${arbeid.maaned} ${SATSER_2026.aar}`,
    utbetalingsdato: arbeid.utbetalingsdato,
    kontonummerSkjult: forhold.kontonummerSkjult,
    timerOrdinare: forhold.timerOrdinare,
    timelonn: forhold.timelonn,
    fastlonn,
    overtid,
    kveld,
    visOvertid,
    brutto,
    skattetrekk: trekk.belop,
    trekkBeskrivelse: trekk.beskrivelse,
    fagforening: fag,
    netto,
    feriepengegrunnlagMaaned: feriegrunnlag,
    feriepengerMaaned: ferie,
    hittilBrutto: forhold.inntektHittil + brutto,
    hittilSkatt: forhold.skattHittil + trekk.belop,
    hittilFeriegrunnlag: forhold.inntektHittil + brutto,
    kontakt: arbeid.kontaktLonn,
    forenkling:
      'Dette er en øvingsversjon. Ingen formue, rentefradrag, arbeidsfradrag for unge eller innsatssone. Månedstrekket er omtrentlig. Ekte tabelltrekk varierer.',
  }
}

export function skjemaVerdier(arbeid: ArbeidInnhold, personId: string): Record<string, number> {
  const forhold = arbeid.personer[personId]
  if (!forhold) return {}
  return {
    maanedslonn: maanedslonnFraTimer(forhold),
    inntektHittil: forhold.inntektHittil,
    maanederIgjen: arbeid.maanederIgjen,
  }
}

export function nyttSkattekortFraValg(
  forhold: Arbeidsforhold,
  maanederIgjen: number,
  fagforening: boolean,
): LagretSkattekort {
  const forventet = forventetAarsinntekt(forhold, maanederIgjen)
  const fag = fagforening ? SATSER_2026.fagforeningAar : 0
  const beregnet = beregnSkatt(forventet, fag)
  return {
    loggetInn: true,
    endret: true,
    fagforening,
    forventetInntekt: forventet,
    trekkprosent: beregnet.trekkprosent,
    maanedstrekk: maanedstrekk(beregnet.aarsskatt, forhold.skattHittil, maanederIgjen),
    aarsskatt: beregnet.aarsskatt,
  }
}

export { formatKr }
