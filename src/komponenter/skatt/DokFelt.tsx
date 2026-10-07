import type { ReactNode } from 'react'

const FELT_NAVN: Record<string, string> = {
  arbeidsgiver: 'Arbeidsgiver',
  ansatt: 'Ansatt',
  periode: 'Periode og konto',
  timer: 'Timer og timelønn',
  overtid: 'Overtid',
  brutto: 'Brutto lønn',
  skattetrekk: 'Skattetrekk',
  fagforening: 'Fagforeningskontingent',
  netto: 'Netto utbetalt',
  feriepenger: 'Feriepenger',
  hittil: 'Hittil i år',
  trekktype: 'Trekktype',
  forventet: 'Forventet inntekt',
  fradrag: 'Fradrag',
  beregning: 'Skatteberegning',
  trekkprosent: 'Trekkprosent',
  kvittering: 'Kvittering',
}

interface Props {
  id: string
  klikkbar?: boolean
  valgtFelt?: string | null
  onFelt?: (id: string) => void
  children: ReactNode
}

export function DokFelt({ id, klikkbar, valgtFelt, onFelt, children }: Props) {
  const navn = FELT_NAVN[id] ?? id
  if (!klikkbar) return <div className="dok-felt">{children}</div>
  return (
    <button
      type="button"
      className={`dok-felt dok-klikk${valgtFelt === id ? ' valgt' : ''}`}
      aria-pressed={valgtFelt === id}
      aria-label={navn}
      onClick={() => onFelt?.(id)}
    >
      {children}
    </button>
  )
}
