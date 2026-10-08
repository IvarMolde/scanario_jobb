import { z } from 'zod'
import type { Aktivitet, AppId, Epost, Kalenderhendelse, Morsmal, Scene, Valg } from '../modell/typer'
import { aktivitetStatusSkjema, appIdSkjema, morsmalSkjema } from '../modell/skjema'
import { OPPSUMMERING_ID } from '../modell/typer'
import { settStatus } from './aktiviteter'
import type { LagretReise } from './reise'
import type { LagretSkattekort } from './skatt'

export type Visning = 'start' | 'episoder' | 'scene' | 'oppsummering' | 'slutt' | 'innstillinger'

export interface OppgaveResultat {
  oppgaveId: string
  type: string
  forsok: number
  riktig: boolean
}

export interface VarselISpill {
  id: string
  type: 'sms' | 'epost' | 'anrop'
  fra: string
  innhold: string
  lest: boolean
}

export interface SmsISpill {
  id: string
  fra: 'veileder' | 'elev'
  tekst: string
}

export interface LagretSok {
  sokkeordId: string
  stedId: string
  stillingId: string
  varsel: boolean
}

export interface Fremdrift {
  personId: string | null
  morsmal: Morsmal | null
  visning: Visning
  aktivEpisodeId: string | null
  aktivSceneId: string | null
  aktivApp: AppId
  fullforteEpisoder: string[]
  fullforteScener: string[]
  sceneHistorikk: string[]
  flagg: string[]
  oppgaver: OppgaveResultat[]
  kalender: Kalenderhendelse[]
  sms: SmsISpill[]
  smsKontakt: string
  smsUtkast: string | null
  eposter: Epost[]
  varsler: VarselISpill[]
  valgtOrdId: string | null
  valgTilbakemelding: string | null
  valgteJobber: string[]
  lagretSok: LagretSok | null
  magasinAnnonseId: string | null
  aktiviteter: Aktivitet[]
  soknadTekst: string | null
  lagretReise: LagretReise | null
  skattekort: LagretSkattekort | null
}

const visningSkjema = z.enum(['start', 'episoder', 'scene', 'oppsummering', 'slutt', 'innstillinger'])

const fremdriftSkjema = z.object({
  personId: z.string().nullable(),
  morsmal: morsmalSkjema.nullable(),
  visning: visningSkjema,
  aktivEpisodeId: z.string().nullable(),
  aktivSceneId: z.string().nullable(),
  aktivApp: appIdSkjema,
  fullforteEpisoder: z.array(z.string()),
  fullforteScener: z.array(z.string()),
  sceneHistorikk: z.array(z.string()).optional(),
  flagg: z.array(z.string()),
  oppgaver: z.array(
    z.object({
      oppgaveId: z.string(),
      type: z.string(),
      forsok: z.number(),
      riktig: z.boolean(),
    }),
  ),
  kalender: z.array(
    z.object({
      id: z.string(),
      tittel: z.string(),
      dag: z.string(),
      tid: z.string(),
      sted: z.string(),
    }),
  ),
  sms: z.array(
    z.object({
      id: z.string(),
      fra: z.enum(['veileder', 'elev']),
      tekst: z.string(),
    }),
  ),
  smsKontakt: z.string(),
  smsUtkast: z.string().nullable().optional(),
  eposter: z.array(
    z.object({
      id: z.string(),
      fra: z.string(),
      emne: z.string(),
      innhold: z.string(),
    }),
  ),
  varsler: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['sms', 'epost', 'anrop']),
      fra: z.string(),
      innhold: z.string(),
      lest: z.boolean(),
    }),
  ),
  valgtOrdId: z.string().nullable(),
  valgTilbakemelding: z.string().nullable(),
  valgteJobber: z.array(z.string()).optional(),
  lagretSok: z
    .object({
      sokkeordId: z.string(),
      stedId: z.string(),
      stillingId: z.string(),
      varsel: z.boolean(),
    })
    .nullable()
    .optional(),
  magasinAnnonseId: z.string().nullable().optional(),
  aktiviteter: z
    .array(
      z.object({
        id: z.string(),
        annonseId: z.string(),
        tittel: z.string(),
        bedrift: z.string(),
        status: aktivitetStatusSkjema,
        frist: z.string(),
      }),
    )
    .optional(),
  soknadTekst: z.string().nullable().optional(),
  lagretReise: z
    .object({
      fra: z.string(),
      til: z.string(),
      avgangId: z.string(),
    })
    .nullable()
    .optional(),
  skattekort: z
    .object({
      loggetInn: z.boolean(),
      endret: z.boolean(),
      fagforening: z.boolean(),
      forventetInntekt: z.number(),
      trekkprosent: z.number(),
      maanedstrekk: z.number(),
      aarsskatt: z.number(),
    })
    .nullable()
    .optional(),
})

