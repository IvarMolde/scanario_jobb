import { useState } from 'react'
import type { ByggMeldingOppgave, Person } from '../../modell/typer'
import { fyllNavn } from '../../utils/tekst'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: ByggMeldingOppgave
  person: Person | null
  ferdig: boolean
  onSvar: (riktig: boolean) => void
  onSend: (
    tekst: string,
    nesteSceneId: string,
    flagg: string[],
    ekstra?: { kanal?: 'sms' | 'epost'; emne?: string },
  ) => void
}

export function ByggMelding({ oppgave, person, ferdig, onSvar, onSend }: Props) {
  const [hilsen, setHilsen] = useState<string | null>(null)
  const [innhold, setInnhold] = useState<string | null>(null)
  const [avslutning, setAvslutning] = useState<string | null>(null)
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)

  const hilsenDel = oppgave.hilsen.find((d) => d.id === hilsen)
  const innholdDel = oppgave.innhold.find((d) => d.id === innhold)
  const avslutningDel = oppgave.avslutning.find((d) => d.id === avslutning)
  const komplett = Boolean(hilsenDel && innholdDel && avslutningDel)
  const hoflig = Boolean(hilsenDel?.hoflig && innholdDel?.hoflig && avslutningDel?.hoflig)

  const tekst = [hilsenDel?.tekst, innholdDel?.tekst, avslutningDel?.tekst]
    .filter(Boolean)
    .join(' ')
  const ferdigTekst = fyllNavn(tekst, person)

  const sjekk = () => {
    if (!komplett) return
    setStatus(hoflig ? 'ok' : 'feil')
    onSvar(hoflig)
  }

  return (
    <div>
      <fieldset className="oppgave">
        <legend>Hilsen</legend>
        <div className="valggruppe">
          {oppgave.hilsen.map((del) => (
            <button
              key={del.id}
              type="button"
              className="knapp knapp-sekundaer"
              aria-pressed={hilsen === del.id}
              onClick={() => {
                setHilsen(del.id)
                setStatus(null)
              }}
            >
              {del.tekst}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="oppgave">
        <legend>Innhold</legend>
        <div className="valggruppe">
          {oppgave.innhold.map((del) => (
            <button
              key={del.id}
              type="button"
              className="knapp knapp-sekundaer"
              aria-pressed={innhold === del.id}
              onClick={() => {
                setInnhold(del.id)
                setStatus(null)
              }}
            >
              {del.tekst}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="oppgave">
        <legend>Avslutning</legend>
        <div className="valggruppe">
          {oppgave.avslutning.map((del) => (
            <button
              key={del.id}
              type="button"
              className="knapp knapp-sekundaer"
              aria-pressed={avslutning === del.id}
              onClick={() => {
                setAvslutning(del.id)
                setStatus(null)
              }}
            >
              {fyllNavn(del.tekst, person)}
            </button>
          ))}
        </div>
      </fieldset>
      {komplett ? (
        <p className="kort">
          <strong>Meldingen:</strong> {ferdigTekst}
        </p>
      ) : null}
      <div className="handlinger">
        <button type="button" className="knapp" disabled={!komplett} onClick={sjekk}>
          Sjekk meldingen
        </button>
        {status === 'ok' ? (
          <button
            type="button"
            className="knapp knapp-amber"
            onClick={() =>
              onSend(ferdigTekst, oppgave.nesteHoflig, oppgave.flaggHoflig, {
                kanal: oppgave.kanal,
                emne: oppgave.emne,
              })
            }
          >
            Send meldingen
          </button>
        ) : null}
        {status === 'feil' ? (
          <>
            <button
              type="button"
              className="knapp knapp-sekundaer"
              onClick={() => {
                setHilsen(null)
                setInnhold(null)
                setAvslutning(null)
                setStatus(null)
              }}
            >
              Prøv igjen
            </button>
            <button
              type="button"
              className="knapp knapp-amber"
              onClick={() =>
                onSend(ferdigTekst, oppgave.nesteUhoflig, oppgave.flaggUhoflig, {
                  kanal: oppgave.kanal,
                  emne: oppgave.emne,
                })
              }
            >
              Send likevel
            </button>
          </>
        ) : null}
      </div>
      <TilbakemeldingBoks
        status={status}
        riktig={oppgave.tilbakemeldingRiktig}
        feil={oppgave.tilbakemeldingFeil}
      />
    </div>
  )
}
