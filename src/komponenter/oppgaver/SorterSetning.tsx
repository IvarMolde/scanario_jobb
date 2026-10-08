import { useMemo, useState } from 'react'
import type { SorterSetningOppgave } from '../../modell/typer'
import { stokk } from '../../utils/miks'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: SorterSetningOppgave
  ferdig: boolean
  onSvar: (riktig: boolean) => void
}

export function SorterSetning({ oppgave, ferdig, onSvar }: Props) {
  const start = useMemo(() => stokk(oppgave.biter), [oppgave.biter])
  const [valgteIndeks, setValgteIndeks] = useState<number[]>([])
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)

  const valgtTekst = ferdig && status === 'ok' ? oppgave.biter : valgteIndeks.map((i) => start[i] ?? '')
  const ubrukte = start
    .map((bit, i) => ({ bit, i }))
    .filter(({ i }) => !valgteIndeks.includes(i))

  const sjekk = (neste: number[]) => {
    const tekst = neste.map((i) => start[i] ?? '')
    if (tekst.length !== oppgave.biter.length) {
      setStatus(null)
      return
    }
    const riktig = tekst.join(' ') === oppgave.biter.join(' ')
    setStatus(riktig ? 'ok' : 'feil')
    onSvar(riktig)
  }

  return (
    <div>
      <div className="brikker" aria-live="polite">
        {valgtTekst.length === 0 ? (
          <p>Ordene du trykker på, kommer her.</p>
        ) : (
          valgtTekst.map((bit, i) => (
            <span key={`${bit}-${i}`} className="brikke brikke-valgt">
              {bit}
            </span>
          ))
        )}
      </div>
      <div className="brikker">
        {ubrukte.map(({ bit, i }) => (
          <button
            key={`${bit}-${i}`}
            type="button"
            className="brikke"
            disabled={status === 'ok'}
            onClick={() => {
              const neste = [...valgteIndeks, i]
              setValgteIndeks(neste)
              sjekk(neste)
            }}
          >
            {bit}
          </button>
        ))}
      </div>
      {status !== 'ok' ? (
        <button
          type="button"
          className="knapp knapp-sekundaer"
          onClick={() => {
            setValgteIndeks([])
            setStatus(null)
          }}
        >
          Tøm setningen
        </button>
      ) : null}
      <TilbakemeldingBoks
        status={status}
        riktig={oppgave.tilbakemeldingRiktig}
        feil={oppgave.tilbakemeldingFeil}
      />
    </div>
  )
}
