import type { SmsISpill } from '../../spill/tilstand'
import { fyllNavn } from '../../utils/tekst'
import type { Person } from '../../modell/typer'

interface Props {
  kontakt: string
  meldinger: SmsISpill[]
  person: Person | null
}

export function Meldinger({ kontakt, meldinger, person }: Props) {
  return (
    <div>
      <header className="hjem-hode">
        <h1>Meldinger</h1>
        <p>{kontakt}</p>
      </header>
      {meldinger.length === 0 ? (
        <p className="tom-tilstand">Ingen meldinger ennå. Du kan skrive den første.</p>
      ) : (
        <div>
          {meldinger.map((melding) => (
            <div key={melding.id} className={`sms-rad ${melding.fra === 'elev' ? 'ut' : 'inn'}`}>
              <div className="sms-boble">
                {fyllNavn(melding.tekst, person)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
