import { KlikkbarTekst } from '../komponenter/KlikkbarTekst'
import { Lydspiller } from '../komponenter/Lydspiller'
import { OppgaveVisning } from '../komponenter/oppgaver/OppgaveVisning'
import { Ordkort } from '../komponenter/Ordkort'
import { SceneBilde } from '../komponenter/SceneBilde'
import { visValg } from '../spill/aktiviteter'
import { useSpill } from '../spill/SpillProvider'

export function ScenePanel() {
  const {
    scene,
    episode,
    person,
    fremdrift,
    valgtOrd,
    oppgaverFerdige,
    velgOrd,
    registrerOppgave,
    velgValg,
    sendMelding,
    lukkTilbakemelding,
    lagreSok,
    settValgteJobber,
    lagreAktiviteter,
    lagreSoknad,
    lagreReise,
    innhold,
  } = useSpill()

  if (!scene || !episode) return null
  const morsmal = fremdrift.morsmal ?? 'uk'

  return (
    <section className="panel" id="oppgave-innhold" aria-labelledby="scene-tittel" tabIndex={-1}>
      <p className="ingress">
        Episode {episode.nummer} · {scene.tittel}
      </p>
      <h1 id="scene-tittel">{episode.tittel}</h1>
      {fremdrift.valgTilbakemelding ? (
        <div className="tilbakemelding info" role="status">
          <p>{fremdrift.valgTilbakemelding}</p>
          <button type="button" className="knapp knapp-sekundaer" onClick={lukkTilbakemelding}>
            Lukk
          </button>
        </div>
      ) : null}
      {valgtOrd ? (
        <Ordkort ord={valgtOrd} morsmal={morsmal} onLukk={() => velgOrd(null)} />
      ) : null}
      <SceneBilde fil={scene.media.bilde} alt={scene.media.bildeAlt ?? scene.tittel} prioritet />
      <Lydspiller fil={scene.media.lyd} etikett="Lytt til teksten" />
      <KlikkbarTekst tekst={scene.tekst} onVelgOrd={velgOrd} />
      {scene.oppgaver.map((oppgave) => (
        <OppgaveVisning
          key={oppgave.id}
          oppgave={oppgave}
          person={person}
          ferdig={fremdrift.oppgaver.some((o) => o.oppgaveId === oppgave.id && o.riktig)}
          onSvar={(riktig) => registrerOppgave(oppgave.id, oppgave.type, riktig)}
          onSend={sendMelding}
          annonser={innhold.annonser}
          valgteJobber={fremdrift.valgteJobber}
          onLagreSok={lagreSok}
          onVelgJobber={settValgteJobber}
          onLagreAktiviteter={lagreAktiviteter}
          onLagreSoknad={lagreSoknad}
          ruter={innhold.ruter}
          onLagreReise={lagreReise}
        />
      ))}
      {!oppgaverFerdige && scene.oppgaver.length > 0 ? (
        <p className="skjema-hjelp">Gjør oppgaven ferdig. Da kan du gå videre.</p>
      ) : null}
      {oppgaverFerdige && scene.valg.some((valg) => visValg(valg, fremdrift.flagg)) ? (
        <div className="handlinger">
          {scene.valg.filter((valg) => visValg(valg, fremdrift.flagg)).map((valg) => (
            <button
              key={valg.id}
              type="button"
              className="knapp knapp-amber"
              onClick={() => velgValg(valg)}
            >
              {valg.tekst}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  )
}
