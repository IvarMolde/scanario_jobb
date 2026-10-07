import type { MatchKrav, MatchSvar } from '../../modell/typer'
import { forklaringForKrav, KATEGORI_NAVN, MATCH_SVAR } from './vurder'

interface Props {
  krav: MatchKrav[]
  personId: string
  svar: Record<string, MatchSvar>
  onSvar: (kravId: string, svar: MatchSvar) => void
  visForklaring: boolean
  disabled?: boolean
}

export function Matchvurdering({ krav, personId, svar, onSvar, visForklaring, disabled }: Props) {
  return (
    <div className="match-liste">
      {krav.map((k) => (
        <article className="match-krav" key={k.id}>
          <p className="match-kategori">{KATEGORI_NAVN[k.kategori]}</p>
          <p>{k.tekst}</p>
          <div className="valggruppe" role="group" aria-label={k.tekst}>
            {MATCH_SVAR.map((alt) => (
              <button
                key={alt.id}
                type="button"
                className="knapp knapp-sekundaer"
                aria-pressed={svar[k.id] === alt.id}
                disabled={disabled}
                onClick={() => onSvar(k.id, alt.id)}
              >
                {alt.tekst}
              </button>
            ))}
          </div>
          {visForklaring && svar[k.id] ? (
            <p className="match-forklaring">{forklaringForKrav(k, personId, svar[k.id])}</p>
          ) : null}
        </article>
      ))}
    </div>
  )
}
