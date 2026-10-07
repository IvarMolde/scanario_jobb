interface Props {
  dag: string
  klokkeslett: string
}

export function Statuslinje({ dag, klokkeslett }: Props) {
  return (
    <header className="statuslinje" aria-label="Tid i spillet">
      <span className="statuslinje-tid">
        {dag} {klokkeslett}
      </span>
      <span className="statuslinje-ikoner" aria-hidden="true">
        ▬▬ ▥
      </span>
    </header>
  )
}
