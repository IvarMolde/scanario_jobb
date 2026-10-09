import type { Aktivitet, Annonse, Oppgave, Person, Ruter } from '../../modell/typer'
import { matchAnnonseId } from '../../spill/aktiviteter'
import type { LagretReise } from '../../spill/reise'
import type { LagretSok } from '../../spill/tilstand'
import { Lydspiller } from '../Lydspiller'
import { ByggMelding } from './ByggMelding'
import { ByggSoknad } from './ByggSoknad'
import { CvValg } from './CvValg'
import { EgenskapKobling } from './EgenskapKobling'
import { FinnOgRett } from './FinnOgRett'
import { Flervalg } from './Flervalg'
import { IntervjuSvar } from './IntervjuSvar'
import { Matching } from './Matching'
import { MatchSjekkliste } from './MatchSjekkliste'
import { Ordbank } from './Ordbank'
import { PortalSok } from './PortalSok'
import { RegistrerAktiviteter } from './RegistrerAktiviteter'
import { Reiseplan } from './Reiseplan'
import { SantUsant } from './SantUsant'
import { SorterKategori } from './SorterKategori'
import { SorterSetning } from './SorterSetning'
import { VelgJobber } from './VelgJobber'
import { FyllTall } from './FyllTall'
import { FinnIDokument } from './FinnIDokument'
import { oppgaveHjelp, visEgenInstruksjon } from '../../spill/oppgavehjelp'

interface Props {
  oppgave: Oppgave
  nummer: number
  person: Person | null
  ferdig: boolean
  annonser: Annonse[]
  valgteJobber: string[]
  onSvar: (riktig: boolean) => void
  onSend: (
    tekst: string,
    nesteSceneId: string,
    flagg: string[],
    ekstra?: { kanal?: 'sms' | 'epost'; emne?: string },
  ) => void
  onLagreSok: (sok: LagretSok, flagg: string[]) => void
  onVelgJobber: (ids: string[], flagg: string[]) => void
  onLagreAktiviteter: (aktiviteter: Aktivitet[], flagg: string[]) => void
  onLagreSoknad: (tekst: string, annonseId: string | null, flagg: string[]) => void
  ruter: Ruter
  onLagreReise: (reise: LagretReise, flagg: string[]) => void
}

