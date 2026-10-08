import type { Epost as EpostType } from '../../modell/typer'

interface Props {
  eposter: EpostType[]
}

export function Epost({ eposter }: Props) {
  return (
    <div>
      <header className="hjem-hode">
        <h1>E-post</h1>
        <p>Innboksen din.</p>
      </header>
      {eposter.length === 0 ? (
        <p className="tom-tilstand">Innboksen er tom.</p>
      ) : (
        <div className="liste">
          {eposter.map((epost) => (
            <article className="kort" key={epost.id}>
              <h2>{epost.emne}</h2>
              <p>
                <strong>Fra:</strong> {epost.fra}
              </p>
              <p>{epost.innhold}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
