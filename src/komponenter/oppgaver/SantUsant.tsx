import { useState } from 'react'
import type { SantUsantOppgave } from '../../modell/typer'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: SantUsantOppgave
  ferdig: boolean
  onSvar: (riktig: boolean) => void
}

export function SantUsant({ oppgave, ferdig, onSvar }: Props) {
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)

  const svar = (sant: boolean) => {
    const riktig = sant === oppgave.riktigErSant
    setStatus(riktig ? 'ok' : 'feil')
    onSvar(riktig)
  }

  return (
    <div>
      <p>
        <strong>{oppgave.paastand}</strong>
      </p>
      <div className="valggruppe">
        <button type="button" className="knapp" disabled={status === 'ok'} onClick={() => svar(true)}>
          Sant
        </button>
        <button
          type="button"
          className="knapp knapp-sekundaer"
          disabled={status === 'ok'}
          onClick={() => svar(false)}
        >
          Usant
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
