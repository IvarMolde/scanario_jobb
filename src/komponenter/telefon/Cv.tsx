import type { Person } from '../../modell/typer'
import type { CvReferanse } from '../../spill/tilstand'

interface Props {
  person: Person | null
  harOppdatert: boolean
  manglerReferanse: boolean
  cvReferanse: CvReferanse | null
}

function referanseTekst(referanse: CvReferanse | null, fallback: string): string {
  if (!referanse) return fallback
  const navn = `${referanse.fornavn} ${referanse.etternavn}`.trim()
  return `Referanse: ${referanse.rolle} ${navn}. Tlf. ${referanse.telefon}`
}

export function Cv({ person, harOppdatert, manglerReferanse, cvReferanse }: Props) {
  if (!person) {
    return (
      <div>
        <header className="hjem-hode">
          <h1>CV</h1>
          <p>Din CV.</p>
        </header>
        <p className="tom-tilstand">Velg en person først.</p>
      </div>
    )
  }

  return (
    <div>
      <header className="hjem-hode">
        <h1>CV</h1>
        <p>Din CV.</p>
      </header>
      <article className="kort">
        <h2>
          {person.fornavn} {person.etternavn}
        </h2>
        <p>{person.bosted}</p>
      </article>
      <article className="kort">
        <h3>Erfaring</h3>
        <p>{harOppdatert ? person.cvErfaring : person.erfaring}</p>
      </article>
      <article className="kort">
        <h3>Utdanning</h3>
        <p>{harOppdatert ? person.cvUtdanning : person.utdanning}</p>
      </article>
      <article className="kort">
        <h3>Språk</h3>
        <p>{harOppdatert ? person.cvSprak : person.sprak.join(', ')}</p>
      </article>
      <article className="kort">
        <h3>Sertifikater</h3>
        <p>{harOppdatert ? person.cvSertifikater : person.sertifikater.join(', ')}</p>
      </article>
      <article className="kort">
        <h3>Referanse</h3>
        {manglerReferanse ? (
          <p className="advarsel">Referanse mangler. Linn ber om en referanse.</p>
        ) : (
          <p>
            {harOppdatert
              ? referanseTekst(cvReferanse, person.cvReferanse)
              : 'Ikke lagt inn ennå.'}
          </p>
        )}
      </article>
    </div>
  )
}
