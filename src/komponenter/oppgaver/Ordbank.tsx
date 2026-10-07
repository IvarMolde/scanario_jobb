import { useState } from 'react'
import type { OrdbankOppgave } from '../../modell/typer'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: OrdbankOppgave
  ferdig: boolean
  onSvar: (riktig: boolean) => void
}

export function Ordbank({ oppgave, ferdig, onSvar }: Props) {
  const [valgt, setValgt] = useState<string | null>(ferdig ? oppgave.riktig : null)
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)
  const visning = oppgave.setning.replace('_____', valgt ?? '_____')

  return (
    <div>
      <p>
        <strong>{visning}</strong>
      </p>
      <div className="brikker">
        {oppgave.ord.map((ord) => (
          <button
            key={ord}
            type="button"
            className="brikke"
            aria-pressed={valgt === ord}
            disabled={status === 'ok'}
            onClick={() => {
              setValgt(ord)
              const riktig = ord === oppgave.riktig
              setStatus(riktig ? 'ok' : 'feil')
              onSvar(riktig)
            }}
          >
            {ord}
          </button>
        ))}
      </div>
      <TilbakemeldingBoks
        status={status}
        riktig={oppgave.tilbakemeldingRiktig}
        feil={oppgave.tilbakemeldingFeil}
      />
    </div>
  )
}
