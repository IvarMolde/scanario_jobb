import { useSpill } from '../spill/SpillProvider'

export function SpillMeny() {
  const { fremdrift, tilbakeTilEpisoder, tilStart } = useSpill()
  if (fremdrift.visning === 'start') return null
  const iOppgave =
    fremdrift.visning === 'scene' ||
    fremdrift.visning === 'oppsummering' ||
    fremdrift.visning === 'slutt'

  return (
    <div className="spill-nav">
      {iOppgave ? (
        <button type="button" className="knapp knapp-sekundaer" onClick={tilbakeTilEpisoder}>
          Tilbake til episoder
        </button>
      ) : null}
      <button type="button" className="knapp knapp-sekundaer" onClick={tilStart}>
        Til start
      </button>
    </div>
  )
}
