import type { Annonse } from '../../modell/typer'
import { filtrerAnnonser, KOMMUNE_NAVN } from '../../spill/sok'
import type { LagretSok } from '../../spill/tilstand'

interface Props {
  annonser: Annonse[]
  lagretSok: LagretSok | null
}

export function Jobbportal({ annonser, lagretSok }: Props) {
  const treff = lagretSok ? filtrerAnnonser(annonser, lagretSok) : annonser

  return (
    <div>
      <header className="hjem-hode">
        <h1>Jobbportal</h1>
        <p>Øvingsversjon. Ingen ekte stillinger.</p>
      </header>
      {lagretSok ? (
        <p className="tilbakemelding info" role="status">
          Søket er lagret
          {lagretSok.varsel ? '. Varsel er på.' : '.'} {treff.length} treff.
        </p>
      ) : (
        <p>Lagre et søk i oppgaven. Da ser du trefflisten her.</p>
      )}
      {treff.length === 0 ? (
        <p className="tom-tilstand">Ingen treff. Prøv Molde og et annet søkeord.</p>
      ) : (
        <div className="liste">
          {treff.map((a) => (
            <article className="kort" key={a.id}>
              <h2>{a.tittel}</h2>
              <p>{a.bedrift}</p>
              <p>
                {a.sted} · {KOMMUNE_NAVN[a.kommune] ?? a.kommune}
              </p>
              <ul className="nokkelord">
                <li>Søknadsfrist: {a.soknadsfrist}</li>
                <li>Stillingsprosent: {a.stillingsprosent}</li>
                <li>Tiltredelse: {a.tiltredelse}</li>
                <li>Kontaktperson: {a.kontaktperson}</li>
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
