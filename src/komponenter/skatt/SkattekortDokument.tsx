import type { ReactNode } from 'react'
import type { Arbeidsforhold, Person } from '../../modell/typer'
import type { LagretSkattekort } from '../../spill/skatt'
import { SATSER_2026, beregnSkatt, formatKr, forventetAarsinntekt } from '../../spill/skatt'
import { DokFelt } from './DokFelt'

interface Props {
  person: Person
  forhold: Arbeidsforhold
  skattekort: LagretSkattekort | null
  maanederIgjen: number
  klikkbar?: boolean
  valgtFelt?: string | null
  onFelt?: (id: string) => void
}

export function SkattekortDokument({
  person,
  forhold,
  skattekort,
  maanederIgjen,
  klikkbar,
  valgtFelt,
  onFelt,
}: Props) {
  const felt = (id: string, children: ReactNode) => (
    <DokFelt id={id} klikkbar={klikkbar} valgtFelt={valgtFelt} onFelt={onFelt}>
      {children}
    </DokFelt>
  )
  const endret = Boolean(skattekort?.endret)
  const forventet = endret ? skattekort!.forventetInntekt : forhold.forventetInntektKort
  const beregnet = endret
    ? beregnSkatt(skattekort!.forventetInntekt, skattekort!.fagforening ? SATSER_2026.fagforeningAar : 0)
    : beregnSkatt(forventet)
  const nyForventet = forventetAarsinntekt(forhold, maanederIgjen)

  return (
    <article className="skattekort-dokument" aria-label="Skattekort">
      <h2>
        Skattekort · {person.fornavn} {person.etternavn}
      </h2>
      {felt(
        'trekktype',
        <p>
          {endret || forhold.skattekortType === 'tabell'
            ? 'Trekktype: tabelltrekk for lønn. Prosenttrekk for annen inntekt.'
            : 'Trekktype: frikort. Ingen trekk før 100 000 kr.'}
        </p>,
      )}
      {felt(
        'forventet',
        <p>
          Forventet inntekt i år på kortet: {formatKr(forventet)}.
          {!endret ? ` Med ny jobb blir det omtrent ${formatKr(nyForventet)}.` : null}
        </p>,
      )}
      {felt(
        'fradrag',
        <p>
          Fradrag: minstefradrag {formatKr(beregnet.minstefradrag)}
          {skattekort?.fagforening ? ` og fagforeningskontingent ${formatKr(SATSER_2026.fagforeningAar)}` : ''}
          . Personfradrag {formatKr(SATSER_2026.personfradrag)}.
        </p>,
      )}
      {felt(
        'beregning',
        <div>
          <p>Skatt på alminnelig inntekt: {formatKr(beregnet.skattAlminnelig)}.</p>
          <p>Trinnskatt: {formatKr(beregnet.trinnskatt)}.</p>
          <p>Trygdeavgift: {formatKr(beregnet.trygdeavgift)}.</p>
          <p>
            Sum skatt i år: {formatKr(beregnet.aarsskatt)} ({beregnet.trekkprosent} %).
          </p>
        </div>,
      )}
      {felt(
        'trekkprosent',
        <p>
          {endret
            ? `Ny trekkprosent omtrent ${skattekort!.trekkprosent} %. Månedstrekk omtrent ${formatKr(skattekort!.maanedstrekk)}. Dette er omtrentlig. Ekte tabelltrekk varierer.`
            : forhold.skattekortType === 'frikort'
              ? 'Frikort. Arbeidsgiveren trekker 50 % av det som går over 100 000 kr.'
              : 'Kortet har for lav forventet inntekt. Da trekkes det for lite skatt.'}
        </p>,
      )}
      {endret
        ? felt(
            'kvittering',
            <p className="dok-netto">Nytt skattekort er laget. Arbeidsgiveren henter det automatisk.</p>,
          )
        : null}
    </article>
  )
}
