import { useState } from 'react'
import type { Annonse } from '../../modell/typer'
import { SceneBilde } from '../SceneBilde'
import { KlikkbarTekst } from '../KlikkbarTekst'
import { KOMMUNE_NAVN } from '../../spill/sok'

interface Props {
  annonser: Annonse[]
  startId: string | null
  onVelgOrd: (id: string) => void
  onBytt: (id: string) => void
}

export function Jobbmagasin({ annonser, startId, onVelgOrd, onBytt }: Props) {
  const startIndeks = Math.max(
    0,
    annonser.findIndex((a) => a.id === startId),
  )
  const [brukerIndeks, setBrukerIndeks] = useState<number | null>(null)
  const indeks = brukerIndeks ?? (startIndeks < 0 ? 0 : startIndeks)
  const annonse = annonser[indeks]

  if (!annonse) {
    return (
      <div>
        <header className="hjem-hode">
          <h1>Jobbmagasinet</h1>
        </header>
        <p className="tom-tilstand">Ingen annonser.</p>
      </div>
    )
  }

  const bytt = (delta: number) => {
    const neste = (indeks + delta + annonser.length) % annonser.length
    setBrukerIndeks(neste)
    const id = annonser[neste]?.id
    if (id) onBytt(id)
  }

  return (
    <div>
      <header className="hjem-hode">
        <h1>Jobbmagasinet</h1>
        <p>
          Annonse {indeks + 1} av {annonser.length}.
        </p>
      </header>
      <div className="magasin-nav">
        <button type="button" className="knapp knapp-sekundaer" onClick={() => bytt(-1)}>
          Forrige
        </button>
        <button type="button" className="knapp knapp-sekundaer" onClick={() => bytt(1)}>
          Neste
        </button>
      </div>
      <article className="kort">
        <SceneBilde
          key={annonse.id}
          fil={annonse.bilde}
          alt={`${annonse.tittel} hos ${annonse.bedrift}`}
          kanZoom
          zoomModus="telefon"
          prioritet
        />
        <h2>{annonse.tittel}</h2>
        <p>{annonse.bedrift}</p>
        <p>
          {annonse.sted} · {KOMMUNE_NAVN[annonse.kommune] ?? annonse.kommune}
        </p>
        <ul className="nokkelord">
          <li>Søknadsfrist: {annonse.soknadsfrist}</li>
          <li>Stillingsprosent: {annonse.stillingsprosent}</li>
          <li>Tiltredelse: {annonse.tiltredelse}</li>
          <li>Kontaktperson: {annonse.kontaktperson}</li>
        </ul>
        <KlikkbarTekst tekst={annonse.tekst} onVelgOrd={onVelgOrd} />
      </article>
    </div>
  )
}
