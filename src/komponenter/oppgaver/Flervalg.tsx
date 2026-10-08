import { useState } from 'react'
import type { FlervalgOppgave, LyttOgVelgOppgave } from '../../modell/typer'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: FlervalgOppgave | LyttOgVelgOppgave
  ferdig: boolean
  onSvar: (riktig: boolean) => void
}

export function Flervalg({ oppgave, ferdig, onSvar }: Props) {
  const [valgt, setValgt] = useState<string | null>(ferdig ? oppgave.riktigId : null)
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)

  return (
    <div>
      <p>
        <strong>{oppgave.spoersmal}</strong>
      </p>
      <div className="valggruppe" role="group" aria-label={oppgave.spoersmal}>
        {oppgave.alternativer.map((alt) => (
          <button
            key={alt.id}
            type="button"
            className="knapp knapp-sekundaer"
            aria-pressed={valgt === alt.id}
            disabled={status === 'ok'}
            onClick={() => {
              setValgt(alt.id)
              const riktig = alt.id === oppgave.riktigId
              setStatus(riktig ? 'ok' : 'feil')
              onSvar(riktig)
            }}
          >
            {alt.tekst}
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
