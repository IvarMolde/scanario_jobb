import { useEffect, useMemo, useState } from 'react'
import { lastInnhold } from '../innhold/lastInnhold'
import { LYD_ROLLE_NAVN, grupperLydklipp, samleLydklipp, type Lydklipp } from '../modell/lydmanus'
import { bildeUrl, lydUrl, samleMedia } from '../modell/media'

async function finnes(url: string): Promise<boolean> {
  try {
    const svar = await fetch(url, { method: 'GET' })
    return svar.ok
  } catch {
    return false
  }
}

function Kopier({ tekst, etikett }: { tekst: string; etikett: string }) {
  const [ok, setOk] = useState(false)
  return (
    <button
      type="button"
      className="knapp knapp-sekundaer"
      onClick={() => {
        void navigator.clipboard.writeText(tekst).then(() => {
          setOk(true)
          window.setTimeout(() => setOk(false), 1500)
        })
      }}
    >
      {ok ? 'Kopiert' : etikett}
    </button>
  )
}

export function Laereroversikt() {
  const [fane, setFane] = useState<'innspilling' | 'filer'>('innspilling')
  const [episodeFilter, setEpisodeFilter] = useState<string>('alle')
  const [rader, setRader] = useState<Array<{ type: string; fil: string; kilde: string; ok: boolean }>>([])

  const lastet = useMemo(() => {
    try {
      const innhold = lastInnhold()
      return {
        ok: true as const,
        refs: samleMedia(innhold),
        klipp: samleLydklipp(innhold),
      }
    } catch {
      return { ok: false as const, refs: [], klipp: [] as Lydklipp[] }
    }
  }, [])

  const feil = lastet.ok ? null : 'Innholdet kunne ikke lastes. Kjør npm run valider.'
  const grupper = useMemo(() => grupperLydklipp(lastet.klipp), [lastet.klipp])

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
  const synligeGrupper =
    episodeFilter === 'alle' ? grupper : grupper.filter((g) => g.klipp[0]?.episodeId === episodeFilter)

  return (
    <div className="laererside" id="oppgave-innhold" tabIndex={-1}>
      <p className="ingress">Læreroversikt · ?laerer=1</p>
      <h1>Bilder og lydfiler</h1>
      <p>
        Bytt en fil ved å legge inn en ny fil med <strong>samme filnavn</strong> i{' '}
        <code>public/media/bilder</code> eller <code>public/media/lyd</code>. JSON trenger ikke endres.
      </p>
      {feil ? <p className="tilbakemelding feil">{feil}</p> : null}

      <div className="handlinger" role="tablist" aria-label="Læreroversikt">
        <button
          type="button"
          className="knapp"
          role="tab"
          aria-selected={fane === 'innspilling'}
          onClick={() => setFane('innspilling')}
        >
          Innspilling
        </button>
        <button
          type="button"
          className="knapp knapp-sekundaer"
          role="tab"
          aria-selected={fane === 'filer'}
          onClick={() => setFane('filer')}
        >
          Alle filer
        </button>
      </div>

      {fane === 'innspilling' ? (
        <>
          <p>
            {lastet.klipp.length} unike lydfiler. Les teksten høyt, sakte og tydelig. Lagre med nøyaktig
            filnavn. Du kan også skrive ut denne siden.
          </p>
          <div className="handlinger" role="group" aria-label="Velg episode">
            <button
              type="button"
              className="knapp knapp-sekundaer"
              aria-pressed={episodeFilter === 'alle'}
              onClick={() => setEpisodeFilter('alle')}
            >
              Alle
            </button>
            {grupper
              .filter((g) => g.klipp[0]?.episodeId)
              .map((g) => {
                const id = g.klipp[0]?.episodeId ?? ''
                return (
                  <button
                    key={id}
                    type="button"
                    className="knapp knapp-sekundaer"
                    aria-pressed={episodeFilter === id}
                    onClick={() => setEpisodeFilter(id)}
                  >
                    {g.tittel.replace('Episode ', 'Ep. ')}
                  </button>
                )
              })}
          </div>
          {synligeGrupper.map((gruppe) => (
            <section key={gruppe.tittel} className="innspilling-gruppe" aria-labelledby={`g-${gruppe.tittel}`}>
              <h2 id={`g-${gruppe.tittel}`}>{gruppe.tittel}</h2>
              {gruppe.klipp.map((k) => (
                <article key={k.fil} className="innspillingskort">
                  <p className="innspilling-fil">
                    <code>{k.fil}</code>
                  </p>
                  <p className="innspilling-meta">
                    {LYD_ROLLE_NAVN[k.rolle]} · {k.steder.join(' · ')}
                  </p>
                  <p className="innspilling-les">{k.les}</p>
                  <div className="handlinger">
                    <Kopier tekst={k.fil} etikett="Kopier filnavn" />
                    <Kopier tekst={k.les} etikett="Kopier tekst" />
                  </div>
                </article>
              ))}
            </section>
          ))}
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
