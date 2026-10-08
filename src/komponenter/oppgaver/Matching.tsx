import { useMemo, useState } from 'react'
import type { MatchingOppgave } from '../../modell/typer'
import { stokk } from '../../utils/miks'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: MatchingOppgave
  ferdig: boolean
  onSvar: (riktig: boolean) => void
}

export function Matching({ oppgave, ferdig, onSvar }: Props) {
  const hoyre = useMemo(() => stokk(oppgave.par.map((p) => p.hoyre)), [oppgave.par])
  const [valgtVenstre, setValgtVenstre] = useState<string | null>(null)
  const [hint, setHint] = useState<string | null>(null)
  const [par, setPar] = useState<Record<string, string>>(
    ferdig ? Object.fromEntries(oppgave.par.map((p) => [p.id, p.hoyre])) : {},
  )
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)

  const koble = (hoyreTekst: string) => {
    if (!valgtVenstre || status === 'ok') return
    const neste = { ...par, [valgtVenstre]: hoyreTekst }
    setPar(neste)
    setValgtVenstre(null)
    if (Object.keys(neste).length !== oppgave.par.length) return
    const riktig = oppgave.par.every((p) => neste[p.id] === p.hoyre)
    setStatus(riktig ? 'ok' : 'feil')
    onSvar(riktig)
    if (!riktig) setPar({})
  }

  return (
    <div>
      <div className="valggruppe">
        {oppgave.par.map((p) => (
          <button
            key={p.id}
            type="button"
            className="knapp knapp-sekundaer"
            aria-pressed={valgtVenstre === p.id || Boolean(par[p.id])}
            disabled={status === 'ok' || Boolean(par[p.id])}
            onClick={() => {
              setValgtVenstre(p.id)
              setHint(null)
            }}
          >
            {p.venstre}
            {par[p.id] ? ` — ${par[p.id]}` : ''}
          </button>
        ))}
      </div>
      <p>Hva betyr ordet?</p>
      <div className="brikker">
        {hoyre.map((tekst) => (
          <button
            key={tekst}
            type="button"
            className="brikke"
            aria-pressed={Object.values(par).includes(tekst)}
            disabled={status === 'ok'}
            onClick={() => {
              if (!valgtVenstre) {
                setHint('Trykk på ordet først.')
                return
              }
              setHint(null)
              koble(tekst)
            }}
          >
            {tekst}
          </button>
        ))}
      </div>
      {hint ? (
        <p className="tilbakemelding info" role="status">
          {hint}
        </p>
      ) : null}
      <TilbakemeldingBoks
        status={status}
        riktig={oppgave.tilbakemeldingRiktig}
        feil={oppgave.tilbakemeldingFeil}
      />
    </div>
  )
}
