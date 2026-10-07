import { useMemo, useState } from 'react'
import type { EgenskapKoblingOppgave, Person } from '../../modell/typer'
import { stokk } from '../../utils/miks'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: EgenskapKoblingOppgave
  person: Person
  ferdig: boolean
  onSvar: (riktig: boolean) => void
}

export function EgenskapKobling({ oppgave, person, ferdig, onSvar }: Props) {
  const mine = useMemo(
    () => oppgave.egenskaper.filter((e) => e.personer.includes(person.id)),
    [oppgave.egenskaper, person.id],
  )
  const [valgte, setValgte] = useState<string[]>(ferdig ? mine.map((e) => e.id) : [])
  const [valgtEgenskap, setValgtEgenskap] = useState<string | null>(null)
  const [par, setPar] = useState<Record<string, string>>(
    ferdig ? Object.fromEntries(mine.map((e) => [e.id, e.eksempel])) : {},
  )
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)
  const eksempler = useMemo(
    () => stokk(oppgave.egenskaper.map((e) => e.eksempel)),
    [oppgave.egenskaper],
  )

  const toggle = (id: string) => {
    if (status === 'ok') return
    setPar({})
    setValgtEgenskap(null)
    setValgte((forrige) => {
      if (forrige.includes(id)) return forrige.filter((x) => x !== id)
      if (forrige.length >= oppgave.max) return forrige
      return [...forrige, id]
    })
  }

  const koble = (eksempel: string) => {
    if (!valgtEgenskap || status === 'ok') return
    const neste = { ...par, [valgtEgenskap]: eksempel }
    setPar(neste)
    setValgtEgenskap(null)
    if (Object.keys(neste).length !== oppgave.min) return
    const valgteMine = valgte.every((id) => mine.some((e) => e.id === id)) && valgte.length === mine.length
    const riktigKobling = mine.every((e) => neste[e.id] === e.eksempel)
    const riktig = valgteMine && riktigKobling
    setStatus(riktig ? 'ok' : 'feil')
    onSvar(riktig)
    if (!riktig) {
      setPar({})
      setValgte([])
    }
  }

  const kanKoble = valgte.length === oppgave.min && status !== 'ok'

  return (
    <div>
      <p>Velg {oppgave.min} egenskaper:</p>
      <div className="brikker">
        {oppgave.egenskaper.map((e) => (
          <button
            key={e.id}
            type="button"
            className="brikke"
            aria-pressed={valgte.includes(e.id)}
            disabled={status === 'ok'}
            onClick={() => toggle(e.id)}
          >
            {e.ord}
          </button>
        ))}
      </div>
      {kanKoble ? (
        <>
          <p>Koble egenskap til eksempel:</p>
          <div className="valggruppe">
            {valgte.map((id) => {
              const e = oppgave.egenskaper.find((x) => x.id === id)
              if (!e) return null
              return (
                <button
                  key={id}
                  type="button"
                  className="knapp knapp-sekundaer"
                  aria-pressed={valgtEgenskap === id}
                  disabled={Boolean(par[id])}
                  onClick={() => setValgtEgenskap(id)}
                >
                  {e.ord}
                  {par[id] ? ` — ${par[id]}` : ''}
                </button>
              )
            })}
          </div>
          <div className="brikker">
            {eksempler.map((tekst) => (
              <button
                key={tekst}
                type="button"
                className="brikke"
                disabled={!valgtEgenskap}
                onClick={() => koble(tekst)}
              >
                {tekst}
              </button>
            ))}
          </div>
        </>
      ) : null}
      <TilbakemeldingBoks
        status={status}
        riktig={oppgave.tilbakemeldingRiktig}
        feil={oppgave.tilbakemeldingFeil}
      />
    </div>
  )
}