export function tomFremdrift(): Fremdrift {
  return {
    personId: null,
    morsmal: null,
    visning: 'start',
    aktivEpisodeId: null,
    aktivSceneId: null,
    aktivApp: 'hjem',
    fullforteEpisoder: [],
    fullforteScener: [],
    sceneHistorikk: [],
    flagg: [],
    oppgaver: [],
    kalender: [],
    sms: [],
    smsKontakt: 'Linn Holm',
    smsUtkast: null,
    eposter: [],
    varsler: [],
    valgtOrdId: null,
    valgTilbakemelding: null,
    valgteJobber: [],
    lagretSok: null,
    magasinAnnonseId: null,
    aktiviteter: [],
    soknadTekst: null,
    lagretReise: null,
    skattekort: null,
  }
}

export function parseFremdrift(raw: unknown): Fremdrift {
  const resultat = fremdriftSkjema.safeParse(raw)
  if (!resultat.success) return tomFremdrift()
  return {
    ...resultat.data,
    smsUtkast: resultat.data.smsUtkast ?? null,
    sceneHistorikk: resultat.data.sceneHistorikk ?? [],
    valgteJobber: resultat.data.valgteJobber ?? [],
    lagretSok: resultat.data.lagretSok ?? null,
    magasinAnnonseId: resultat.data.magasinAnnonseId ?? null,
    aktiviteter: resultat.data.aktiviteter ?? [],
    soknadTekst: resultat.data.soknadTekst ?? null,
    lagretReise: resultat.data.lagretReise ?? null,
    skattekort: resultat.data.skattekort ?? null,
  }
}

function unik<T>(liste: T[]): T[] {
  return [...new Set(liste)]
}

function velkomstEpost(): Epost {
  return {
    id: 'ovingsmail',
    fra: 'Jobbreisen',
    emne: 'Velkommen',
    innhold: 'Hei. Her øver du på å søke jobb. Lykke til!',
  }
}

export function anvendScene(state: Fremdrift, scene: Scene): Fremdrift {
  const neste: Fremdrift = {
    ...state,
    visning: 'scene',
    aktivSceneId: scene.id,
    aktivApp: scene.app,
    smsUtkast: null,
    fullforteScener: unik([...state.fullforteScener, scene.id]),
    magasinAnnonseId: scene.annonseId ?? state.magasinAnnonseId,
  }

  if (scene.kalenderhendelse) {
    const finnes = state.kalender.some((h) => h.id === scene.kalenderhendelse!.id)
    neste.kalender = finnes
      ? state.kalender.map((h) => (h.id === scene.kalenderhendelse!.id ? scene.kalenderhendelse! : h))
      : [...state.kalender, scene.kalenderhendelse]
  }

  if (scene.smsTraad) {
    neste.smsKontakt = scene.smsTraad.kontakt
    const nye = scene.smsTraad.meldinger.map((melding, indeks) => ({
      id: `${scene.id}-sms-${indeks}`,
      fra: melding.fra,
      tekst: melding.tekst,
    }))
    const eksisterende = new Set(state.sms.map((m) => m.id))
    neste.sms = [...state.sms, ...nye.filter((m) => !eksisterende.has(m.id))]
  }

  if (scene.epost && !state.eposter.some((e) => e.id === scene.epost?.id)) {
    neste.eposter = [...state.eposter, scene.epost]
  }

  if (scene.varsel) {
    const id = `${scene.id}-varsel`
    if (!state.varsler.some((v) => v.id === id)) {
      neste.varsler = [
        ...state.varsler,
        {
          id,
          type: scene.varsel.type,
          fra: scene.varsel.fra,
          innhold: scene.varsel.innhold,
          lest: false,
        },
      ]
    }
  }

  return neste
}

