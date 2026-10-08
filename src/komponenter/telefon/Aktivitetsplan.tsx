import { AKTIVITET_STATUS_NAVN, type Aktivitet, type AktivitetStatus } from '../../modell/typer'

const KOLONNER: AktivitetStatus[] = ['skal_soke', 'sendt_soknad', 'innkalt', 'avslag']

interface Props {
  aktiviteter: Aktivitet[]
  soknadTekst: string | null
}

export function Aktivitetsplan({ aktiviteter, soknadTekst }: Props) {
  return (
    <div>
      <header className="hjem-hode">
        <h1>Aktivitetsplan</h1>
        <p>Dine aktiviteter.</p>
      </header>
      <p className="plan-maal">Mål: Registrer jobbene. Følg status og frist.</p>
      {aktiviteter.length === 0 ? (
        <p className="tom-tilstand">Ingen aktiviteter ennå. Registrer jobbene i oppgaven.</p>
      ) : (
        <div className="plan-brett">
          {KOLONNER.map((status) => {
            const kort = aktiviteter.filter((a) => a.status === status)
            return (
              <section className="plan-kolonne" key={status} aria-label={AKTIVITET_STATUS_NAVN[status]}>
                <h2>{AKTIVITET_STATUS_NAVN[status]}</h2>
                {kort.length === 0 ? <p className="plan-tom">Ingen kort</p> : null}
                {kort.map((a) => (
                  <article className={`plan-kort status-${status}`} key={a.id}>
                    <h3>{a.tittel}</h3>
                    <p>{a.bedrift}</p>
                    <p>
                      Frist: <strong>{a.frist}</strong>
                    </p>
                  </article>
                ))}
              </section>
            )
          })}
        </div>
      )}
      {soknadTekst ? (
        <article className="kort">
          <h2>Lagret søknad</h2>
          <p>{soknadTekst}</p>
        </article>
      ) : null}
    </div>
  )
}
