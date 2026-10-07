import { delTekstIAvsnitt, parseOrdTokens } from '../utils/tekst'

interface Props {
  tekst: string
  onVelgOrd: (id: string) => void
}

export function KlikkbarTekst({ tekst, onVelgOrd }: Props) {
  return (
    <>
      {delTekstIAvsnitt(tekst).map((avsnitt, i) => (
        <p className="avsnitt" key={`${i}-${avsnitt.slice(0, 12)}`}>
          {parseOrdTokens(avsnitt).map((del, j) =>
            del.type === 'tekst' ? (
              <span key={`t-${j}`}>{del.verdi}</span>
            ) : (
              <button
                key={`o-${del.id}-${j}`}
                type="button"
                className="ordlenke"
                aria-label={`Åpne ordkort for ${del.visning}`}
                onClick={() => onVelgOrd(del.id)}
              >
                {del.visning}
              </button>
            ),
          )}
        </p>
      ))}
    </>
  )
}
