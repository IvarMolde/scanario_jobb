import { useState } from 'react'
import type { FinnOgRettOppgave } from '../../modell/typer'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: FinnOgRettOppgave
  ferdig: boolean
  onSvar: (riktig: boolean) => void
}

export function FinnOgRett({ oppgave, ferdig, onSvar }: Props) {
  const [funnet, setFunnet] = useState(ferdig)
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)
  const [hint, setHint] = useState<string | null>(null)
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
              disabled={status === 'ok'}
              onClick={() => {
                if (rent === oppgave.feilOrd) {
                  setFunnet(true)
                  setHint(null)
                } else {
                  setHint('Dette ordet er riktig. Finn ordet som er feil.')
                }
              }}
            >
              {bit}
            </button>
          )
        })}
      </p>
      {hint ? <p className="tilbakemelding info">{hint}</p> : null}
      {funnet ? (
        <div className="valggruppe">
          {oppgave.alternativer.map((alt) => (
            <button
              key={alt.id}
              type="button"
              className="knapp knapp-sekundaer"
              disabled={status === 'ok'}
              onClick={() => {
                const riktig = alt.id === oppgave.riktigId
                setStatus(riktig ? 'ok' : 'feil')
                onSvar(riktig)
              }}
            >
              {alt.tekst}
            </button>
          ))}
        </div>
      ) : (
        <p>Trykk på ordet som er feil.</p>
      )}
      <TilbakemeldingBoks
        status={status}
        riktig={oppgave.tilbakemeldingRiktig}
        feil={oppgave.tilbakemeldingFeil}
      />
    </div>
  )
}
