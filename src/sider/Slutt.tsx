import { useState } from 'react'
import { velgUtfall } from '../spill/reise'
import { useSpill } from '../spill/SpillProvider'

export function Slutt() {
  const { innhold, person, fremdrift, tilbakeTilEpisoder } = useSpill()
  const utfall = velgUtfall(innhold.slutt.utfall, fremdrift.flagg)
  const [dato] = useState(() =>
    new Date().toLocaleDateString('nb-NO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  )
  const navn = person ? `${person.fornavn} ${person.etternavn}` : 'Eleven'
  const episoder = innhold.scenario.episoder.filter((ep) => fremdrift.fullforteEpisoder.includes(ep.id))
  const punkter = innhold.slutt.reisePunkter.filter((p) => {
    if (p.visHvisFlagg && !fremdrift.flagg.includes(p.visHvisFlagg)) return false
    if (p.visHvisIkkeFlagg && fremdrift.flagg.includes(p.visHvisIkkeFlagg)) return false
    return true
  })

  return (
    <div className="oppsummering panel slutt" id="oppgave-innhold" tabIndex={-1}>
      <p className="ingress">Slutt · vis denne siden til læreren</p>
      <h1>{innhold.slutt.tittel}</h1>
      <p>{innhold.slutt.ingress}</p>
      <section className="slutt-utfall" aria-labelledby="utfall-tittel">
        <h2 id="utfall-tittel">{utfall.tittel}</h2>
        <p>{utfall.tekst}</p>
      </section>
      <h2>Hele jobbreisen</h2>
      <ul>
        {punkter.map((p) => (
          <li key={p.tekst}>{p.tekst}</li>
        ))}
      </ul>
      <article className="bevis" aria-labelledby="bevis-tittel">
        <p className="bevis-merke">Molde voksenopplæringssenter · MBO</p>
        <h2 id="bevis-tittel">{innhold.slutt.bevisTittel}</h2>
        <p className="bevis-navn">{navn}</p>
        <p>
          {innhold.slutt.bevisTekst}
        </p>
        <h3>Fullførte episoder</h3>
        <ol>
          {episoder.map((ep) => (
            <li key={ep.id}>
              Episode {ep.nummer}: {ep.tittel}
            </li>
          ))}
        </ol>
        <p className="bevis-dato">Dato: {dato}</p>
        <p className="bevis-fot">Ingen elevdata er lagret.</p>
      </article>
      <div className="handlinger">
        <button type="button" className="knapp" onClick={() => window.print()}>
          Skriv ut kursbevis
        </button>
        <button type="button" className="knapp knapp-sekundaer" onClick={tilbakeTilEpisoder}>
          Til episodene
        </button>
      </div>
    </div>
  )
}
