import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { hentEpisode, hentOrd, hentPerson, hentScene, lastInnhold, type Innhold } from '../innhold/lastInnhold'
import type { Aktivitet, AppId, Episode, Morsmal, Ord, Person, Scene, Valg } from '../modell/typer'
import { OPPSUMMERING_ID, SLUTT_ID } from '../modell/typer'
import type { LagretReise } from './reise'
import type { LagretSkattekort } from './skatt'
import { lagre, lastLagring, slettLagring } from './lagring'
import {
  parseFremdrift,
  reduser,
  sceneOppgaverFerdige,
  tomFremdrift,
  type Fremdrift,
  type LagretSok,
} from './tilstand'

interface SpillApi {
  innhold: Innhold
  fremdrift: Fremdrift
  person: Person | null
  episode: Episode | null
  scene: Scene | null
  valgtOrd: Ord | null
  oppgaverFerdige: boolean
  velgPerson: (id: string) => void
  velgMorsmal: (morsmal: Morsmal) => void
  startSpill: () => void
  startEpisode: (id: string) => void
  aapneApp: (app: AppId) => void
  registrerOppgave: (oppgaveId: string, oppgaveType: string, riktig: boolean) => void
  velgValg: (valg: Valg) => void
  sendMelding: (
    tekst: string,
    nesteSceneId: string,
    flagg: string[],
    ekstra?: { kanal?: 'sms' | 'epost'; emne?: string },
  ) => void
  velgOrd: (id: string | null) => void
  lestVarsel: (id: string) => void
  lukkTilbakemelding: () => void
  aapneInnstillinger: () => void
  tilbakeTilEpisoder: () => void
  lagreSok: (sok: LagretSok, flagg: string[]) => void
  settValgteJobber: (ids: string[], flagg: string[]) => void
  settMagasinAnnonse: (id: string) => void
  lagreAktiviteter: (aktiviteter: Aktivitet[], flagg: string[]) => void
  lagreSoknad: (tekst: string, annonseId: string | null, flagg: string[]) => void
  lagreReise: (reise: LagretReise, flagg: string[]) => void
  lagreSkattekort: (skattekort: LagretSkattekort, flagg: string[]) => void
  aapneSlutt: () => void
  nullstill: () => void
}

const SpillContext = createContext<SpillApi | null>(null)

export function SpillProvider({ children }: { children: ReactNode }) {
  const lastet = useMemo(() => {
    try {
      return { ok: true as const, innhold: lastInnhold() }
    } catch {
      return { ok: false as const, innhold: null }
    }
  }, [])

  if (!lastet.ok || !lastet.innhold) {
    return (
      <div className="feilside">
        <h1>Innholdet kunne ikke lastes</h1>
        <p>Be læreren kjøre npm run valider og sjekke JSON-filene.</p>
      </div>
    )
  }

  return <SpillProviderIndre innhold={lastet.innhold}>{children}</SpillProviderIndre>
}