export type Handling =
  | { type: 'VELG_PERSON'; id: string }
  | { type: 'VELG_MORSMAL'; morsmal: Morsmal }
  | { type: 'START_SPILL' }
  | { type: 'START_EPISODE'; episodeId: string; startScene: Scene; tillatteFlagg: string[] }
  | { type: 'GA_TIL_SCENE'; scene: Scene; fraTilbake?: boolean }
  | { type: 'SETT_APP'; app: AppId }
  | { type: 'REGISTRER_OPPGAVE'; oppgaveId: string; oppgaveType: string; riktig: boolean }
  | { type: 'VELG_VALG'; valg: Valg }
  | { type: 'SEND_MELDING'; tekst: string; nesteSceneId: string; flagg: string[]; kanal?: 'sms' | 'epost'; emne?: string }
  | { type: 'SETT_SMS_UTKAST'; tekst: string | null }
  | { type: 'VELG_ORD'; id: string | null }
  | { type: 'LEST_VARSEL'; id: string }
  | { type: 'LUKK_TILBAKEMELDING' }
  | { type: 'APNE_INNSTILLINGER' }
  | { type: 'TILBAKE_EPISODER' }
  | { type: 'TIL_START' }
  | { type: 'FULLFOR_EPISODE' }
  | { type: 'LAGRE_SOK'; sok: LagretSok; flagg: string[] }
  | { type: 'SETT_VALGTE_JOBBER'; ids: string[]; flagg: string[] }
  | { type: 'SETT_MAGASIN_ANNONSE'; id: string }
  | { type: 'LAGRE_AKTIVITETER'; aktiviteter: Aktivitet[]; flagg: string[] }
  | { type: 'LAGRE_SOKNAD'; tekst: string; annonseId: string | null; flagg: string[] }
  | { type: 'LAGRE_REISE'; reise: LagretReise; flagg: string[] }
  | { type: 'LAGRE_SKATTEKORT'; skattekort: LagretSkattekort; flagg: string[] }
  | { type: 'FULLFOR_SPILL' }
  | { type: 'APNE_SLUTT' }
  | { type: 'NULLSTILL' }

