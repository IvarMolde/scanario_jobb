import { useEffect, useState } from 'react'
import type { Epost as EpostType, Person } from '../../modell/typer'

interface Props {
  eposter: EpostType[]
  person: Person | null
}

function initialer(navn: string): string {
  return navn
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((ord) => ord[0]?.toUpperCase() ?? '')
    .join('')
}

function forhandsvisning(tekst: string): string {
  const ren = tekst.replace(/\s+/g, ' ').trim()
  return ren.length > 72 ? `${ren.slice(0, 69)}…` : ren
}

function epostAvsnitt(tekst: string): string[] {
  if (tekst.includes('\n')) {
    return tekst
      .split(/\n+/)
      .map((del) => del.trim())
      .filter(Boolean)
  }
  return tekst.split(/(?<=\.)\s+/).map((del) => del.trim()).filter(Boolean)
}

export function Epost({ eposter, person }: Props) {
  const synlige = eposter.filter((e) => e.id !== 'ovingsmail')
  const sisteId = synlige[synlige.length - 1]?.id ?? null
  const [apnetId, setApnetId] = useState<string | null>(sisteId)

  useEffect(() => {
    setApnetId(sisteId)
  }, [sisteId])

  const mottaker = person ? `${person.fornavn} ${person.etternavn}` : 'Deg'
  const apnet = synlige.find((e) => e.id === apnetId) ?? null

  if (synlige.length === 0) {
    return (
      <div className="epost-app">
        <header className="epost-hode">
          <h1>E-post</h1>
          <p>Innboks</p>
        </header>
        <p className="tom-tilstand">Innboksen er tom.</p>
      </div>
    )
  }

  if (apnet) {
    return (
      <div className="epost-app">
        <header className="epost-les-topp">
          {synlige.length > 1 ? (
            <button type="button" className="epost-tilbake" onClick={() => setApnetId(null)}>
              ← Innboks
            </button>
          ) : (
            <p className="epost-innboks-merke">Innboks</p>
          )}
        </header>

        <article className="epost-melding" aria-label={`E-post: ${apnet.emne}`}>
          <h2 className="epost-emne">{apnet.emne}</h2>

          <div className="epost-meta">
            <div className="epost-avatar" aria-hidden="true">
              {initialer(apnet.fra) || '?'}
            </div>
            <div className="epost-meta-tekst">
              <p className="epost-fra">
                <strong>{apnet.fra}</strong>
              </p>
              <p className="epost-til">til {mottaker}</p>
            </div>
          </div>

          <div className="epost-brødtekst">
            {epostAvsnitt(apnet.innhold).map((del, i) => (
              <p key={`${apnet.id}-p-${i}`}>{del}</p>
            ))}
          </div>
        </article>
      </div>
    )
  }

  return (
    <div className="epost-app">
      <header className="epost-hode">
        <h1>E-post</h1>
        <p>Innboks</p>
      </header>
      <ul className="epost-liste">
        {[...synlige].reverse().map((epost) => (
          <li key={epost.id}>
            <button type="button" className="epost-rad" onClick={() => setApnetId(epost.id)}>
              <span className="epost-avatar epost-avatar--liten" aria-hidden="true">
                {initialer(epost.fra) || '?'}
              </span>
              <span className="epost-rad-tekst">
                <span className="epost-rad-fra">{epost.fra}</span>
                <span className="epost-rad-emne">{epost.emne}</span>
                <span className="epost-rad-preview">{forhandsvisning(epost.innhold)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