function SpillProviderIndre({
  children,
  innhold,
}: {
  children: ReactNode
  innhold: Innhold
}) {
  const [fremdrift, dispatch] = useReducer(reduser, undefined, () => {
    const lagret = lastLagring()
    if (lagret === null) return tomFremdrift()
    return parseFremdrift(lagret)
  })

  useEffect(() => {
    lagre(fremdrift)
  }, [fremdrift])

  const person = fremdrift.personId ? (hentPerson(innhold, fremdrift.personId) ?? null) : null
  const episode = fremdrift.aktivEpisodeId
    ? (hentEpisode(innhold, fremdrift.aktivEpisodeId) ?? null)
    : null
  const scene = episode && fremdrift.aktivSceneId ? (hentScene(episode, fremdrift.aktivSceneId) ?? null) : null
  const valgtOrd = fremdrift.valgtOrdId ? (hentOrd(innhold, fremdrift.valgtOrdId) ?? null) : null
  const oppgaverFerdige = scene ? sceneOppgaverFerdige(fremdrift, scene) : false

  const gaTilNeste = useCallback(
    (nesteId: string) => {
      if (nesteId === OPPSUMMERING_ID) {
        dispatch({ type: 'FULLFOR_EPISODE' })
        return
      }
      if (nesteId === SLUTT_ID) {
        dispatch({ type: 'FULLFOR_SPILL' })
        return
      }
      if (!episode) return
      const neste = hentScene(episode, nesteId)
      if (neste) dispatch({ type: 'GA_TIL_SCENE', scene: neste })
    },
    [episode],
  )

  const api = useMemo<SpillApi>(
    () => ({
      innhold,
      fremdrift,
      person,
      episode,
      scene,
      valgtOrd,
      oppgaverFerdige,
      velgPerson: (id) => dispatch({ type: 'VELG_PERSON', id }),
      velgMorsmal: (morsmal) => dispatch({ type: 'VELG_MORSMAL', morsmal }),
      startSpill: () => dispatch({ type: 'START_SPILL' }),
      startEpisode: (id) => {
        const ep = hentEpisode(innhold, id)
        if (!ep) return
        const start = hentScene(ep, ep.startSceneId)
        if (!start) return
        dispatch({
          type: 'START_EPISODE',
          episodeId: id,
          startScene: start,
          tillatteFlagg: ep.tillatteFlagg,
        })
      },
      aapneApp: (app) => {
        if (app === 'innstillinger') {
          dispatch({ type: 'APNE_INNSTILLINGER' })
          return
        }
        dispatch({ type: 'SETT_APP', app })
      },
      registrerOppgave: (oppgaveId, oppgaveType, riktig) =>
        dispatch({ type: 'REGISTRER_OPPGAVE', oppgaveId, oppgaveType, riktig }),
      velgValg: (valg) => {
        dispatch({ type: 'VELG_VALG', valg })
        gaTilNeste(valg.nesteSceneId)
      },
      sendMelding: (tekst, nesteSceneId, flagg, ekstra) => {
        dispatch({
          type: 'SEND_MELDING',
          tekst,
          nesteSceneId,
          flagg,
          kanal: ekstra?.kanal,
          emne: ekstra?.emne,
        })
        gaTilNeste(nesteSceneId)
      },
      velgOrd: (id) => dispatch({ type: 'VELG_ORD', id }),
      lestVarsel: (id) => dispatch({ type: 'LEST_VARSEL', id }),
      lukkTilbakemelding: () => dispatch({ type: 'LUKK_TILBAKEMELDING' }),
      aapneInnstillinger: () => dispatch({ type: 'APNE_INNSTILLINGER' }),
      tilbakeTilEpisoder: () => dispatch({ type: 'TILBAKE_EPISODER' }),
      lagreSok: (sok, flagg) => dispatch({ type: 'LAGRE_SOK', sok, flagg }),
      settValgteJobber: (ids, flagg) => dispatch({ type: 'SETT_VALGTE_JOBBER', ids, flagg }),
      settMagasinAnnonse: (id) => dispatch({ type: 'SETT_MAGASIN_ANNONSE', id }),
      lagreAktiviteter: (aktiviteter, flagg) => dispatch({ type: 'LAGRE_AKTIVITETER', aktiviteter, flagg }),
      lagreSoknad: (tekst, annonseId, flagg) => dispatch({ type: 'LAGRE_SOKNAD', tekst, annonseId, flagg }),
      lagreReise: (reise, flagg) => dispatch({ type: 'LAGRE_REISE', reise, flagg }),
      lagreSkattekort: (skattekort, flagg) => dispatch({ type: 'LAGRE_SKATTEKORT', skattekort, flagg }),
      aapneSlutt: () => dispatch({ type: 'APNE_SLUTT' }),
      nullstill: () => {
        slettLagring()
        dispatch({ type: 'NULLSTILL' })
      },
    }),
    [episode, fremdrift, gaTilNeste, innhold, oppgaverFerdige, person, scene, valgtOrd],
  )

  return <SpillContext.Provider value={api}>{children}</SpillContext.Provider>
}

export function useSpill(): SpillApi {
  const ctx = useContext(SpillContext)
  if (!ctx) throw new Error('useSpill må brukes inne i SpillProvider')
  return ctx
}
