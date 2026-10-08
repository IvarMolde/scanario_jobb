import { useState } from 'react'
import { z } from 'zod'
import type { CvReferanse } from '../spill/tilstand'

const feltSkjema = z.object({
  fornavn: z.string().trim().min(1, 'Skriv fornavn.'),
  etternavn: z.string().trim().min(1, 'Skriv etternavn.'),
  rolle: z.string().trim().min(1, 'Skriv rolle, for eksempel leder eller kollega.'),
  telefon: z
    .string()
    .trim()
    .min(8, 'Skriv et telefonnummer.')
    .regex(/^[\d\s+()-]{8,20}$/, 'Bruk tall i telefonnummeret.'),
})

interface Props {
  startverdi?: CvReferanse | null
  onAvbryt: () => void
  onLagre: (referanse: CvReferanse) => void
}

export function ReferanseSkjema({ startverdi = null, onAvbryt, onLagre }: Props) {
  const [fornavn, setFornavn] = useState(startverdi?.fornavn ?? '')
  const [etternavn, setEtternavn] = useState(startverdi?.etternavn ?? '')
  const [rolle, setRolle] = useState(startverdi?.rolle ?? '')
  const [telefon, setTelefon] = useState(startverdi?.telefon ?? '')
  const [feil, setFeil] = useState<string | null>(null)

  const lagre = () => {
    const resultat = feltSkjema.safeParse({ fornavn, etternavn, rolle, telefon })
    if (!resultat.success) {
      setFeil(resultat.error.issues[0]?.message ?? 'Fyll inn alle feltene.')
      return
    }
    setFeil(null)
    onLagre(resultat.data)
  }

  return (
    <form
      className="referanse-skjema"
      onSubmit={(e) => {
        e.preventDefault()
        lagre()
      }}
    >
      <h2 className="referanse-skjema-tittel">Legg inn referanse</h2>
      <p className="referanse-skjema-ingress">
        Skriv navn, rolle og telefonnummer. Det du skriver, vises i CVen på telefonen.
      </p>

      <label className="referanse-felt">
        <span>Fornavn</span>
        <input
          type="text"
          autoComplete="given-name"
          value={fornavn}
          onChange={(e) => setFornavn(e.target.value)}
        />
      </label>

      <label className="referanse-felt">
        <span>Etternavn</span>
        <input
          type="text"
          autoComplete="family-name"
          value={etternavn}
          onChange={(e) => setEtternavn(e.target.value)}
        />
      </label>

      <label className="referanse-felt">
        <span>Rolle</span>
        <input
          type="text"
          placeholder="For eksempel tidligere leder"
          value={rolle}
          onChange={(e) => setRolle(e.target.value)}
        />
      </label>

      <label className="referanse-felt">
        <span>Telefonnummer</span>
        <input
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="For eksempel 900 00 000"
          value={telefon}
          onChange={(e) => setTelefon(e.target.value)}
        />
      </label>

      {feil ? (
        <p className="tilbakemelding feil" role="alert">
          {feil}
        </p>
      ) : null}

      <div className="referanse-skjema-handlinger">
        <button type="button" className="knapp knapp-sekundaer" onClick={onAvbryt}>
          Avbryt
        </button>
        <button type="submit" className="knapp knapp-amber">
          Lagre i CV
        </button>
      </div>
    </form>
  )
}
