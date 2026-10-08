import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Person } from '../../modell/typer'
import { SceneBilde } from '../SceneBilde'

interface Props {
  person: Person
  aapen: boolean
  onLukk: () => void
}

export function PersonHjelpDialog({ person, aapen, onLukk }: Props) {
  const tittelId = useId()
  const lukkRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!aapen) return
    const forrige = document.activeElement as HTMLElement | null
    lukkRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onLukk()
    }
    document.addEventListener('keydown', onKey)
    const forrigeOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = forrigeOverflow
      forrige?.focus?.()
    }
  }, [aapen, onLukk])

  if (!aapen) return null

  return createPortal(
    <div className="person-hjelp-overlay" role="presentation" onClick={onLukk}>
      <div
        className="person-hjelp-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={tittelId}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="person-hjelp-glow" aria-hidden="true" />

        <header className="person-hjelp-topp">
          <div className="person-hjelp-merke">Hjelp til oppgaven</div>
          <button
            ref={lukkRef}
            type="button"
            className="person-hjelp-lukk"
            onClick={onLukk}
            aria-label="Lukk hjelp"
          >
            ×
          </button>
        </header>

        <div className="person-hjelp-profil">
          <SceneBilde
            fil={person.bilde}
            alt={`${person.fornavn} ${person.etternavn}`}
            klasseNavn="person-hjelp-foto"
            prioritet
          />
          <div className="person-hjelp-navnblokk">
            <h2 id={tittelId}>
              {person.fornavn} {person.etternavn}
            </h2>
            <p className="person-hjelp-meta">
              {person.bosted} · {person.yrkesmal}
            </p>
          </div>
        </div>

        <section className="person-hjelp-seksjon">
          <h3>Om {person.fornavn}</h3>
          <p className="person-hjelp-tekst">{person.presentasjon}</p>
        </section>

        <section className="person-hjelp-seksjon">
          <h3>Egenskaper du skal velge</h3>
          <p className="person-hjelp-tips">
            Finn disse tre ordene i oppgaven. Deretter kobler du hvert ord til riktig forklaring.
          </p>
          <ul className="person-hjelp-egenskaper">
            {person.egenskaper.map((ord) => (
              <li key={ord}>
                <span className="person-hjelp-chip">{ord}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="person-hjelp-fakta">
          <div>
            <span className="person-hjelp-label">Erfaring</span>
            <strong>{person.erfaring}</strong>
          </div>
          <div>
            <span className="person-hjelp-label">Utdanning</span>
            <strong>{person.utdanning}</strong>
          </div>
          <div>
            <span className="person-hjelp-label">Språk</span>
            <strong>{person.sprak.join(', ')}</strong>
          </div>
        </section>

        <button type="button" className="knapp person-hjelp-ferdig" onClick={onLukk}>
          Tilbake til oppgaven
        </button>
      </div>
    </div>,
    document.body,
  )
}
