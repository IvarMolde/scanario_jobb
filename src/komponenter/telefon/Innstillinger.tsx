import { MORSMAL_ETIKETTER, type Morsmal } from '../../modell/typer'
import type { Person } from '../../modell/typer'

interface Props {
  person: Person | null
  morsmal: Morsmal | null
  onMorsmal: (morsmal: Morsmal) => void
  onNullstill: () => void
  onTilbake: () => void
}

export function Innstillinger({ person, morsmal, onMorsmal, onNullstill, onTilbake }: Props) {
  return (
    <div>
      <header className="hjem-hode">
        <h1>Innstillinger</h1>
        <p>Velg morsmål for ordkort. Du kan starte på nytt.</p>
      </header>
      {person ? (
        <p>
          Du spiller som <strong>{person.fornavn} {person.etternavn}</strong>.
          Fødselsnummer: {person.fodselsnummer}.
        </p>
      ) : null}
      <h2 id="velg-morsmal-innstillinger">Morsmål</h2>
      <div className="morsmal-valg" role="group" aria-labelledby="velg-morsmal-innstillinger">
        {(Object.keys(MORSMAL_ETIKETTER) as Morsmal[]).map((kode) => (
          <button
            key={kode}
            type="button"
            className="knapp knapp-sekundaer"
            aria-pressed={morsmal === kode}
            lang={kode === 'uk' ? 'uk' : kode}
            dir={kode === 'ar' ? 'rtl' : 'ltr'}
            onClick={() => onMorsmal(kode)}
          >
            {MORSMAL_ETIKETTER[kode]}
          </button>
        ))}
      </div>
      <div className="handlinger">
        <button type="button" className="knapp knapp-sekundaer" onClick={onTilbake}>
          Tilbake
        </button>
        <button type="button" className="knapp" onClick={onNullstill}>
          Start på nytt
        </button>
      </div>
    </div>
  )
}