export function OppgaveVisning({
  oppgave,
  nummer,
  person,
  ferdig,
  annonser,
  valgteJobber,
  onSvar,
  onSend,
  onLagreSok,
  onVelgJobber,
  onLagreAktiviteter,
  onLagreSoknad,
  ruter,
  onLagreReise,
}: Props) {
  const matchId = person
    ? oppgave.type === 'match_sjekkliste'
      ? matchAnnonseId(valgteJobber, person.id, oppgave.annonseId, oppgave.fallbackPerPerson)
      : oppgave.type === 'bygg_soknad'
        ? matchAnnonseId(valgteJobber, person.id, undefined, undefined)
        : undefined
    : undefined

  const portalFullfort = oppgave.type === 'portal_sok' && ferdig

  return (
    <section
      className={['oppgave', portalFullfort ? 'oppgave-fullfort' : ''].filter(Boolean).join(' ')}
      aria-labelledby={`oppgave-${oppgave.id}`}
    >
      <div className={`oppgave-hode${portalFullfort ? ' oppgave-hode-ok' : ''}`}>
        <h3 id={`oppgave-${oppgave.id}`}>
          Oppgave {nummer}
          {portalFullfort ? <span className="oppgave-ok-merke"> Fullført</span> : null}
        </h3>
        <p className="oppgave-hjelp">{oppgaveHjelp(oppgave.type)}</p>
        {visEgenInstruksjon(oppgave.instruksjon, oppgave.type) ? (
          <p className="oppgave-instruksjon">{oppgave.instruksjon}</p>
        ) : null}
      </div>
      <Lydspiller
        fil={oppgave.instruksjonLyd}
        etikett={oppgave.type === 'lytt_og_velg' ? 'Lytt' : 'Instruksjon'}
      />
      {oppgave.type === 'flervalg' || oppgave.type === 'lytt_og_velg' ? (
        <Flervalg oppgave={oppgave} ferdig={ferdig} onSvar={onSvar} />
      ) : null}
      {oppgave.type === 'sant_usant' ? (
        <SantUsant oppgave={oppgave} ferdig={ferdig} onSvar={onSvar} />
      ) : null}
      {oppgave.type === 'ordbank' ? (
        <Ordbank oppgave={oppgave} ferdig={ferdig} onSvar={onSvar} />
      ) : null}
      {oppgave.type === 'sorter_setning' ? (
        <SorterSetning oppgave={oppgave} ferdig={ferdig} onSvar={onSvar} />
      ) : null}
      {oppgave.type === 'matching' ? (
        <Matching oppgave={oppgave} ferdig={ferdig} onSvar={onSvar} />
      ) : null}
      {oppgave.type === 'finn_og_rett' ? (
        <FinnOgRett oppgave={oppgave} ferdig={ferdig} onSvar={onSvar} />
      ) : null}
      {oppgave.type === 'bygg_melding' ? (
        <ByggMelding
          oppgave={oppgave}
          person={person}
          ferdig={ferdig}
          onSvar={onSvar}
          onSend={onSend}
        />
      ) : null}
      {oppgave.type === 'sorter_kategori' && person ? (
        <SorterKategori oppgave={oppgave} person={person} ferdig={ferdig} onSvar={onSvar} />
      ) : null}
      {oppgave.type === 'egenskap_kobling' && person ? (
        <EgenskapKobling oppgave={oppgave} person={person} ferdig={ferdig} onSvar={onSvar} />
      ) : null}
      {oppgave.type === 'cv_valg' && person ? (
        <CvValg oppgave={oppgave} person={person} ferdig={ferdig} onSvar={onSvar} />
      ) : null}
      {oppgave.type === 'portal_sok' && person ? (
        <PortalSok
          oppgave={oppgave}
          person={person}
          ferdig={ferdig}
          annonser={annonser}
          onSvar={onSvar}
          onLagreSok={onLagreSok}
        />
      ) : null}
      {oppgave.type === 'match_sjekkliste' && person ? (
        <MatchSjekkliste
          oppgave={oppgave}
          person={person}
          annonse={annonser.find((a) => a.id === matchId)}
          ferdig={ferdig}
          onSvar={onSvar}
        />
      ) : null}
      {oppgave.type === 'velg_jobber' && person ? (
        <VelgJobber
          oppgave={oppgave}
          person={person}
          annonser={annonser}
          ferdig={ferdig}
          valgteJobber={valgteJobber}
          onSvar={onSvar}
          onVelgJobber={onVelgJobber}
        />
      ) : null}
      {oppgave.type === 'registrer_aktiviteter' && person ? (
        <RegistrerAktiviteter
          oppgave={oppgave}
          person={person}
          annonser={annonser}
          valgteJobber={valgteJobber}
          ferdig={ferdig}
          onSvar={onSvar}
          onLagre={onLagreAktiviteter}
        />
      ) : null}
      {oppgave.type === 'bygg_soknad' && person ? (
        <ByggSoknad
          oppgave={oppgave}
          person={person}
          ferdig={ferdig}
          annonseId={matchId ?? null}
          onSvar={onSvar}
          onLagre={onLagreSoknad}
        />
      ) : null}
      {oppgave.type === 'intervju_svar' && person ? (
        <IntervjuSvar oppgave={oppgave} person={person} ferdig={ferdig} onSvar={onSvar} />
      ) : null}
      {oppgave.type === 'reiseplan' && person ? (
        <Reiseplan
          oppgave={oppgave}
          person={person}
          ruter={ruter}
          ferdig={ferdig}
          onSvar={onSvar}
          onLagreReise={onLagreReise}
        />
      ) : null}
      {oppgave.type === 'fyll_tall' && person ? (
        <FyllTall oppgave={oppgave} personId={person.id} ferdig={ferdig} onSvar={onSvar} />
      ) : null}
      {oppgave.type === 'finn_i_dokument' ? (
        <FinnIDokument oppgave={oppgave} ferdig={ferdig} onSvar={onSvar} />
      ) : null}
    </section>
  )
}