export function reduser(state: Fremdrift, handling: Handling): Fremdrift {
  switch (handling.type) {
    case 'VELG_PERSON':
      return { ...state, personId: handling.id }
    case 'VELG_MORSMAL':
      return { ...state, morsmal: handling.morsmal }
    case 'START_SPILL':
      if (!state.personId || !state.morsmal) return state
      return { ...state, visning: 'episoder', aktivApp: 'hjem' }
    case 'START_EPISODE': {
      const fjern = new Set(handling.tillatteFlagg)
      const eposter = state.eposter.some((e) => e.id === 'ovingsmail')
        ? state.eposter
        : [velkomstEpost(), ...state.eposter]
      const start: Fremdrift = {
        ...state,
        visning: 'scene',
        aktivEpisodeId: handling.episodeId,
        aktivSceneId: handling.startScene.id,
        aktivApp: handling.startScene.app,
        sceneHistorikk: [],
        fullforteEpisoder: state.fullforteEpisoder.filter((id) => id !== handling.episodeId),
        fullforteScener: state.fullforteScener.filter((id) => !id.startsWith(`${handling.episodeId}-`)),
        flagg: state.flagg.filter((f) => !fjern.has(f)),
        oppgaver: state.oppgaver.filter((o) => !o.oppgaveId.startsWith(`${handling.episodeId}-`)),
        valgtOrdId: null,
        valgTilbakemelding: null,
        valgteJobber: fjern.has('valgte_jobber') ? [] : state.valgteJobber,
        lagretSok: fjern.has('har_lagret_sok') ? null : state.lagretSok,
        aktiviteter: fjern.has('aktiviteter_registrert') ? [] : state.aktiviteter,
        soknadTekst: fjern.has('soknad_tilpasset') ? null : state.soknadTekst,
        lagretReise: fjern.has('kom_presis') ? null : state.lagretReise,
        skattekort: fjern.has('endret_skattekort') ? null : state.skattekort,
        sms: state.sms.filter((s) => !s.id.startsWith(`${handling.episodeId}-`)),
        eposter: eposter.filter((e) => e.id === 'ovingsmail' || !e.id.startsWith(`${handling.episodeId}-`)),
        kalender: state.kalender.filter((k) => !k.id.startsWith(`${handling.episodeId}-`)),
        varsler: state.varsler.filter((v) => !v.id.startsWith(`${handling.episodeId}-`)),
      }
      return anvendScene(start, handling.startScene)
    }
    case 'GA_TIL_SCENE': {
      if (handling.fraTilbake) {
        const historikk = state.sceneHistorikk.slice(0, -1)
        return { ...anvendScene(state, handling.scene), sceneHistorikk: historikk }
      }
      const historikk = state.aktivSceneId
        ? [...state.sceneHistorikk, state.aktivSceneId]
        : state.sceneHistorikk
      return anvendScene({ ...state, sceneHistorikk: historikk }, handling.scene)
    }
    case 'SETT_APP':
      return { ...state, aktivApp: handling.app }
    case 'REGISTRER_OPPGAVE': {
      const eksisterende = state.oppgaver.find((o) => o.oppgaveId === handling.oppgaveId)
      const oppdatert: OppgaveResultat = {
        oppgaveId: handling.oppgaveId,
        type: handling.oppgaveType,
        forsok: (eksisterende?.forsok ?? 0) + 1,
        riktig: handling.riktig ? true : (eksisterende?.riktig ?? false),
      }
      if (eksisterende && handling.riktig === false && eksisterende.riktig) {
        oppdatert.riktig = true
      }
      return {
        ...state,
        oppgaver: [...state.oppgaver.filter((o) => o.oppgaveId !== handling.oppgaveId), oppdatert],
      }
    }
    case 'VELG_VALG': {
      const fjern = new Set(handling.valg.fjernFlagg ?? [])
      const flagg = unik([...state.flagg, ...(handling.valg.flagg ?? [])]).filter((f) => !fjern.has(f))
      let aktiviteter = state.aktiviteter
      if (handling.valg.aktivitetStatus) {
        aktiviteter = settStatus(aktiviteter, handling.valg.aktivitetStatus)
      }
      if (flagg.includes('intervju_bekreftet') && !state.flagg.includes('intervju_bekreftet')) {
        aktiviteter = settStatus(aktiviteter, 'innkalt')
      }
      return {
        ...state,
        flagg,
        aktiviteter,
        valgTilbakemelding: handling.valg.tilbakemelding,
      }
    }
    case 'SEND_MELDING': {
      const flagg = unik([...state.flagg, ...handling.flagg])
      let aktiviteter = state.aktiviteter
      if (flagg.includes('intervju_bekreftet') && !state.flagg.includes('intervju_bekreftet')) {
        aktiviteter = settStatus(aktiviteter, 'innkalt')
      }
      if (handling.kanal === 'epost') {
        return {
          ...state,
          flagg,
          aktiviteter,
          smsUtkast: null,
          eposter: [
            ...state.eposter,
            {
              id: `elev-epost-${crypto.randomUUID()}`,
              fra: 'Deg',
              emne: handling.emne ?? 'Spørsmål om lønn',
              innhold: handling.tekst,
            },
          ],
        }
      }
      return {
        ...state,
        flagg,
        aktiviteter,
        smsUtkast: null,
        sms: [
          ...state.sms,
          {
            id: `elev-${crypto.randomUUID()}`,
            fra: 'elev',
            tekst: handling.tekst,
          },
        ],
      }
    }
    case 'SETT_SMS_UTKAST':
      if (state.smsUtkast === handling.tekst) return state
      return { ...state, smsUtkast: handling.tekst }
    case 'VELG_ORD':
      return { ...state, valgtOrdId: handling.id }
    case 'LEST_VARSEL':
      return {
        ...state,
        varsler: state.varsler.map((v) => (v.id === handling.id ? { ...v, lest: true } : v)),
      }
    case 'LUKK_TILBAKEMELDING':
      return { ...state, valgTilbakemelding: null }
    case 'APNE_INNSTILLINGER':
      return { ...state, aktivApp: 'innstillinger' }
    case 'TILBAKE_EPISODER':
      return {
        ...state,
        visning: 'episoder',
        aktivApp: 'hjem',
        aktivSceneId: null,
        aktivEpisodeId: state.aktivEpisodeId,
        sceneHistorikk: [],
        smsUtkast: null,
        valgtOrdId: null,
        valgTilbakemelding: null,
      }
    case 'TIL_START':
      return {
        ...state,
        visning: 'start',
        aktivApp: 'hjem',
        aktivSceneId: null,
        sceneHistorikk: [],
        smsUtkast: null,
        valgtOrdId: null,
        valgTilbakemelding: null,
      }
    case 'LAGRE_SOK':
      return {
        ...state,
        lagretSok: handling.sok,
        flagg: unik([...state.flagg, ...handling.flagg]),
      }
    case 'SETT_VALGTE_JOBBER':
      return {
        ...state,
        valgteJobber: handling.ids,
        flagg: unik([...state.flagg, ...handling.flagg]),
      }
    case 'SETT_MAGASIN_ANNONSE':
      return { ...state, magasinAnnonseId: handling.id }
    case 'LAGRE_AKTIVITETER':
      return {
        ...state,
        aktiviteter: handling.aktiviteter,
        flagg: unik([...state.flagg, ...handling.flagg]),
      }
    case 'LAGRE_SOKNAD':
      return {
        ...state,
        soknadTekst: handling.tekst,
        aktiviteter: settStatus(state.aktiviteter, 'sendt_soknad', handling.annonseId),
        flagg: unik([...state.flagg, ...handling.flagg]),
      }
    case 'LAGRE_REISE':
      return {
        ...state,
        lagretReise: handling.reise,
        flagg: unik([...state.flagg, ...handling.flagg]),
      }
    case 'LAGRE_SKATTEKORT':
      return {
        ...state,
        skattekort: handling.skattekort,
        flagg: unik([...state.flagg, ...handling.flagg]),
      }
    case 'FULLFOR_SPILL': {
      const sluttId = state.aktivEpisodeId
      return {
        ...state,
        visning: 'slutt',
        fullforteEpisoder: sluttId ? unik([...state.fullforteEpisoder, sluttId]) : state.fullforteEpisoder,
        aktivApp: 'hjem',
        varsler: state.varsler.map((v) => ({ ...v, lest: true })),
      }
    }
    case 'APNE_SLUTT':
      return { ...state, visning: 'slutt', aktivApp: 'hjem' }
    case 'FULLFOR_EPISODE': {
      const id = state.aktivEpisodeId
      const historikk = state.aktivSceneId
        ? [...state.sceneHistorikk, state.aktivSceneId]
        : state.sceneHistorikk
      if (!id) return { ...state, visning: 'oppsummering', sceneHistorikk: historikk }
      return {
        ...state,
        visning: 'oppsummering',
        sceneHistorikk: historikk,
        fullforteEpisoder: unik([...state.fullforteEpisoder, id]),
        aktivApp: 'hjem',
        varsler: state.varsler.map((v) => ({ ...v, lest: true })),
      }
    }
    case 'NULLSTILL':
      return tomFremdrift()
    default:
      return state
  }
}

export function sceneOppgaverFerdige(state: Fremdrift, scene: Scene): boolean {
  return scene.oppgaver.every((oppgave) =>
    state.oppgaver.some((r) => r.oppgaveId === oppgave.id && r.riktig),
  )
}

export { OPPSUMMERING_ID }
