import { useSpill } from '../spill/SpillProvider'

export function EpisodeVelger() {
  const { innhold, fremdrift, startEpisode, person, aapneSlutt } = useSpill()
  const harSlutt = fremdrift.fullforteEpisoder.includes('e11')

  return (
    <section className="panel" id="oppgave-innhold" aria-labelledby="episode-liste-tittel" tabIndex={-1}>
      <h1 id="episode-liste-tittel">Episoder</h1>
      {person ? (
        <p className="ingress">
          Du er {person.fornavn} {person.etternavn}. Mål: {person.yrkesmal}.
        </p>
      ) : null}
      <p>Fullfør episodene i rekkefølge. Du kan spille en ferdig episode på nytt.</p>
      <div className="liste">
        {innhold.scenario.episoder.map((ep) => {
          const forrige = innhold.scenario.episoder.find((x) => x.nummer === ep.nummer - 1)
          const harFil = Boolean(ep.fil)
          const forrigeOk = !forrige || fremdrift.fullforteEpisoder.includes(forrige.id)
          const ulast = harFil && forrigeOk
          const ferdig = fremdrift.fullforteEpisoder.includes(ep.id)
          return (
            <button
              key={ep.id}
              type="button"
              className={`kort episodekort ${ulast ? '' : 'laast'}`}
              disabled={!ulast}
              onClick={() => startEpisode(ep.id)}
            >
              <span className="episodekort-tittel">
                {ep.nummer}. {ep.tittel}
              </span>
              <p>
                {ulast
                  ? ferdig
                    ? 'Fullført. Du kan spille på nytt.'
                    : 'Klar. Trykk for å starte.'
                  : harFil
                    ? 'Låst. Fullfør episoden over først.'
                    : 'Låst.'}
              </p>
            </button>
          )
        })}
      </div>
      {harSlutt ? (
        <div className="handlinger">
          <button type="button" className="knapp knapp-amber" onClick={aapneSlutt}>
            Se kursbeviset
          </button>
        </div>
      ) : null}
    </section>
  )
}
