import { useEffect, useMemo, useState } from 'react'
import { lastInnhold } from '../innhold/lastInnhold'
import { bildeUrl, lydUrl, samleMedia } from '../modell/media'

async function finnes(url: string): Promise<boolean> {
  try {
    const svar = await fetch(url, { method: 'GET' })
    return svar.ok
  } catch {
    return false
  }
}

export function Laereroversikt() {
  const [rader, setRader] = useState<Array<{ type: string; fil: string; kilde: string; ok: boolean }>>([])
  const lastet = useMemo(() => {
    try {
      return { ok: true as const, refs: samleMedia(lastInnhold()) }
    } catch {
      return { ok: false as const, refs: [] }
    }
  }, [])
  const feil = lastet.ok ? null : 'Innholdet kunne ikke lastes. Kjør npm run valider.'

  useEffect(() => {
    if (!lastet.ok) return
    const refs = lastet.refs
    void Promise.all(
      refs.map(async (ref) => {
        const url = ref.type === 'bilde' ? bildeUrl(ref.fil) : lydUrl(ref.fil)
        const ok = await finnes(url)
        return { type: ref.type, fil: ref.fil, kilde: ref.kilde, ok }
      }),
    ).then(setRader)
  }, [lastet])

  const visning = rader.length > 0 ? rader : lastet.refs.map((ref) => ({
    type: ref.type,
    fil: ref.fil,
    kilde: ref.kilde,
    ok: false,
  }))
  const ferdigSjekk = rader.length > 0
  const mangler = ferdigSjekk ? rader.filter((r) => !r.ok).length : null

  return (
    <div className="laererside">
      <p className="ingress">Læreroversikt · ?laerer=1</p>
      <h1>Bilder og lydfiler</h1>
      <p>
        Bytt en fil ved å legge inn en ny fil med samme navn i <code>public/media/bilder</code> eller{' '}
        <code>public/media/lyd</code>.
      </p>
      {feil ? <p className="tilbakemelding feil">{feil}</p> : null}
      <p>
        {lastet.refs.length} filer i innholdet.
        {ferdigSjekk ? ` ${mangler} mangler.` : ' Sjekker filene …'}
      </p>
      <div className="tabell-ramme">
      <table className="media-tabell">
        <thead>
          <tr>
            <th>Type</th>
            <th>Fil</th>
            <th>Kilde</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {visning.map((rad) => (
            <tr key={`${rad.kilde}-${rad.fil}`}>
              <td>{rad.type}</td>
              <td>{rad.fil}</td>
              <td>{rad.kilde}</td>
              <td className={rad.ok ? 'ok-tekst' : 'mangler'}>
                {ferdigSjekk ? (rad.ok ? 'Funnet' : 'Mangler') : 'Sjekker …'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
