import { useState } from 'react'
import type { Person, PortalSokOppgave } from '../../modell/typer'
import type { LagretSok } from '../../spill/tilstand'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: PortalSokOppgave
  person: Person
  ferdig: boolean
  onSvar: (riktig: boolean) => void
  onLagreSok: (sok: LagretSok, flagg: string[]) => void
}

export function PortalSok({ oppgave, person, ferdig, onSvar, onLagreSok }: Props) {
  const [sokkeordId, setSokkeordId] = useState<string | null>(null)
  const [stedId, setStedId] = useState<string | null>(null)
  const [stillingId, setStillingId] = useState<string | null>(null)
  const [varsel, setVarsel] = useState(false)
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)

  const lagre = () => {
    if (status === 'ok' || !sokkeordId || !stedId || !stillingId) return
    const fasit = oppgave.riktigPerPerson[person.id]
    const riktig =
      Boolean(fasit) &&
      fasit.sokkeordId === sokkeordId &&
      fasit.stedId === stedId &&
      fasit.stillingId === stillingId &&
      varsel
    setStatus(riktig ? 'ok' : 'feil')
    onSvar(riktig)
    if (riktig) {
      onLagreSok(
        { sokkeordId, stedId, stillingId, varsel: true },
        oppgave.flagg,
      )
    }
  }

  return (
    <div>
      <fieldset className="cv-seksjon">
        <legend>Søkeord</legend>
        <div className="brikker">
          {oppgave.sokkeord.map((alt) => (
            <button
              key={alt.id}
              type="button"
              className="brikke"
              aria-pressed={sokkeordId === alt.id}
              disabled={status === 'ok'}
              onClick={() => setSokkeordId(alt.id)}
            >
              {alt.tekst}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="cv-seksjon">
        <legend>Sted</legend>
        <div className="brikker">
          {oppgave.steder.map((alt) => (
            <button
              key={alt.id}
              type="button"
              className="brikke"
              aria-pressed={stedId === alt.id}
              disabled={status === 'ok'}
              onClick={() => setStedId(alt.id)}
            >
              {alt.tekst}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="cv-seksjon">
        <legend>Heltid eller deltid</legend>
        <div className="brikker">
          {oppgave.stillinger.map((alt) => (
            <button
              key={alt.id}
              type="button"
              className="brikke"
              aria-pressed={stillingId === alt.id}
              disabled={status === 'ok'}
              onClick={() => setStillingId(alt.id)}
            >
              {alt.tekst}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="avkryss">
        <input
          type="checkbox"
          checked={varsel}
          disabled={status === 'ok'}
          onChange={(e) => setVarsel(e.target.checked)}
        />
        Slå på varsel når nye jobber kommer
      </label>
      <button
        type="button"
        className="knapp"
        disabled={status === 'ok' || !sokkeordId || !stedId || !stillingId}
        onClick={lagre}
      >
        Lagre søket
      </button>
      <TilbakemeldingBoks
        status={status}
        riktig={oppgave.tilbakemeldingRiktig}
        feil={oppgave.tilbakemeldingFeil}
      />
    </div>
  )
}
