import { useState } from 'react'
import type { FinnIDokumentOppgave } from '../../modell/typer'
import { byggLonnsslipp } from '../../spill/lonn'
import { useSpill } from '../../spill/SpillProvider'
import { LonnsslippDokument } from '../skatt/LonnsslippDokument'
import { SkattekortDokument } from '../skatt/SkattekortDokument'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: FinnIDokumentOppgave
  ferdig: boolean
  onSvar: (riktig: boolean) => void
}

export function FinnIDokument({ oppgave, ferdig, onSvar }: Props) {
  const { innhold, person, fremdrift } = useSpill()
  const [valgt, setValgt] = useState<string | null>(ferdig ? oppgave.riktigFeltId : null)
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)
  const forhold = person ? innhold.arbeid.personer[person.id] : undefined
  const slipp = person ? byggLonnsslipp(person, innhold.arbeid, fremdrift.skattekort, false) : null

  const klikk = (id: string) => {
    if (status === 'ok') return
    setValgt(id)
    const riktig = id === oppgave.riktigFeltId
    setStatus(riktig ? 'ok' : 'feil')
    onSvar(riktig)
  }

  return (
    <div>
      <p className="skjema-hjelp">{oppgave.spoersmal}</p>
      {oppgave.dokument === 'lonnsslipp' && slipp ? (
        <LonnsslippDokument slipp={slipp} klikkbar valgtFelt={valgt} onFelt={klikk} />
      ) : null}
      {oppgave.dokument === 'skattekort' && person && forhold ? (
        <SkattekortDokument
          person={person}
          forhold={forhold}
          skattekort={fremdrift.skattekort}
          maanederIgjen={innhold.arbeid.maanederIgjen}
          klikkbar
          valgtFelt={valgt}
          onFelt={klikk}
        />
      ) : null}
      <TilbakemeldingBoks
        status={status}
        riktig={oppgave.tilbakemeldingRiktig}
        feil={oppgave.tilbakemeldingFeil}
      />
    </div>
  )
}
