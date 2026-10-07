import type { Kalenderhendelse } from '../../modell/typer'

interface Props {
  hendelser: Kalenderhendelse[]
}

export function Kalender({ hendelser }: Props) {
  return (
    <div>
      <header className="hjem-hode">
        <h1>Kalender</h1>
        <p>Dine avtaler i øvingsversjonen</p>
      </header>
      {hendelser.length === 0 ? (
        <p className="tom-tilstand">Ingen avtaler ennå.</p>
      ) : (
        <div className="liste">
          {hendelser.map((hendelse) => (
            <article className="kort" key={hendelse.id}>
              <div className="kalender-dag">
                {hendelse.dag} {hendelse.tid}
              </div>
              <h2>{hendelse.tittel}</h2>
              <p>{hendelse.sted}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
