import { useSpill } from '../spill/SpillProvider'

function tilbakeEtikett(visning: string, harSceneHistorikk: boolean): string {
  if ((visning === 'scene' || visning === 'oppsummering') && harSceneHistorikk) {
    return 'Tilbake'
  }
  if (visning === 'scene' || visning === 'oppsummering' || visning === 'slutt') {
    return 'Til episoder'
  }
  return 'Til start'
}

export function SpillMeny() {
  const { fremdrift, tilbake, tilStart, kanGaTilbake } = useSpill()
  if (fremdrift.visning === 'start') return null

  const harSceneHistorikk = fremdrift.sceneHistorikk.length > 0
  const visTilStart =
    fremdrift.visning !== 'episoder' && fremdrift.visning !== 'innstillinger'

  return (
    <nav className="spill-nav" aria-label="Navigasjon">
      {kanGaTilbake ? (
        <button type="button" className="knapp knapp-sekundaer" onClick={tilbake}>
          ← {tilbakeEtikett(fremdrift.visning, harSceneHistorikk)}
        </button>
      ) : null}
      {visTilStart ? (
        <button type="button" className="knapp knapp-sekundaer" onClick={tilStart}>
          Til start
        </button>
      ) : null}
    </nav>
  )
}
