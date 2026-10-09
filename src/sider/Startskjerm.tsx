import { MORSMAL_ETIKETTER, type Morsmal } from '../modell/typer'
import { useSpill } from '../spill/SpillProvider'
import { Lydspiller } from '../komponenter/Lydspiller'
import { SceneBilde } from '../komponenter/SceneBilde'

export function Startskjerm() {
  const { innhold, fremdrift, velgPerson, velgMorsmal, startSpill } = useSpill()
  const klar = Boolean(fremdrift.personId && fremdrift.morsmal)

  return (
    <div className="startside" id="oppgave-innhold" tabIndex={-1}>
      <p className="ingress">{innhold.scenario.kurs} · Nivå {innhold.scenario.nivaa}</p>
      <h1>Jobbreisen – et spill utviklet av Ivar Øverland</h1>
      <p>Du øver på å søke jobb. Først velger du morsmål. Deretter velger du en person.</p>
      <h2 id="velg-morsmal">1. Velg morsmål</h2>
      <p>Ordkort vises på dette språket.</p>
      <div className="morsmal-valg" role="group" aria-labelledby="velg-morsmal">
        {(Object.keys(MORSMAL_ETIKETTER) as Morsmal[]).map((kode) => (
          <button
            key={kode}
            type="button"
            className="knapp knapp-sekundaer"
            aria-pressed={fremdrift.morsmal === kode}
            lang={kode === 'uk' ? 'uk' : kode}
            dir={kode === 'ar' ? 'rtl' : 'ltr'}
            onClick={() => velgMorsmal(kode)}
          >
            {MORSMAL_ETIKETTER[kode]}
          </button>
        ))}
      </div>
      <h2 id="velg-person">2. Velg person</h2>
      <div className="person-liste" role="group" aria-labelledby="velg-person">
        {innhold.personer.map((person) => (
          <article key={person.id}>
            <button
              type="button"
              className="personkort"
              aria-pressed={fremdrift.personId === person.id}
              onClick={() => velgPerson(person.id)}
            >
              <SceneBilde
                fil={person.bilde}
                alt={`${person.fornavn} ${person.etternavn}`}
                klasseNavn="avatar"
                prioritet
              />
              <span>
                <strong>
                  {person.fornavn} {person.etternavn}
                </strong>
                <br />
                {person.yrkesmal}
                <br />
                {person.bosted}
                <br />
                {person.forerkort ? `Førerkort ${person.forerkortType ?? ''}` : 'Ikke førerkort'}
                <br />
                Fødselsnummer: {person.fodselsnummer}
              </span>
            </button>
            <p>{person.presentasjon}</p>
            <Lydspiller fil={person.presentasjonLyd} etikett={`Hør ${person.fornavn}`} />
          </article>
        ))}
      </div>
      <div className="handlinger">
        <button type="button" className="knapp knapp-amber" disabled={!klar} onClick={startSpill}>
          Start
        </button>
      </div>
    </div>
  )
}
