import { useEffect, useMemo, useState } from 'react'
import type { Kalenderhendelse } from '../../modell/typer'

interface Props {
  hendelser: Kalenderhendelse[]
  /** Dagens navn fra scenen, f.eks. «Mandag» */
  sceneDag?: string | null
}

const UKEDAGER = [
  { kort: 'Man', full: 'Mandag' },
  { kort: 'Tir', full: 'Tirsdag' },
  { kort: 'Ons', full: 'Onsdag' },
  { kort: 'Tor', full: 'Torsdag' },
  { kort: 'Fre', full: 'Fredag' },
  { kort: 'Lør', full: 'Lørdag' },
  { kort: 'Søn', full: 'Søndag' },
] as const

type UkeDag = (typeof UKEDAGER)[number]['full']

function rensSted(sted: string): string {
  return sted.replace(/\s*\(øvingsversjon\)\s*/gi, '').trim()
}

function matcherDag(hendelseDag: string, full: string, kort: string): boolean {
  const d = hendelseDag.trim().toLowerCase()
  return d === full.toLowerCase() || d === kort.toLowerCase() || d.startsWith(kort.toLowerCase())
}

function finnUkeDag(navn: string | null | undefined): UkeDag | null {
  if (!navn) return null
  const treff = UKEDAGER.find((dag) => matcherDag(navn, dag.full, dag.kort))
  return treff?.full ?? null
}

function startDag(hendelser: Kalenderhendelse[], sceneDag?: string | null): UkeDag {
  const scene = finnUkeDag(sceneDag)
  if (scene && hendelser.some((h) => matcherDag(h.dag, scene, scene.slice(0, 3)))) {
    return scene
  }
  for (const dag of UKEDAGER) {
    if (hendelser.some((h) => matcherDag(h.dag, dag.full, dag.kort))) {
      return dag.full
    }
  }
  return scene ?? 'Mandag'
}

export function Kalender({ hendelser, sceneDag = null }: Props) {
  const renset = useMemo(
    () => hendelser.map((h) => ({ ...h, sted: rensSted(h.sted) })),
    [hendelser],
  )
  const [valgtDag, setValgtDag] = useState<UkeDag>(() => startDag(renset, sceneDag))
  const iDag = finnUkeDag(sceneDag)

  useEffect(() => {
    setValgtDag(startDag(renset, sceneDag))
  }, [renset, sceneDag])

  const avtalerValgtDag = renset.filter((h) => {
    const dag = UKEDAGER.find((d) => d.full === valgtDag)
    return dag ? matcherDag(h.dag, dag.full, dag.kort) : false
  })

  return (
    <div className="kalender-app">
      <header className="hjem-hode">
        <h1>Kalender</h1>
        <p>Denne uken · trykk på en dag</p>
      </header>

      <div className="kalender-uke" role="tablist" aria-label="Ukeoversikt mandag til søndag">
        {UKEDAGER.map((dag) => {
          const dagens = renset.filter((h) => matcherDag(h.dag, dag.full, dag.kort))
          const harAvtale = dagens.length > 0
          const valgt = valgtDag === dag.full
          const erIDag = iDag === dag.full
          const klasse = [
            'kalender-celle',
            harAvtale ? 'kalender-celle-har-avtale' : '',
            valgt ? 'kalender-celle-valgt' : '',
            erIDag ? 'kalender-celle-idag' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <button
              key={dag.full}
              type="button"
              className={klasse}
              role="tab"
              aria-selected={valgt}
              aria-label={
                harAvtale
                  ? `${dag.full}: ${dagens.map((h) => `${h.tid} ${h.tittel}`).join('. ')}`
                  : dag.full
              }
              onClick={() => setValgtDag(dag.full)}
            >
              <span className="kalender-celle-dag">{dag.kort}</span>
              {dagens.map((h) => (
                <span key={h.id} className="kalender-celle-prikk" aria-hidden="true">
                  {h.tid}
                </span>
              ))}
            </button>
          )
        })}
      </div>

      <div className="kalender-detaljer">
        <h2 className="kalender-detaljer-tittel">Avtaler · {valgtDag}</h2>
        {avtalerValgtDag.length === 0 ? (
          <p className="tom-tilstand kalender-tom-dag">Ingen avtaler {valgtDag.toLowerCase()}.</p>
        ) : (
          <ul className="kalender-liste">
            {avtalerValgtDag.map((hendelse) => (
              <li className="kalender-avtale" key={hendelse.id}>
                <div className="kalender-avtale-tid">
                  <span className="kalender-avtale-dag">{hendelse.dag}</span>
                  <span className="kalender-avtale-klokke">{hendelse.tid}</span>
                </div>
                <div className="kalender-avtale-innhold">
                  <h3>{hendelse.tittel}</h3>
                  <p>{hendelse.sted}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
