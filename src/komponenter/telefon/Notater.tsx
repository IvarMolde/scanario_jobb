import { useEffect, useState } from 'react'
import { useSpill } from '../../spill/SpillProvider'

type NotatId = 'fodselsnummer' | 'passord' | 'mote' | 'tips'

const NOTATER: Array<{ id: NotatId; tittel: string }> = [
  { id: 'fodselsnummer', tittel: 'Fødselsnummer' },
  { id: 'passord', tittel: 'Passord' },
  { id: 'mote', tittel: 'Møte' },
  { id: 'tips', tittel: 'Tips' },
]

export function Notater() {
  const { fremdrift, person, sikrePassord } = useSpill()
  const [aapen, setAapen] = useState<NotatId | null>(null)
  const [kopiert, setKopiert] = useState(false)

  useEffect(() => {
    sikrePassord()
  }, [sikrePassord])

  useEffect(() => {
    setKopiert(false)
  }, [aapen])

  const passord = fremdrift.innloggingKoder?.passord ?? '------'
  const fnr = person?.fodselsnummer ?? '––––––'
  const navn = person ? `${person.fornavn} ${person.etternavn}` : 'Personen din'

  const kopier = async (tekst: string) => {
    try {
      await navigator.clipboard.writeText(tekst.replaceAll(' ', ''))
      setKopiert(true)
    } catch {
      setKopiert(false)
    }
  }

  if (aapen === 'fodselsnummer') {
    return (
      <div className="notater-app">
        <header className="notater-hode">
          <button type="button" className="knapp knapp-sekundaer" onClick={() => setAapen(null)}>
            Tilbake
          </button>
          <h1>Fødselsnummer</h1>
        </header>
        <article className="notat-ark notat-passord">
          <p className="notat-etikett">{navn}</p>
          <p className="notat-kode notat-fnr" aria-label={`Fødselsnummer ${fnr}`}>
            {fnr}
          </p>
          <p className="notat-hjelp">Bruk dette nummeret når du logger inn i Skatteøving.</p>
          <div className="handlinger">
            <button type="button" className="knapp" onClick={() => void kopier(fnr)} disabled={!person}>
              {kopiert ? 'Kopiert' : 'Kopier nummer'}
            </button>
          </div>
        </article>
      </div>
    )
  }

  if (aapen === 'passord') {
    return (
      <div className="notater-app">
        <header className="notater-hode">
          <button type="button" className="knapp knapp-sekundaer" onClick={() => setAapen(null)}>
            Tilbake
          </button>
          <h1>Passord</h1>
        </header>
        <article className="notat-ark notat-passord">
          <p className="notat-etikett">Til Skatteøving</p>
          <p className="notat-kode" aria-label={`Passord ${passord}`}>
            {passord}
          </p>
          <p className="notat-hjelp">Dette er passordet ditt når du velger Passord i Skatteøving.</p>
        </article>
      </div>
    )
  }

  if (aapen === 'mote') {
    return (
      <div className="notater-app">
        <header className="notater-hode">
          <button type="button" className="knapp knapp-sekundaer" onClick={() => setAapen(null)}>
            Tilbake
          </button>
          <h1>Møte</h1>
        </header>
        <article className="notat-ark">
          <p>Møte med Linn på NAV.</p>
          <p>Ta med ID og CV.</p>
        </article>
      </div>
    )
  }

  if (aapen === 'tips') {
    return (
      <div className="notater-app">
        <header className="notater-hode">
          <button type="button" className="knapp knapp-sekundaer" onClick={() => setAapen(null)}>
            Tilbake
          </button>
          <h1>Tips</h1>
        </header>
        <article className="notat-ark">
          <p>Les annonsen før du søker.</p>
          <p>Sjekk søknadsfrist og stillingsprosent.</p>
        </article>
      </div>
    )
  }

  return (
    <div className="notater-app">
      <header className="hjem-hode">
        <h1>Notater</h1>
        <p>Åpne et notat.</p>
      </header>
      <ul className="notat-liste">
        {NOTATER.map((n) => (
          <li key={n.id}>
            <button type="button" className="notat-rad" onClick={() => setAapen(n.id)}>
              <span className="notat-rad-tittel">{n.tittel}</span>
              <span className="notat-rad-pil" aria-hidden="true">
                ›
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
