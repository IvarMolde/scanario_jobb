import { useMemo, useState } from 'react'
import type { IntervjuSvarOppgave, Person } from '../../modell/typer'
import { INTERVJU_KVALITET_NAVN } from '../../modell/typer'
import { Lydspiller } from '../Lydspiller'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: IntervjuSvarOppgave
  person: Person
  ferdig: boolean
  onSvar: (riktig: boolean) => void
}

export function IntervjuSvar({ oppgave, person, ferdig, onSvar }: Props) {
  const alternativer = useMemo(
    () => oppgave.alternativer.filter((a) => a.personer.includes(person.id)),
    [oppgave.alternativer, person.id],
  )
  const [valgt, setValgt] = useState<string | null>(
    ferdig ? (alternativer.find((a) => a.kvalitet === 'godt')?.id ?? null) : null,
  )
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)
  const valgtAlt = alternativer.find((a) => a.id === valgt)

  return (
    <div>
      <p>
        <strong>{oppgave.spoersmal}</strong>
      </p>
      <Lydspiller fil={oppgave.spoersmalLyd} etikett="Spørsmål fra intervjueren" />
      <div className="valggruppe" role="group" aria-label={oppgave.spoersmal}>
        {alternativer.map((alt) => (
          <button
            key={alt.id}
            type="button"
            className="knapp knapp-sekundaer"
            aria-pressed={valgt === alt.id}
            disabled={status === 'ok'}
            onClick={() => {
              setValgt(alt.id)
              const riktig = alt.kvalitet === 'godt'
              setStatus(riktig ? 'ok' : 'feil')
              onSvar(riktig)
            }}
          >
            {alt.tekst}
          </button>
        ))}
      </div>
      {valgtAlt && status ? (
        <p className={`kvalitet kvalitet-${valgtAlt.kvalitet}`} role="status">
          Dette er et {INTERVJU_KVALITET_NAVN[valgtAlt.kvalitet].toLocaleLowerCase('nb-NO')}.
        </p>
      ) : null}
      {status === 'ok' ? (
        <ul className="kvalitet-liste">
          {alternativer.map((a) => (
            <li key={a.id}>
              <strong>{INTERVJU_KVALITET_NAVN[a.kvalitet]}:</strong> {a.tekst}
            </li>
          ))}
        </ul>
      ) : null}
      {status === 'feil' ? (
        <button
          type="button"
          className="knapp knapp-sekundaer"
          onClick={() => {
            setValgt(null)
            setStatus(null)
          }}
        >
          Prøv et annet svar
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
