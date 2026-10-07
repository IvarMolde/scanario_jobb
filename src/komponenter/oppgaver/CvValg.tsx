import { useState } from 'react'
import type { CvValgOppgave, Person } from '../../modell/typer'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: CvValgOppgave
  person: Person
  ferdig: boolean
  onSvar: (riktig: boolean) => void
}

export function CvValg({ oppgave, person, ferdig, onSvar }: Props) {
  const [valg, setValg] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)

  const velg = (seksjonId: string, altId: string) => {
    if (status === 'ok') return
    const neste = { ...valg, [seksjonId]: altId }
    setValg(neste)
    if (Object.keys(neste).length !== oppgave.seksjoner.length) return
    const riktig = oppgave.seksjoner.every((seksjon) => {
      const alt = seksjon.alternativer.find((a) => a.id === neste[seksjon.id])
      return Boolean(alt?.personer.includes(person.id))
    })
    setStatus(riktig ? 'ok' : 'feil')
    onSvar(riktig)
    if (!riktig) setValg({})
  }

  return (
    <div>
      {oppgave.seksjoner.map((seksjon) => (
        <fieldset className="cv-seksjon" key={seksjon.id}>
          <legend>{seksjon.tittel}</legend>
          <div className="valggruppe">
            {seksjon.alternativer.map((alt) => (
              <button
                key={alt.id}
                type="button"
                className="knapp knapp-sekundaer"
                aria-pressed={valg[seksjon.id] === alt.id}
                disabled={status === 'ok'}
                onClick={() => velg(seksjon.id, alt.id)}
              >
                {alt.tekst}
              </button>
            ))}
          </div>
        </fieldset>
      ))}
      <TilbakemeldingBoks
        status={status}
        riktig={oppgave.tilbakemeldingRiktig}
        feil={oppgave.tilbakemeldingFeil}
      />
    </div>
  )
}
