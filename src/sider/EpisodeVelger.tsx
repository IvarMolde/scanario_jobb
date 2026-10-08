import { useSpill } from '../spill/SpillProvider'

export function EpisodeVelger() {
  const { innhold, fremdrift, startEpisode, person, aapneSlutt } = useSpill()
  const harSlutt = fremdrift.fullforteEpisoder.includes('e11')

  const nesteId =
    innhold.scenario.episoder.find((ep) => {
      const forrige = innhold.scenario.episoder.find((x) => x.nummer === ep.nummer - 1)
      const harFil = Boolean(ep.fil)
      const forrigeOk = !forrige || fremdrift.fullforteEpisoder.includes(forrige.id)
      const ferdig = fremdrift.fullforteEpisoder.includes(ep.id)
      return harFil && forrigeOk && !ferdig
    })?.id ?? null

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
          const erNeste = ep.id === nesteId
          const statusKlasse = ferdig ? 'fullfort' : erNeste ? 'neste' : 'laast'

          return (
            <button
              key={ep.id}
              type="button"
              className={`kort episodekort episodekort--${statusKlasse}`}
              disabled={!ulast}
              onClick={() => startEpisode(ep.id)}
            >
              <span className="episodekort-topp">
                <span className="episodekort-ikon" aria-hidden="true">
                  {ferdig ? '🔓' : '🔒'}
                </span>
                <span className="episodekort-tittel">
                  {ep.nummer}. {ep.tittel}
                </span>
                {ferdig ? <span className="episodekort-merke episodekort-merke--fullfort">Fullført</span> : null}
                {erNeste ? <span className="episodekort-merke episodekort-merke--neste">Neste episode</span> : null}
              </span>
              <p className="episodekort-tekst">
                {ferdig
                  ? 'Du kan spille på nytt.'
                  : erNeste
                    ? 'Trykk for å fortsette her.'
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
