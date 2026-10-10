import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { bildeUrl } from '../modell/media'

interface Props {
  fil?: string
  alt: string
  klasseNavn?: string
  prioritet?: boolean
  kanZoom?: boolean
  /** 'telefon' = forstørr over hele telefonskjermen; 'side' = full skjerm overlay */
  zoomModus?: 'side' | 'telefon'
}

function ZoomIkon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="M15.5 15.5 21 21" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10.5 7.5v6M7.5 10.5h6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function SceneBilde({
  fil,
  alt,
  klasseNavn = 'scene-bilde',
  prioritet = false,
  kanZoom = false,
  zoomModus = 'side',
}: Props) {
  const [feil, setFeil] = useState(false)
  const [zoom, setZoom] = useState(false)
  const [telefonRot, setTelefonRot] = useState<HTMLElement | null>(null)
  const tittelId = useId()
  const telefonZoom = kanZoom && zoomModus === 'telefon'

  useEffect(() => {
    if (!telefonZoom) return
    setTelefonRot(document.querySelector('.telefon-skjerm') as HTMLElement | null)
  }, [telefonZoom])

  useEffect(() => {
    if (!zoom) return
    const forrige = document.body.style.overflow
    if (!telefonZoom) document.body.style.overflow = 'hidden'
    const onTaste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoom(false)
    }
    window.addEventListener('keydown', onTaste)
    return () => {
      if (!telefonZoom) document.body.style.overflow = forrige
      window.removeEventListener('keydown', onTaste)
    }
  }, [zoom, telefonZoom])

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

  const overlay = zoom ? (
    <div
      className={telefonZoom ? 'bilde-zoom-overlay bilde-zoom-overlay--telefon' : 'bilde-zoom-overlay'}
      role="dialog"
      aria-modal="true"
      aria-labelledby={tittelId}
      onClick={() => setZoom(false)}
    >
      <div
        className={telefonZoom ? 'bilde-zoom-ramme bilde-zoom-ramme--telefon' : 'bilde-zoom-ramme'}
        role="presentation"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bilde-zoom-topp">
          <p id={tittelId} className="bilde-zoom-tittel">
            {telefonZoom ? alt : 'Forstørret bilde'}
          </p>
          <button type="button" className="knapp knapp-sekundaer" onClick={() => setZoom(false)}>
            Lukk
          </button>
        </div>
        <div className={telefonZoom ? 'bilde-zoom-visning bilde-zoom-visning--telefon' : 'bilde-zoom-visning'}>
          <img className="bilde-zoom-img" src={src} alt={alt} decoding="sync" />
        </div>
        <p className="bilde-zoom-hjelp">
          {telefonZoom ? 'Pinch eller scroll for å se hele annonsen. Trykk Lukk eller Escape.' : 'Trykk utenfor bildet eller Escape for å lukke.'}
        </p>
      </div>
    </div>
  ) : null

  return (
    <>
      {kanZoom ? (
        <button
          type="button"
          className={`scene-bilde-knapp kan-zoom${telefonZoom ? ' kan-zoom--telefon' : ''}`}
          onClick={() => setZoom(true)}
          aria-label={`${alt}. Zoom for å lese bedre.`}
        >
          {bilde}
          <span className={telefonZoom ? 'scene-bilde-zoomhint scene-bilde-zoomhint--telefon' : 'scene-bilde-zoomhint'}>
            <ZoomIkon />
            Zoom
          </span>
        </button>
      ) : (
        bilde
      )}

      {telefonZoom && telefonRot ? createPortal(overlay, telefonRot) : overlay}
    </>
  )
}
