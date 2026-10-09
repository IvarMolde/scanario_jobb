import { useId, useState } from 'react'
import type { SkrivSvarOppgave } from '../../modell/typer'
import { erRiktigSkrivSvar } from '../../spill/skrivSvar'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: SkrivSvarOppgave
  ferdig: boolean
  onSvar: (riktig: boolean) => void
}

export function SkrivSvar({ oppgave, ferdig, onSvar }: Props) {
  const feltId = useId()
  const [svar, setSvar] = useState(ferdig ? (oppgave.riktigeSvar[0] ?? '') : '')
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)

  const sjekk = () => {
    const riktig = erRiktigSkrivSvar(svar, oppgave.riktigeSvar, oppgave.normalisering)
    setStatus(riktig ? 'ok' : 'feil')
    onSvar(riktig)
  }

  return (
    <div className="skriv-svar">
      <p className="skriv-svar-spoersmal">
        <strong>{oppgave.spoersmal}</strong>
      </p>

      <label className="skriv-svar-felt" htmlFor={feltId}>
        <span className="skriv-svar-etikett">Skriv svaret her</span>
        <input
          id={feltId}
          type="text"
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          placeholder={oppgave.hint}
          value={svar}
          disabled={status === 'ok'}
          aria-invalid={status === 'feil' ? true : undefined}
          onChange={(e) => {
            setSvar(e.target.value)
            if (status === 'feil') setStatus(null)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && status !== 'ok' && svar.trim()) {
              e.preventDefault()
              sjekk()
            }
          }}
        />
        <span className="skriv-svar-hint">Form: {oppgave.hint}</span>
      </label>

      {status !== 'ok' ? (
        <div className="handlinger">
          <button type="button" className="knapp" disabled={!svar.trim()} onClick={sjekk}>
            Sjekk svar
          </button>
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
