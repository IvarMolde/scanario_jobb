import { useMemo, useState } from 'react'
import type { Ruter } from '../../modell/typer'
import {
  filtrerAvganger,
  holdeplassNavn,
  linjeNavn,
  oppdragFor,
  type LagretReise,
} from '../../spill/reise'

interface Props {
  ruter: Ruter
  personId: string | null
  lagret: LagretReise | null
}

export function Reiseplanlegger({ ruter, personId, lagret }: Props) {
  const oppdrag = personId ? oppdragFor(ruter, personId) : undefined
  const [fra, setFra] = useState(lagret?.fra ?? oppdrag?.fra ?? ruter.holdeplasser[0]?.id ?? '')
  const [til, setTil] = useState(lagret?.til ?? oppdrag?.til ?? ruter.holdeplasser[1]?.id ?? '')
  const [ankomst, setAnkomst] = useState(oppdrag?.ankomst ?? '')

  const avganger = useMemo(() => filtrerAvganger(ruter, fra, til), [ruter, fra, til])

  return (
    <div>
      <header className="hjem-hode">
        <h1>Reiseplanlegger</h1>
        <p>Øvingsversjon. Fiktive linjer i Molde. Ingen ekte rutetabell.</p>
      </header>
      {oppdrag ? (
        <p className="plan-maal">
          Mål: framme til {oppdrag.bedrift} klokka {oppdrag.ankomst}.
        </p>
      ) : null}
      <form className="plan-skjema" onSubmit={(e) => e.preventDefault()}>
        <label>
          <span className="skjema-hjelp">Fra</span>
          <select value={fra} onChange={(e) => setFra(e.target.value)}>
            {ruter.holdeplasser.map((h) => (
              <option key={h.id} value={h.id}>
                {h.navn}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="skjema-hjelp">Til</span>
          <select value={til} onChange={(e) => setTil(e.target.value)}>
            {ruter.holdeplasser.map((h) => (
              <option key={h.id} value={h.id}>
                {h.navn}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="skjema-hjelp">Ønsket ankomst</span>
          <input
            type="time"
            value={ankomst}
            onChange={(e) => setAnkomst(e.target.value)}
            aria-label="Ønsket ankomst"
          />
        </label>
      </form>
      {avganger.length === 0 ? (
        <p className="tom-tilstand">Ingen avganger på denne strekningen. Prøv en annen holdeplass.</p>
      ) : (
        <ul className="reise-liste">
          {avganger.map((a) => {
            const linje = linjeNavn(ruter, a.linjeId)
            const valgt = lagret?.avgangId === a.id
            const bytteLinje = a.bytte ? linjeNavn(ruter, a.bytte.linjeId) : undefined
            return (
              <li className={`reise-kort${valgt ? ' valgt' : ''}`} key={a.id}>
                <h2>
                  Linje {linje?.nummer ?? a.linjeId}
                  {valgt ? ' · valgt' : ''}
                </h2>
                <p>{linje?.navn}</p>
                <p>
                  {holdeplassNavn(ruter, a.fra)} {a.avgang} → {holdeplassNavn(ruter, a.til)} {a.ankomst}
                </p>
                <p>Reisetid: {a.reisetidMin} minutter</p>
                {a.bytte ? (
                  <p className="reise-bytte">
                    Bytte på {a.bytte.sted}. Ankomst {a.bytte.ankomst}. Ny avgang {a.bytte.avgang}
                    {bytteLinje ? ` med linje ${bytteLinje.nummer}` : ''}.
                  </p>
                ) : null}
                {ankomst ? <p>Ankomst {a.ankomst}. Ønsket {ankomst}.</p> : null}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
