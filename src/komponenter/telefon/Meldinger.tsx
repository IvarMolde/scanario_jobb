import type { SmsISpill } from '../../spill/tilstand'
import { fyllNavn } from '../../utils/tekst'
import type { Person } from '../../modell/typer'

interface Props {
  kontakt: string
  meldinger: SmsISpill[]
  person: Person | null
  utkast: string | null
}

export function Meldinger({ kontakt, meldinger, person, utkast }: Props) {
  const initialer = kontakt
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((ord) => ord[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div className="sms-app">
      <header className="sms-topp">
        <div className="sms-avatar" aria-hidden="true">
          {initialer || '?'}
        </div>
        <div className="sms-topp-tekst">
          <h1>{kontakt}</h1>
          <p>Meldinger</p>
        </div>
      </header>

      <div className="sms-trad" role="log" aria-live="polite" aria-relevant="additions">
        {meldinger.length === 0 && !utkast ? (
          <p className="sms-tom">Ingen meldinger ennå. Velg tekst i oppgaven.</p>
        ) : null}
        {meldinger.map((melding) => (
          <div key={melding.id} className={`sms-rad ${melding.fra === 'elev' ? 'ut' : 'inn'}`}>
            <div className="sms-boble">{fyllNavn(melding.tekst, person)}</div>
          </div>
        ))}
        {utkast ? (
          <div className="sms-rad ut">
            <div className="sms-boble sms-utkast">
              <span className="sms-utkast-merke">Skriver</span>
              {utkast}
            </div>
          </div>
        ) : null}
      </div>

      <div className="sms-skriver" aria-hidden={utkast ? undefined : true}>
        <div className={`sms-input${utkast ? ' har-tekst' : ''}`}>
          {utkast || 'Skriv en melding…'}
        </div>
        <span className={`sms-send-ikon${utkast ? ' aktiv' : ''}`} aria-hidden="true">
          ↑
        </span>
      </div>
    </div>
  )
}
