import type { Kalenderhendelse } from '../../modell/typer'

interface Props {
  hendelser: Kalenderhendelse[]
}

const UKEDAGER = [
  { kort: 'Man', full: 'Mandag' },
  { kort: 'Tir', full: 'Tirsdag' },
  { kort: 'Ons', full: 'Onsdag' },
  { kort: 'Tor', full: 'Torsdag' },
  { kort: 'Fre', full: 'Fredag' },
  { kort: 'Lør', full: 'Lørdag' },
  { kort: 'Søn', full: 'Søndag' },
] as const

function rensSted(sted: string): string {
  return sted.replace(/\s*\(øvingsversjon\)\s*/gi, '').trim()
}

function matcherDag(hendelseDag: string, full: string, kort: string): boolean {
  const d = hendelseDag.trim().toLowerCase()
  return d === full.toLowerCase() || d === kort.toLowerCase() || d.startsWith(kort.toLowerCase())
}

export function Kalender({ hendelser }: Props) {
  const renset = hendelser.map((h) => ({ ...h, sted: rensSted(h.sted) }))
  const harAvtaler = renset.length > 0

  return (
    <div className="kalender-app">
      <header className="hjem-hode">
        <h1>Kalender</h1>
        <p>Denne uken</p>
      </header>

      <div className="kalender-uke" role="grid" aria-label="Ukeoversikt mandag til søndag">
        {UKEDAGER.map((dag) => {
          const dagens = renset.filter((h) => matcherDag(h.dag, dag.full, dag.kort))
          const aktiv = dagens.length > 0
          return (
            <div
              key={dag.full}
              className={aktiv ? 'kalender-celle kalender-celle-aktiv' : 'kalender-celle'}
              role="gridcell"
              aria-label={
                aktiv
                  ? `${dag.full}: ${dagens.map((h) => `${h.tid} ${h.tittel}`).join('. ')}`
                  : dag.full
              }
            >
              <span className="kalender-celle-dag">{dag.kort}</span>
              {dagens.map((h) => (
                <span key={h.id} className="kalender-celle-prikk" aria-hidden="true">
                  {h.tid}
                </span>
              ))}
            </div>
          )
        })}
      </div>

      {!harAvtaler ? (
        <p className="tom-tilstand">Ingen avtaler denne uken.</p>
      ) : (
        <div className="kalender-detaljer">
          <h2 className="kalender-detaljer-tittel">Avtaler</h2>
          <ul className="kalender-liste">
            {renset.map((hendelse) => (
              <li className="kalender-avtale" key={hendelse.id}>
                <div className="kalender-avtale-tid">
                  <span className="kalender-avtale-dag">{hendelse.dag}</span>
                  <span className="kalender-avtale-klokke">{hendelse.tid}</span>
                </div>
                <div className="kalender-avtale-innhold">
                  <h3>{hendelse.tittel}</h3>
                  <p>{hendelse.sted}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
