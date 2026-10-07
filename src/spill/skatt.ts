import satserRaw from '../innhold/satser-2026.json'
import { satserSkjema } from '../modell/skjema'
import type { Arbeidsforhold, Satser } from '../modell/typer'

export const SATSER_2026: Satser = satserSkjema.parse(satserRaw)

export function minstefradrag(lonn: number, satser: Satser = SATSER_2026): number {
  return Math.min(Math.round(lonn * satser.minstefradragSats), satser.minstefradragMaks)
}

export function skattAlminneligInntekt(
  lonn: number,
  fagforeningAar: number,
  satser: Satser = SATSER_2026,
): number {
  const minst = minstefradrag(lonn, satser)
  const alminnelig = lonn - minst - fagforeningAar
  const grunnlag = Math.max(0, alminnelig - satser.personfradrag)
  return Math.round(grunnlag * satser.skattAlminneligSats)
}

export function trinnskatt(lonn: number, satser: Satser = SATSER_2026): number {
  let sum = 0
  for (let i = 0; i < satser.trinnskatt.length; i += 1) {
    const trinn = satser.trinnskatt[i]
    if (!trinn) continue
    const neste = satser.trinnskatt[i + 1]
    const til = neste?.fra ?? Number.POSITIVE_INFINITY
    const grunnlag = Math.max(0, Math.min(lonn, til) - trinn.fra)
    sum += grunnlag * trinn.sats
  }
  return Math.round(sum)
}

export function trygdeavgift(lonn: number, satser: Satser = SATSER_2026): number {
  if (lonn < satser.trygdeavgiftNedre) return 0
  const vanlig = lonn * satser.trygdeavgiftSats
  const maks = satser.trygdeavgiftMaksAvOver * (lonn - satser.trygdeavgiftNedre)
  return Math.round(Math.min(vanlig, maks))
}

export interface Skatteberegning {
  lonn: number
  minstefradrag: number
  fagforeningAar: number
  alminneligInntekt: number
  skattAlminnelig: number
  trinnskatt: number
  trygdeavgift: number
  aarsskatt: number
  trekkprosent: number
}

export function beregnSkatt(
  lonn: number,
  fagforeningAar = 0,
  satser: Satser = SATSER_2026,
): Skatteberegning {
  const minst = minstefradrag(lonn, satser)
  const alminnelig = lonn - minst - fagforeningAar
  const skattAlm = skattAlminneligInntekt(lonn, fagforeningAar, satser)
  const trinn = trinnskatt(lonn, satser)
  const trygd = trygdeavgift(lonn, satser)
  const aarsskatt = skattAlm + trinn + trygd
  const trekkprosent = lonn > 0 ? Math.round((aarsskatt / lonn) * 1000) / 10 : 0
  return {
    lonn,
    minstefradrag: minst,
    fagforeningAar,
    alminneligInntekt: alminnelig,
    skattAlminnelig: skattAlm,
    trinnskatt: trinn,
    trygdeavgift: trygd,
    aarsskatt,
    trekkprosent,
  }
}

export function maanedslonnFraTimer(forhold: Arbeidsforhold): number {
  return forhold.timerOrdinare * forhold.timelonn
}

export function overtidKroner(forhold: Arbeidsforhold): number {
  return Math.round(forhold.overtidTimer * forhold.timelonn * (1 + forhold.overtidProsent / 100))
}

export function kveldKroner(forhold: Arbeidsforhold): number {
  return Math.round(forhold.kveldTimer * forhold.timelonn * (forhold.kveldProsent / 100))
}

export function forventetAarsinntekt(forhold: Arbeidsforhold, maanederIgjen: number): number {
  return forhold.inntektHittil + maanedslonnFraTimer(forhold) * maanederIgjen
}

export function maanedstrekk(
  aarsskatt: number,
  skattHittil: number,
  maanederIgjen: number,
): number {
  if (maanederIgjen <= 0) return 0
  return Math.round((aarsskatt - skattHittil) / maanederIgjen)
}

export function frikortTrekkDenneMaaned(
  brutto: number,
  inntektHittil: number,
  satser: Satser = SATSER_2026,
): number {
  const rom = Math.max(0, satser.frikortgrense - inntektHittil)
  const over = Math.max(0, brutto - rom)
  return Math.round(over * satser.frikortProsentOver)
}

export function gammeltTabelltrekk(brutto: number, forhold: Arbeidsforhold): number {
  if (forhold.forventetInntektKort <= 0) return 0
  const gammel = beregnSkatt(forhold.forventetInntektKort)
  return Math.round((gammel.aarsskatt / forhold.forventetInntektKort) * brutto)
}

export function formatKr(belop: number): string {
  return `${belop.toLocaleString('nb-NO')} kr`
}

export interface LagretSkattekort {
  loggetInn: boolean
  endret: boolean
  fagforening: boolean
  forventetInntekt: number
  trekkprosent: number
  maanedstrekk: number
  aarsskatt: number
}
