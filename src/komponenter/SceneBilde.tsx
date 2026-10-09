import { useEffect, useId, useState } from 'react'
import { bildeUrl } from '../modell/media'

interface Props {
  fil?: string
  alt: string
  klasseNavn?: string
  prioritet?: boolean
  kanZoom?: boolean
}

export function SceneBilde({
  fil,
  alt,
  klasseNavn = 'scene-bilde',
  prioritet = false,
  kanZoom = false,
}: Props) {
  const [feil, setFeil] = useState(false)
  const [zoom, setZoom] = useState(false)
  const tittelId = useId()

  useEffect(() => {
    if (!zoom) return
    const forrige = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onTaste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoom(false)
    }
    window.addEventListener('keydown', onTaste)
    return () => {
      document.body.style.overflow = forrige
      window.removeEventListener('keydown', onTaste)
    }
  }, [zoom])

  if (!fil || feil) {
    return (
      <div className="plassholder-bilde" role="img" aria-label={alt || 'Bilde kommer her'}>
        Bilde kommer her
      </div>
    )
  }

  const src = bildeUrl(fil)
  const bilde = (
    <img
      className={klasseNavn}
      src={src}
      alt={kanZoom ? '' : alt}
      loading={prioritet ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onError={(e) => {
        if (e.currentTarget.currentSrc) setFeil(true)
      }}
    />
  )

  return (
    <>
      {kanZoom ? (
        <button
          type="button"
          className="scene-bilde-knapp kan-zoom"
          onClick={() => setZoom(true)}
          aria-label={`${alt}. Klikk for å forstørre.`}
        >
          {bilde}
          <span className="scene-bilde-zoomhint">Klikk for å forstørre</span>
        </button>
      ) : (
        bilde
      )}

      {zoom ? (
        <div
          className="bilde-zoom-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby={tittelId}
          onClick={() => setZoom(false)}
        >
          <div
            className="bilde-zoom-ramme"
            role="presentation"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bilde-zoom-topp">
              <p id={tittelId} className="bilde-zoom-tittel">
                Forstørret bilde
              </p>
              <button type="button" className="knapp knapp-sekundaer" onClick={() => setZoom(false)}>
                Lukk
              </button>
            </div>
            <img className="bilde-zoom-img" src={src} alt={alt} />
            <p className="bilde-zoom-hjelp">Trykk utenfor bildet eller Escape for å lukke.</p>
          </div>
        </div>
      ) : null}
    </>
  )
}
