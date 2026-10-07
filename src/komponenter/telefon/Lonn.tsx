import { byggLonnsslipp } from '../../spill/lonn'
import { useSpill } from '../../spill/SpillProvider'
import { LonnsslippDokument } from '../skatt/LonnsslippDokument'

export function Lonn() {
  const { innhold, person, fremdrift } = useSpill()
  const slipp =
    person ? byggLonnsslipp(person, innhold.arbeid, fremdrift.skattekort, false) : null

  return (
    <div>
      <header className="hjem-hode">
        <h1>Lønn</h1>
        <p>Øvingsversjon. Fiktiv lønnsslipp. Ingen ekte utbetaling.</p>
      </header>
      {!slipp ? (
        <p>Lønnsslippen kommer når du har en jobb i øvingen.</p>
      ) : (
        <>
          <LonnsslippDokument slipp={slipp} />
          <div className="handlinger">
            <button type="button" className="knapp" onClick={() => window.print()}>
              Skriv ut lønnsslippen
            </button>
          </div>
        </>
      )}
    </div>
  )
}
