import { useMemo, useState } from 'react'
import type { Annonse, MatchSjekklisteOppgave, MatchSvar, Person } from '../../modell/typer'
import { Matchvurdering } from '../match/Matchvurdering'
import { erRiktigMatchSvar } from '../match/vurder'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: MatchSjekklisteOppgave
  person: Person
  annonse: Annonse | undefined
  ferdig: boolean
  onSvar: (riktig: boolean) => void
}

export function MatchSjekkliste({ oppgave, person, annonse, ferdig, onSvar }: Props) {
  const krav = useMemo(
    () => (annonse ? annonse.krav.filter((k) => oppgave.kategorier.includes(k.kategori)) : []),
    [annonse, oppgave.kategorier],
  )
  const [svar, setSvar] = useState<Record<string, MatchSvar>>({})
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)

  const sjekk = () => {
    if (status === 'ok' || krav.length === 0) return
    const alleSvart = krav.every((k) => svar[k.id])
    if (!alleSvart) {
      setStatus('feil')
      onSvar(false)
      return
    }
    const riktig = krav.every((k) => erRiktigMatchSvar(k, person.id, svar[k.id]))
    setStatus(riktig ? 'ok' : 'feil')
    onSvar(riktig)
  }

  if (!annonse) {
    return <p>Annonse mangler. Be læreren sjekke innholdet.</p>
  }

  return (
    <div>
      <p>
        <strong>{annonse.tittel}</strong> hos {annonse.bedrift}
      </p>
      <Matchvurdering
        krav={krav}
        personId={person.id}
        svar={svar}
        onSvar={(id, verdi) => {
          if (status === 'ok') return
          setSvar((forrige) => ({ ...forrige, [id]: verdi }))
          setStatus(null)
        }}
        visForklaring={status !== null}
        disabled={status === 'ok'}
      />
      <button type="button" className="knapp" disabled={status === 'ok'} onClick={sjekk}>
        Sjekk match
      </button>
      <TilbakemeldingBoks
        status={status}
        riktig={oppgave.tilbakemeldingRiktig}
        feil={oppgave.tilbakemeldingFeil}
      />
    </div>
  )
}
