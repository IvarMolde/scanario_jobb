import { useMemo, useState } from 'react'
import type { Person, SorterKategoriOppgave } from '../../modell/typer'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: SorterKategoriOppgave
  person: Person
  ferdig: boolean
  onSvar: (riktig: boolean) => void
}

export function SorterKategori({ oppgave, person, ferdig, onSvar }: Props) {
  const elementer = useMemo(
    () => oppgave.elementer.filter((e) => e.personId === person.id),
    [oppgave.elementer, person.id],
  )
  const fasit = useMemo(
    () => Object.fromEntries(elementer.map((e) => [e.id, e.kategori])),
    [elementer],
  )
  const [valgt, setValgt] = useState<string | null>(null)
  const [plassert, setPlassert] = useState<Record<string, string>>(ferdig ? fasit : {})
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)

  const plasser = (kategori: string) => {
    if (!valgt || status === 'ok') return
    const neste = { ...plassert, [valgt]: kategori }
    setPlassert(neste)
    setValgt(null)
    if (Object.keys(neste).length !== elementer.length) return
    const riktig = elementer.every((e) => neste[e.id] === e.kategori)
    setStatus(riktig ? 'ok' : 'feil')
    onSvar(riktig)
    if (!riktig) setPlassert({})
  }

  return (
    <div>
      <div className="brikker">
        {elementer.map((e) => (
          <button
            key={e.id}
            type="button"
            className="brikke"
            aria-pressed={valgt === e.id}
            disabled={status === 'ok' || Boolean(plassert[e.id])}
            onClick={() => setValgt(e.id)}
          >
            {e.tekst}
          </button>
        ))}
      </div>
      <div className="kategori-rutenett">
        {oppgave.kategorier.map((kat) => (
          <button
            key={kat.id}
            type="button"
            className="kategori-boks"
            disabled={status === 'ok' || !valgt}
            onClick={() => plasser(kat.id)}
          >
            <strong>{kat.tittel}</strong>
            <ul>
              {elementer
                .filter((e) => plassert[e.id] === kat.id)
                .map((e) => (
                  <li key={e.id}>{e.tekst}</li>
                ))}
            </ul>
          </button>
        ))}
      </div>
      <TilbakemeldingBoks
        status={status}
        riktig={oppgave.tilbakemeldingRiktig}
        feil={oppgave.tilbakemeldingFeil}
      />
    </div>
  )
}
