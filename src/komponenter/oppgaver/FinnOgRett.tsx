import { useState } from 'react'
import type { FinnOgRettOppgave } from '../../modell/typer'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: FinnOgRettOppgave
  ferdig: boolean
  onSvar: (riktig: boolean) => void
}

export function FinnOgRett({ oppgave, ferdig, onSvar }: Props) {
  const harAlternativer = (oppgave.alternativer?.length ?? 0) > 0
  const [funnet, setFunnet] = useState(ferdig)
  const [valgtAlt, setValgtAlt] = useState<string | null>(
    ferdig && harAlternativer ? (oppgave.riktigId ?? null) : null,
  )
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)
  const ord = oppgave.tekst.split(/(\s+)/)

  return (
    <div>
      <p>
        {ord.map((bit, i) => {
          const rent = bit.replace(/[.,!?]/g, '')
          if (!rent.trim()) return <span key={`s-${i}`}>{bit}</span>
          return (
            <button
              key={`o-${i}-${bit}`}
              type="button"
              className="ordlenke"
              aria-pressed={funnet && rent === oppgave.feilOrd}
              disabled={status === 'ok'}
              onClick={() => {
                if (rent === oppgave.feilOrd) {
                  setFunnet(true)
                  if (!harAlternativer) {
                    setStatus('ok')
                    onSvar(true)
                  } else {
                    setStatus(null)
                  }
                } else if (status !== 'ok') {
                  setStatus('feil')
                  onSvar(false)
                }
              }}
            >
              {bit}
            </button>
          )
        })}
      </p>
      {funnet && harAlternativer ? (
        <div className="valggruppe">
          {(oppgave.alternativer ?? []).map((alt) => (
            <button
              key={alt.id}
              type="button"
              className="knapp knapp-sekundaer"
              aria-pressed={valgtAlt === alt.id}
              disabled={status === 'ok'}
              onClick={() => {
                setValgtAlt(alt.id)
                const riktig = alt.id === oppgave.riktigId
                setStatus(riktig ? 'ok' : 'feil')
                onSvar(riktig)
              }}
            >
              {alt.tekst}
            </button>
          ))}
        </div>
      ) : null}
      <TilbakemeldingBoks
        status={status}
        riktig={oppgave.tilbakemeldingRiktig}
        feil={oppgave.tilbakemeldingFeil}
      />
    </div>
  )
}
