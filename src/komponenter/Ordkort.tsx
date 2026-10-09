import type { Morsmal, Ord } from '../modell/typer'
import { MORSMAL_ETIKETTER } from '../modell/typer'
import { SceneBilde } from './SceneBilde'

interface Props {
  ord: Ord
  morsmal: Morsmal
  onLukk: () => void
}

export function Ordkort({ ord, morsmal, onLukk }: Props) {
  const oversettelse = ord.oversettelser[morsmal]
  const rtl = morsmal === 'ar'
  const lang = morsmal === 'uk' ? 'uk' : morsmal === 'en' ? 'en' : 'ar'

  return (
    <aside className="ordkort" aria-label={`Ordkort for ${ord.ord}`}>
      <h2>{ord.ord}</h2>
      <p>{ord.forklaring}</p>
      {ord.bilde ? <SceneBilde fil={ord.bilde} alt="" klasseNavn="scene-bilde" /> : null}
      <p className="ordkort-sprak-etikett">{MORSMAL_ETIKETTER[morsmal]}</p>
      <p className="ordkort-oversettelse" lang={lang} dir={rtl ? 'rtl' : 'ltr'}>
        {oversettelse}
      </p>
      <button type="button" className="knapp knapp-sekundaer" onClick={onLukk}>
        Lukk ordkort
      </button>
    </aside>
  )
}
