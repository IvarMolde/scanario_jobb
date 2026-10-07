import { useState } from 'react'
import type { Annonse, Person, VelgJobberOppgave } from '../../modell/typer'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: VelgJobberOppgave
  person: Person
  annonser: Annonse[]
  ferdig: boolean
  valgteJobber: string[]
  onSvar: (riktig: boolean) => void
  onVelgJobber: (ids: string[], flagg: string[]) => void
}

export function VelgJobber({
  oppgave,
  person,
  annonser,
  ferdig,
  valgteJobber,
  onSvar,
  onVelgJobber,
}: Props) {
  const [valgte, setValgte] = useState<string[]>(ferdig ? valgteJobber : [])
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)

  const toggle = (id: string) => {
    if (status === 'ok') return
    setValgte((forrige) => {
      if (forrige.includes(id)) return forrige.filter((x) => x !== id)
      if (forrige.length >= oppgave.max) return forrige
      return [...forrige, id]
    })
  }

  const lagre = () => {
    if (status === 'ok') return
    const riktig = valgte.length >= oppgave.min && valgte.length <= oppgave.max
    setStatus(riktig ? 'ok' : 'feil')
    onSvar(riktig)
    if (riktig) onVelgJobber(valgte, oppgave.flagg ?? [])
  }

  return (
    <div>
      <p>
        Velg {oppgave.min}–{oppgave.max} jobber som kan passe {person.fornavn}.
      </p>
      <div className="valggruppe">
        {annonser.map((a) => (
          <button
            key={a.id}
            type="button"
            className="knapp knapp-sekundaer"
            aria-pressed={valgte.includes(a.id)}
            disabled={status === 'ok'}
            onClick={() => toggle(a.id)}
          >
            {a.tittel} · {a.bedrift}
          </button>
        ))}
      </div>
      <button type="button" className="knapp" disabled={status === 'ok'} onClick={lagre}>
        Gå videre med disse jobbene
      </button>
      <TilbakemeldingBoks
        status={status}
        riktig={oppgave.tilbakemeldingRiktig}
        feil={oppgave.tilbakemeldingFeil}
      />
    </div>
  )
}
