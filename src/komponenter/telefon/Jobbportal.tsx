import type { Annonse } from '../../modell/typer'
import { filtrerAnnonser, KOMMUNE_NAVN } from '../../spill/sok'
import type { LagretSok } from '../../spill/tilstand'

interface Props {
  annonser: Annonse[]
  lagretSok: LagretSok | null
  /** Når satt: vis denne annonsen som treff (scenen krever en bestemt stilling) */
  fokusAnnonseId?: string | null
}

function formatKontakt(person: Annonse['kontaktperson']): string {
  if (Array.isArray(person) && person.length > 1) {
    return `Kontaktpersoner: ${person.join(' og ')}`
  }
  const navn = Array.isArray(person) ? person[0] : person
  return `Kontaktperson: ${navn}`
}

export function Jobbportal({ annonser, lagretSok, fokusAnnonseId }: Props) {
  const fokusAnnonse = fokusAnnonseId
    ? (annonser.find((a) => a.id === fokusAnnonseId) ?? null)
    : null
  const filtrerte = lagretSok ? filtrerAnnonser(annonser, lagretSok) : annonser
  const treff = fokusAnnonse
    ? [fokusAnnonse]
    : filtrerte

  return (
    <div>
      <header className="hjem-hode">
        <h1>Jobbportal</h1>
        <p>Søk etter stillinger.</p>
      </header>
      {lagretSok || fokusAnnonse ? (
        <p className="tilbakemelding info" role="status">
          Søket er lagret
          {lagretSok && !lagretSok.varsel && !fokusAnnonse ? '.' : '. Varsel er på.'}{' '}
          {treff.length} treff.
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
                <li>{formatKontakt(a.kontaktperson)}</li>
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
