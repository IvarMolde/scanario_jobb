import { useEffect, useRef, useState } from 'react'
import { lydUrl } from '../modell/media'

interface Props {
  fil?: string
  etikett: string
}

export function Lydspiller({ fil, etikett }: Props) {
  const ref = useRef<HTMLAudioElement>(null)
  const [aktivFil, setAktivFil] = useState(fil)
  const [harKilde, setHarKilde] = useState(false)
  const [spiller, setSpiller] = useState(false)
  const [laster, setLaster] = useState(false)
  const [hastighet, setHastighet] = useState<0.75 | 1>(1)
  const [feil, setFeil] = useState(false)

  if (fil !== aktivFil) {
    setAktivFil(fil)
    setHarKilde(false)
    setSpiller(false)
    setLaster(false)
    setFeil(false)
  }

  useEffect(() => {
    const el = ref.current
    if (el) el.playbackRate = hastighet
  }, [hastighet, harKilde])

  if (!fil) return null

  const spillEllerPause = () => {
    const el = ref.current
    if (!el) return
    if (!harKilde) {
      el.src = lydUrl(fil)
      el.preload = 'auto'
      setHarKilde(true)
      setLaster(true)
      setFeil(false)
      el.load()
      const start = () => {
        el.playbackRate = hastighet
        void el.play()
      }
      el.addEventListener('canplay', start, { once: true })
      return
    }
    if (el.paused) void el.play()
    else el.pause()
  }

  return (
    <div className="lydspiller" role="group" aria-label={etikett}>
      <audio
        ref={ref}
        preload="none"
        onLoadedData={() => setLaster(false)}
        onCanPlay={() => setLaster(false)}
        onError={() => {
          setLaster(false)
          setFeil(true)
        }}
        onEnded={() => setSpiller(false)}
        onPause={() => setSpiller(false)}
        onPlay={() => {
          setLaster(false)
          setSpiller(true)
        }}
      />
      <button
        type="button"
        className="knapp"
        aria-label={`${spiller ? 'Pause' : 'Spill av'}: ${etikett}`}
        aria-busy={laster}
        onClick={spillEllerPause}
      >
        {laster ? 'Laster …' : spiller ? 'Pause' : 'Spill av'}
      </button>
      <button
        type="button"
        className="knapp knapp-sekundaer"
        aria-label="Spol fem sekunder tilbake"
        disabled={!harKilde}
        onClick={() => {
          const el = ref.current
          if (!el) return
          el.currentTime = Math.max(0, el.currentTime - 5)
        }}
      >
        −5 s
      </button>
      <button
        type="button"
        className="knapp knapp-sekundaer"
        aria-label="Langsom hastighet, 0,75"
        aria-pressed={hastighet === 0.75}
        onClick={() => setHastighet(0.75)}
      >
        0,75×
      </button>
      <button
        type="button"
        className="knapp knapp-sekundaer"
        aria-label="Normal hastighet"
        aria-pressed={hastighet === 1}
        onClick={() => setHastighet(1)}
      >
        1×
      </button>
      {feil ? (
        <p className="tilbakemelding feil" role="status">
          Lydfila kunne ikke spilles. Be læreren sjekke fila.
        </p>
      ) : null}
    </div>
  )
}
