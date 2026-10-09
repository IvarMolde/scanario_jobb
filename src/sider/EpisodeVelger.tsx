import { useSpill } from '../spill/SpillProvider'

export function EpisodeVelger() {
  const { innhold, fremdrift, startEpisode, person, aapneSlutt, velgSpillModus } = useSpill()
  const harSlutt = fremdrift.fullforteEpisoder.includes('e11')
  const valgfri = fremdrift.spillModus === 'valgfri'

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

      <div className="modus-bytte" role="group" aria-label="Spillmodus">
        <button
          type="button"
          className={`modus-bytte-knapp${!valgfri ? ' er-valgt' : ''}`}
          aria-pressed={!valgfri}
          onClick={() => velgSpillModus('scenario')}
        >
          Fast scenario
        </button>
        <button
          type="button"
          className={`modus-bytte-knapp${valgfri ? ' er-valgt' : ''}`}
          aria-pressed={valgfri}
          onClick={() => velgSpillModus('valgfri')}
        >
          Valgfri scenario
        </button>
      </div>

      <p>
        {valgfri
          ? 'Valgfri modus: Du kan åpne hvilken episode du vil.'
          : 'Fast scenario: Fullfør episodene i rekkefølge. Du kan spille en ferdig episode på nytt.'}
      </p>

      <div className="liste">
        {innhold.scenario.episoder.map((ep) => {
          const forrige = innhold.scenario.episoder.find((x) => x.nummer === ep.nummer - 1)
          const harFil = Boolean(ep.fil)
          const forrigeOk = !forrige || fremdrift.fullforteEpisoder.includes(forrige.id)
          const ferdig = fremdrift.fullforteEpisoder.includes(ep.id)
          const ulast = harFil && (valgfri || forrigeOk)
          const erNeste = !valgfri && ep.id === nesteId
          const statusKlasse = ferdig ? 'fullfort' : erNeste ? 'neste' : ulast ? 'aapen' : 'laast'

          return (
            <button
              key={ep.id}
              type="button"
              className={`kort episodekort episodekort--${statusKlasse}`}
              disabled={!ulast}
              onClick={() => startEpisode(ep.id)}
            >
              <span className="episodekort-topp">
                <span className="episodekort-nummer" aria-hidden="true">
                  {ep.nummer}
                </span>
                <span className="episodekort-tittel">{ep.tittel}</span>
                {ferdig ? (
                  <span className="episodekort-merke episodekort-merke--fullfort">Fullført</span>
                ) : null}
                {erNeste ? (
                  <span className="episodekort-merke episodekort-merke--neste">Neste episode</span>
                ) : null}
                {valgfri && ulast && !ferdig ? (
                  <span className="episodekort-merke episodekort-merke--aapen">Åpen</span>
                ) : null}
              </span>
              <p className="episodekort-tekst">
                {ferdig
                  ? 'Du kan spille på nytt.'
                  : erNeste
                    ? 'Trykk for å fortsette her.'
                    : ulast
                      ? 'Trykk for å starte denne episoden.'
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
