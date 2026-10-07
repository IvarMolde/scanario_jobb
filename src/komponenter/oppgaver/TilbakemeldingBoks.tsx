interface Props {
  status: 'ok' | 'feil' | null
  riktig: string
  feil: string
}

export function TilbakemeldingBoks({ status, riktig, feil }: Props) {
  if (!status) return null
  return (
    <div className={`tilbakemelding ${status}`} role="status">
      {status === 'ok' ? riktig : feil}
    </div>
  )
}
