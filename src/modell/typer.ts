import type { z } from 'zod'
import type {
  annonseSkjema,
  appIdSkjema,
  byggMeldingSkjema,
  cvValgSkjema,
  egenskapKoblingSkjema,
  episodeOversiktSkjema,
  episodeSkjema,
  epostSkjema,
  finnOgRettSkjema,
  flervalgSkjema,
  kalenderhendelseSkjema,
  lyttOgVelgSkjema,
  matchKravSkjema,
  matchSjekklisteSkjema,
  matchingSkjema,
  mediaSkjema,
  morsmalSkjema,
  oppgaveSkjema,
  ordbankSkjema,
  ordSkjema,
  personSkjema,
  portalSokSkjema,
  santUsantSkjema,
  scenarioSkjema,
  sceneSkjema,
  smsMeldingSkjema,
  smsTraadSkjema,
  sorterKategoriSkjema,
  sorterSetningSkjema,
  valgSkjema,
  varselSkjema,
  velgJobberSkjema,
  registrerAktiviteterSkjema,
  byggSoknadSkjema,
  aktivitetStatusSkjema,
  intervjuSvarSkjema,
  reiseplanSkjema,
  fyllTallSkjema,
  finnIDokumentSkjema,
  satserSkjema,
  arbeidsforholdSkjema,
  arbeidFilSkjema,
  ruterFilSkjema,
  avgangSkjema,
  holdeplassSkjema,
  linjeSkjema,
  sluttFilSkjema,
  sluttUtfallSkjema,
  reiseOppdragSkjema,
} from './skjema'

export type Morsmal = z.infer<typeof morsmalSkjema>
export type AppId = z.infer<typeof appIdSkjema>
export type Person = z.infer<typeof personSkjema>
export type Ord = z.infer<typeof ordSkjema>
export type Valg = z.infer<typeof valgSkjema>
export type Media = z.infer<typeof mediaSkjema>
export type Varsel = z.infer<typeof varselSkjema>
export type Kalenderhendelse = z.infer<typeof kalenderhendelseSkjema>
export type SmsMelding = z.infer<typeof smsMeldingSkjema>
export type SmsTraad = z.infer<typeof smsTraadSkjema>
export type Epost = z.infer<typeof epostSkjema>
export type FlervalgOppgave = z.infer<typeof flervalgSkjema>
export type SantUsantOppgave = z.infer<typeof santUsantSkjema>
export type OrdbankOppgave = z.infer<typeof ordbankSkjema>
export type SorterSetningOppgave = z.infer<typeof sorterSetningSkjema>
export type MatchingOppgave = z.infer<typeof matchingSkjema>
export type FinnOgRettOppgave = z.infer<typeof finnOgRettSkjema>
export type LyttOgVelgOppgave = z.infer<typeof lyttOgVelgSkjema>
export type ByggMeldingOppgave = z.infer<typeof byggMeldingSkjema>
export type SorterKategoriOppgave = z.infer<typeof sorterKategoriSkjema>
export type EgenskapKoblingOppgave = z.infer<typeof egenskapKoblingSkjema>
export type CvValgOppgave = z.infer<typeof cvValgSkjema>
export type PortalSokOppgave = z.infer<typeof portalSokSkjema>
export type MatchSjekklisteOppgave = z.infer<typeof matchSjekklisteSkjema>
export type VelgJobberOppgave = z.infer<typeof velgJobberSkjema>
export type RegistrerAktiviteterOppgave = z.infer<typeof registrerAktiviteterSkjema>
export type ByggSoknadOppgave = z.infer<typeof byggSoknadSkjema>
export type IntervjuSvarOppgave = z.infer<typeof intervjuSvarSkjema>
export type ReiseplanOppgave = z.infer<typeof reiseplanSkjema>
export type FyllTallOppgave = z.infer<typeof fyllTallSkjema>
export type FinnIDokumentOppgave = z.infer<typeof finnIDokumentSkjema>
export type Satser = z.infer<typeof satserSkjema>
export type Arbeidsforhold = z.infer<typeof arbeidsforholdSkjema>
export type ArbeidInnhold = z.infer<typeof arbeidFilSkjema>
export type AktivitetStatus = z.infer<typeof aktivitetStatusSkjema>
export type Oppgave = z.infer<typeof oppgaveSkjema>
export type Ruter = z.infer<typeof ruterFilSkjema>
export type Avgang = z.infer<typeof avgangSkjema>
export type Holdeplass = z.infer<typeof holdeplassSkjema>
export type Linje = z.infer<typeof linjeSkjema>
export type ReiseOppdrag = z.infer<typeof reiseOppdragSkjema>
export type SluttInnhold = z.infer<typeof sluttFilSkjema>
export type SluttUtfall = z.infer<typeof sluttUtfallSkjema>
export type Scene = z.infer<typeof sceneSkjema>
export type Episode = z.infer<typeof episodeSkjema>
export type EpisodeOversikt = z.infer<typeof episodeOversiktSkjema>
export type Scenario = z.infer<typeof scenarioSkjema>
export type MatchKrav = z.infer<typeof matchKravSkjema>
export type Annonse = z.infer<typeof annonseSkjema>
export type MatchSvar = 'passer' | 'passer_ikke' | 'vet_ikke'

export const OPPSUMMERING_ID = 'oppsummering'
export const SLUTT_ID = 'slutt'

export const INTERVJU_KVALITET_NAVN = {
  kort: 'Kort svar',
  langt: 'For langt svar',
  godt: 'Godt svar',
} as const

export const MORSMAL_ETIKETTER: Record<Morsmal, string> = {
  uk: 'Українська',
  en: 'English',
  ar: 'العربية',
}

export const APP_ETIKETTER: Record<AppId, string> = {
  hjem: 'Hjem',
  meldinger: 'Meldinger',
  epost: 'E-post',
  kalender: 'Kalender',
  jobbportal: 'Jobbportal',
  aktivitetsplan: 'Aktivitetsplan',
  cv: 'CV',
  reise: 'Reiseplanlegger',
  jobbmagasin: 'Jobbmagasinet',
  skatt: 'Skatteøving',
  lonn: 'Lønn',
  innstillinger: 'Innstillinger',
}

export const FASE1_APPER: AppId[] = [
  'meldinger',
  'epost',
  'kalender',
  'cv',
  'jobbportal',
  'jobbmagasin',
  'aktivitetsplan',
  'reise',
  'skatt',
  'lonn',
  'innstillinger',
]

export const AKTIVITET_STATUS_NAVN: Record<AktivitetStatus, string> = {
  skal_soke: 'Skal søke',
  sendt_soknad: 'Sendt søknad',
  innkalt: 'Innkalt til intervju',
  avslag: 'Avslag',
}

export interface Aktivitet {
  id: string
  annonseId: string
  tittel: string
  bedrift: string
  status: AktivitetStatus
  frist: string
}
