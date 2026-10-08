import { useMemo, useState } from 'react'
import type { FyllTallOppgave } from '../../modell/typer'
import { skjemaVerdier } from '../../spill/lonn'
import { formatKr } from '../../spill/skatt'
import { useSpill } from '../../spill/SpillProvider'
import { stokk } from '../../utils/miks'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: FyllTallOppgave
  personId: string
  ferdig: boolean
  onSvar: (riktig: boolean) => void
}

export function FyllTall({ oppgave, personId, ferdig, onSvar }: Props) {
  const { innhold } = useSpill()
  const fasit = useMemo(
    () => skjemaVerdier(innhold.arbeid, personId),
    [innhold.arbeid, personId],
  )
  const [valg, setValg] = useState<Record<string, number>>(() =>
    ferdig
      ? Object.fromEntries(
          oppgave.felt.flatMap((felt) => {
            const tall = fasit[felt.nokkel]
            return tall === undefined ? [] : [[felt.id, tall]]
          }),
        )
      : {},
  )
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)

  const visTall = (n: number, nokkel: string) =>
    nokkel === 'maanederIgjen' ? String(n) : formatKr(n)

  const feltValg = useMemo(
    () =>
      Object.fromEntries(
        oppgave.felt.map((felt) => {
          const riktig = fasit[felt.nokkel]
          const alle = riktig === undefined ? felt.distraktorer : [riktig, ...felt.distraktorer]
          return [felt.id, stokk([...new Set(alle)])]
        }),
      ) as Record<string, number[]>,
    [fasit, oppgave.felt],
  )

  const sjekk = () => {
    const riktig = oppgave.felt.every((felt) => valg[felt.id] === fasit[felt.nokkel])
    setStatus(riktig ? 'ok' : 'feil')
    onSvar(riktig)
  }

  return (
    <div>
      {oppgave.felt.map((felt) => {
        const alternativer = feltValg[felt.id] ?? []
        return (
          <fieldset className="oppgave" key={felt.id}>
            <legend>{felt.ledetekst}</legend>
            <div className="valggruppe" role="radiogroup" aria-label={felt.ledetekst}>
              {alternativer.map((tall) => (
                <button
                  key={`${felt.id}-${tall}`}
                  type="button"
                  className="knapp knapp-sekundaer"
                  aria-pressed={valg[felt.id] === tall}
                  onClick={() => {
                    setValg({ ...valg, [felt.id]: tall })
                    setStatus(null)
                  }}
                >
                  {visTall(tall, felt.nokkel)}
                </button>
              ))}
            </div>
          </fieldset>
        )
      })}
      <div className="handlinger">
        <button
          type="button"
          className="knapp"
          disabled={oppgave.felt.some((f) => valg[f.id] === undefined)}
          onClick={sjekk}
        >
          Sjekk
        </button>
      </div>
      <TilbakemeldingBoks
        status={status}
        riktig={oppgave.tilbakemeldingRiktig}
        feil={oppgave.tilbakemeldingFeil}
      />
    </div>
  )
}
