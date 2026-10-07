import { useState } from 'react'
import { bildeUrl } from '../modell/media'

interface Props {
  fil?: string
  alt: string
  klasseNavn?: string
  prioritet?: boolean
}

export function SceneBilde({ fil, alt, klasseNavn = 'scene-bilde', prioritet = false }: Props) {
  const [feil, setFeil] = useState(false)

  if (!fil || feil) {
    return (
      <div className="plassholder-bilde" role="img" aria-label={alt || 'Bilde kommer her'}>
        Bilde kommer her
      </div>
    )
  }

  return (
    <img
      className={klasseNavn}
      src={bildeUrl(fil)}
      alt={alt}
      loading={prioritet ? 'eager' : 'lazy'}
      decoding="async"
      onError={(e) => {
        if (e.currentTarget.currentSrc) setFeil(true)
      }}
    />
  )
}
