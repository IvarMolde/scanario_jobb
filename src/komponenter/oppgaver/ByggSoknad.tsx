import { useState } from 'react'
import type { ByggSoknadOppgave, Person } from '../../modell/typer'
import { fyllNavn } from '../../utils/tekst'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: ByggSoknadOppgave
  person: Person
  ferdig: boolean
  annonseId: string | null
  onSvar: (riktig: boolean) => void
  onLagre: (tekst: string, annonseId: string | null, flagg: string[]) => void
}

export function ByggSoknad({ oppgave, person, ferdig, annonseId, onSvar, onLagre }: Props) {
  const [innledning, setInnledning] = useState<string | null>(null)
  const [hvorfor, setHvorfor] = useState<string | null>(null)
  const [avslutning, setAvslutning] = useState<string | null>(null)
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)

  const inn = oppgave.innledning.find((d) => d.id === innledning)
  const hvor = oppgave.hvorfor.find((d) => d.id === hvorfor)
  const avs = oppgave.avslutning.find((d) => d.id === avslutning)
  const komplett = Boolean(inn && hvor && avs)
  const tekst = fyllNavn([inn?.tekst, hvor?.tekst, avs?.tekst].filter(Boolean).join('\n\n'), person)

  const passer = (personer: string[]) => personer.includes(person.id)

  const sjekk = () => {
    if (!komplett || status === 'ok' || !inn || !hvor || !avs) return
    const riktig = passer(inn.personer) && passer(hvor.personer) && passer(avs.personer)
    setStatus(riktig ? 'ok' : 'feil')
    onSvar(riktig)
    if (riktig) onLagre(tekst, annonseId, oppgave.flagg)
  }

  return (
    <div>
      <fieldset className="cv-seksjon">
        <legend>Innledning</legend>
        <div className="valggruppe">
          {oppgave.innledning.map((del) => (
            <button
              key={del.id}
              type="button"
              className="knapp knapp-sekundaer"
              aria-pressed={innledning === del.id}
              disabled={status === 'ok'}
              onClick={() => {
                setInnledning(del.id)
                setStatus(null)
              }}
            >
              {del.tekst}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="cv-seksjon">
        <legend>Hvorfor meg</legend>
        <div className="valggruppe">
          {oppgave.hvorfor.map((del) => (
            <button
              key={del.id}
              type="button"
              className="knapp knapp-sekundaer"
              aria-pressed={hvorfor === del.id}
              disabled={status === 'ok'}
              onClick={() => {
                setHvorfor(del.id)
                setStatus(null)
              }}
            >
              {del.tekst}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="cv-seksjon">
        <legend>Avslutning</legend>
        <div className="valggruppe">
          {oppgave.avslutning.map((del) => (
            <button
              key={del.id}
              type="button"
              className="knapp knapp-sekundaer"
              aria-pressed={avslutning === del.id}
              disabled={status === 'ok'}
              onClick={() => {
                setAvslutning(del.id)
                setStatus(null)
              }}
            >
              {fyllNavn(del.tekst, person)}
            </button>
          ))}
        </div>
      </fieldset>
      {komplett ? (
        <p className="kort">
          <strong>Søknaden:</strong>
          <br />
          {tekst.split('\n').map((linje, i) => (
            <span key={i}>
              {linje}
              <br />
            </span>
          ))}
        </p>
      ) : null}
      <button type="button" className="knapp" disabled={!komplett || status === 'ok'} onClick={sjekk}>
        Lag søknaden
      </button>
      <TilbakemeldingBoks
        status={status}
        riktig={oppgave.tilbakemeldingRiktig}
        feil={oppgave.tilbakemeldingFeil}
      />
    </div>
  )
}
