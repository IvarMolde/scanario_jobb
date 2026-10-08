interface Props {
  dag: string
  klokkeslett: string
}

export function Statuslinje({ dag, klokkeslett }: Props) {
  return (
    <header className="statuslinje" aria-label="Tid i spillet">
      <span className="statuslinje-tid">{klokkeslett}</span>
      <span className="statuslinje-dag">{dag}</span>
      <span className="statuslinje-ikoner" aria-hidden="true">
        <span className="status-signal" />
        <span className="status-wifi" />
        <span className="status-batteri" />
      </span>
    </header>
  )
}
