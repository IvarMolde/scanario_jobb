import { useEffect, useState } from 'react'

const UKEDAGER = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'] as const

function formaterTid(dato: Date): string {
  return dato.toLocaleTimeString('nb-NO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function formaterDato(dato: Date): string {
  return dato.toLocaleDateString('nb-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function Statuslinje() {
  const [naa, setNaa] = useState(() => new Date())

  useEffect(() => {
    const oppdater = () => setNaa(new Date())
    oppdater()
    const id = window.setInterval(oppdater, 1000)
    return () => window.clearInterval(id)
  }, [])

  const ukedag = UKEDAGER[naa.getDay()] ?? 'Mandag'
  const tid = formaterTid(naa)
  const dato = formaterDato(naa)

  return (
    <header className="statuslinje" aria-label={`Klokke ${tid}. ${ukedag} ${dato}.`}>
      <time className="statuslinje-tid" dateTime={naa.toISOString()}>
        {tid}
      </time>
      <div className="statuslinje-senter">
        <span className="statuslinje-dag">{ukedag}</span>
        <span className="statuslinje-dato">{dato}</span>
      </div>
      <span className="statuslinje-ikoner" aria-hidden="true">
        <span className="status-signal" />
        <span className="status-wifi" />
        <span className="status-batteri" />
      </span>
    </header>
  )
}
