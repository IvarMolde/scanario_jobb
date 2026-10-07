import { useMemo, useState } from 'react'
import type { Person, ReiseplanOppgave, Ruter } from '../../modell/typer'
import {
  kommerMedBuffer,
  holdeplassNavn,
  linjeNavn,
  oppdragFor,
  type LagretReise,
} from '../../spill/reise'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: ReiseplanOppgave
  person: Person
  ruter: Ruter
  ferdig: boolean
  onSvar: (riktig: boolean) => void
  onLagreReise: (reise: LagretReise, flagg: string[]) => void
}

export function Reiseplan({ oppgave, person, ruter, ferdig, onSvar, onLagreReise }: Props) {
  const oppdrag = oppdragFor(ruter, person.id)
  const avganger = useMemo(
    () => (oppdrag ? ruter.avganger.filter((a) => a.fra === oppdrag.fra && a.til === oppdrag.til) : []),
    [oppdrag, ruter.avganger],
  )
  const [valgtId, setValgtId] = useState<string | null>(null)
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)
  const [gikkLikevel, setGikkLikevel] = useState(false)

  if (!oppdrag) {
    return <p>Rutetabellen mangler et oppdrag for denne personen.</p>
  }

  const valgt = avganger.find((a) => a.id === valgtId)

  const sjekk = () => {
    if (!valgt || status === 'ok') return
    const riktig = kommerMedBuffer(valgt, oppdrag.ankomst, oppgave.bufferMin)
    setStatus(riktig ? 'ok' : 'feil')
    onSvar(riktig)
    if (riktig) {
      onLagreReise({ fra: oppdrag.fra, til: oppdrag.til, avgangId: valgt.id }, oppgave.flagg)
    }
  }

  const gaaLikevel = () => {
    if (!valgt) return
    onLagreReise({ fra: oppdrag.fra, til: oppdrag.til, avgangId: valgt.id }, [])
    onSvar(true)
    setGikkLikevel(true)
    setStatus('ok')
  }

  return (
    <div>
      <p className="plan-maal">
        Du skal være på {oppdrag.bedrift} klokka {oppdrag.ankomst}. Gå hjemmefra med {oppgave.bufferMin}{' '}
        minutter ekstra tid.
      </p>
      <p>
        Fra {holdeplassNavn(ruter, oppdrag.fra)} til {holdeplassNavn(ruter, oppdrag.til)}.
      </p>
      <div className="valggruppe" role="radiogroup" aria-label="Velg avgang">
        {avganger.map((a) => {
          const linje = linjeNavn(ruter, a.linjeId)
          return (
            <button
              key={a.id}
              type="button"
              className="knapp knapp-sekundaer"
              aria-pressed={valgtId === a.id}
              disabled={status === 'ok'}
              onClick={() => {
                setValgtId(a.id)
                if (status === 'feil') setStatus(null)
              }}
            >
              Linje {linje?.nummer ?? a.linjeId}: {a.avgang} → {a.ankomst} ({a.reisetidMin} min)
              {a.bytte ? ` · bytte klokka ${a.bytte.avgang}` : ''}
            </button>
          )
        })}
      </div>
      <div className="handlinger">
        <button type="button" className="knapp" disabled={!valgtId || status === 'ok'} onClick={sjekk}>
          Sjekk tiden
        </button>
        {status === 'feil' ? (
          <button type="button" className="knapp knapp-amber" onClick={gaaLikevel}>
            Gå likevel
          </button>
        ) : null}
      </div>
      <TilbakemeldingBoks
        status={status}
        riktig={
          gikkLikevel
            ? 'Du går likevel. Du får ikke flagget for å komme i rett tid.'
            : oppgave.tilbakemeldingRiktig
        }
        feil={oppgave.tilbakemeldingFeil}
      />
    </div>
  )
}
