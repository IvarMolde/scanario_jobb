import type { ReactNode } from 'react'
import type { Lonnsslipp } from '../../spill/lonn'
import { formatKr } from '../../spill/skatt'
import { DokFelt } from './DokFelt'

interface Props {
  slipp: Lonnsslipp
  klikkbar?: boolean
  valgtFelt?: string | null
  onFelt?: (id: string) => void
}

export function LonnsslippDokument({ slipp, klikkbar, valgtFelt, onFelt }: Props) {
  const felt = (id: string, children: ReactNode) => (
    <DokFelt id={id} klikkbar={klikkbar} valgtFelt={valgtFelt} onFelt={onFelt}>
      {children}
    </DokFelt>
  )

  return (
    <article className="lonnsslipp-dokument" aria-label="Lønnsslipp, øvingsversjon">
      <p className="ovingsmerke">Øvingsversjon · ikke et ekte lønnsdokument</p>
      {felt(
        'arbeidsgiver',
        <>
          <strong>{slipp.arbeidsgiver.navn}</strong>
          <p>{slipp.arbeidsgiver.adresse}</p>
          <p>Org.nr. {slipp.arbeidsgiver.orgnr}</p>
        </>,
      )}
      {felt(
        'ansatt',
        <>
          <p>
            <strong>{slipp.navn}</strong>
          </p>
          <p>
            Ansattnummer {slipp.ansattnummer}. {slipp.stilling}. {slipp.stillingsprosent} %.
          </p>
        </>,
      )}
      {felt(
        'periode',
        <p>
          Periode: {slipp.periode}. Utbetalt {slipp.utbetalingsdato}. Konto {slipp.kontonummerSkjult}.
        </p>,
      )}
      {felt(
        'timer',
        <p>
          {slipp.timerOrdinare} timer × {formatKr(slipp.timelonn)} = {formatKr(slipp.fastlonn)}
        </p>,
      )}
      {felt(
        'overtid',
        slipp.visOvertid ? (
          <p>Overtid: {formatKr(slipp.overtid)}</p>
        ) : (
          <p>Overtid: ikke ført på slippen.</p>
        ),
      )}
      {felt('brutto', <p>Brutto lønn: {formatKr(slipp.brutto)}</p>)}
      {felt(
        'skattetrekk',
        <p>
          Skattetrekk: {formatKr(slipp.skattetrekk)}. {slipp.trekkBeskrivelse}
        </p>,
      )}
      {slipp.fagforening > 0
        ? felt('fagforening', <p>Fagforeningskontingent: {formatKr(slipp.fagforening)}</p>)
        : null}
      {felt('netto', <p className="dok-netto">Netto utbetalt: {formatKr(slipp.netto)}</p>)}
      {felt(
        'feriepenger',
        <p>
          Feriepengegrunnlag: {formatKr(slipp.feriepengegrunnlagMaaned)}. Opptjent 10,2 %:{' '}
          {formatKr(slipp.feriepengerMaaned)}.
        </p>,
      )}
      {felt(
        'hittil',
        <p>
          Hittil i år: brutto {formatKr(slipp.hittilBrutto)}, skattetrekk {formatKr(slipp.hittilSkatt)},
          feriepengegrunnlag {formatKr(slipp.hittilFeriegrunnlag)}.
        </p>,
      )}
      <p className="dok-fot">Spørsmål om lønn: {slipp.kontakt}</p>
      <p className="dok-fot">{slipp.forenkling}</p>
    </article>
  )
}
