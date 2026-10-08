import type { Person } from '../../modell/typer'

interface Props {
  person: Person | null
  harOppdatert: boolean
  manglerReferanse: boolean
}

export function Cv({ person, harOppdatert, manglerReferanse }: Props) {
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
          <p>{harOppdatert ? person.cvReferanse : 'Ikke lagt inn ennå.'}</p>
        )}
      </article>
    </div>
  )
}
