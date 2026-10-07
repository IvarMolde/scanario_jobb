import { useEffect, useRef } from 'react'
import type { VarselISpill } from '../../spill/tilstand'

interface Props {
  varsler: VarselISpill[]
  onLukk: (id: string) => void
}

export function Varsler({ varsler, onLukk }: Props) {
  const ulest = varsler.filter((v) => !v.lest)
  if (ulest.length === 0) return null
  const siste = ulest[ulest.length - 1]
  if (!siste) return null

  if (siste.type === 'anrop') {
    return <AnropDialog varsel={siste} onLukk={onLukk} />
  }

  return (
    <div className="varsel" role="status">
      <div>
        <strong>{siste.type === 'sms' ? 'Ny melding' : 'Ny e-post'}</strong>
        <span>
          {siste.fra}: {siste.innhold}
        </span>
      </div>
      <button type="button" className="knapp knapp-sekundaer" onClick={() => onLukk(siste.id)}>
        Lukk
      </button>
    </div>
  )
}

function AnropDialog({
  varsel,
  onLukk,
}: {
  varsel: VarselISpill
  onLukk: (id: string) => void
}) {
  const knappRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    knappRef.current?.focus()
  }, [varsel.id])

  return (
    <div className="anrop" role="alertdialog" aria-modal="true" aria-labelledby="anrop-tittel">
      <p id="anrop-tittel">Tapt anrop</p>
      <p className="anrop-fra">{varsel.fra}</p>
      <p>{varsel.innhold}</p>
      <button
        type="button"
        className="knapp knapp-amber"
        ref={knappRef}
        onClick={() => onLukk(varsel.id)}
      >
        Lukk og lytt til talemeldingen
      </button>
    </div>
  )
}
