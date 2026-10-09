import { z } from 'zod'

export const morsmalSkjema = z.enum(['uk', 'en', 'ar'])

export const appIdSkjema = z.enum([
  'hjem',
  'meldinger',
  'epost',
  'kalender',
  'jobbportal',
  'aktivitetsplan',
  'cv',
  'reise',
  'jobbmagasin',
  'skatt',
  'lonn',
  'innstillinger',
  'notater',
])

export const personSkjema = z.object({
  id: z.string().min(1),
  fornavn: z.string().min(1),
  etternavn: z.string().min(1),
  bilde: z.string().min(1),
  presentasjon: z.string().min(1),
  presentasjonLyd: z.string().min(1),
  bakgrunn: z.string().min(1),
  sprak: z.array(z.string().min(1)).min(1),
  erfaring: z.string().min(1),
  egenskaper: z.array(z.string().min(1)).min(1),
  forerkort: z.boolean(),
  forerkortType: z.string().optional(),
  bosted: z.string().min(1),
  yrkesmal: z.string().min(1),
  utdanning: z.string().min(1),
  sertifikater: z.array(z.string().min(1)),
  sone: z.enum(['kviltorp', 'aarolia', 'sentrum']),
  fodselsnummer: z.string().min(1),
  cvErfaring: z.string().min(1),
  cvUtdanning: z.string().min(1),
  cvSprak: z.string().min(1),
  cvSertifikater: z.string().min(1),
  cvReferanse: z.string().min(1),
})

export const oversettelserSkjema = z.object({
  uk: z.string().min(1),
  en: z.string().min(1),
  ar: z.string().min(1),
})

export const ordSkjema = z.object({
  id: z.string().min(1),
  ord: z.string().min(1),
  forklaring: z.string().min(1),
  bilde: z.string().optional(),
  lyd: z.string().optional(),
  oversettelser: oversettelserSkjema,
})

export const aktivitetStatusSkjema = z.enum(['skal_soke', 'sendt_soknad', 'innkalt', 'avslag'])

export const valgSkjema = z.object({
  id: z.string().min(1),
  tekst: z.string().min(1),
  nesteSceneId: z.string().min(1),
  flagg: z.array(z.string().min(1)).optional(),
  fjernFlagg: z.array(z.string().min(1)).optional(),
  visHvisFlagg: z.string().min(1).optional(),
  visHvisIkkeFlagg: z.string().min(1).optional(),
  aktivitetStatus: aktivitetStatusSkjema.optional(),
  tilbakemelding: z.string().min(1),
})

export const mediaSkjema = z.object({
  bilde: z.string().optional(),
  bildeAlt: z.string().optional(),
  lyd: z.string().optional(),
  manus: z.string().min(1).optional(),
})

export const varselSkjema = z.object({
  type: z.enum(['sms', 'epost', 'anrop']),
  fra: z.string().min(1),
  innhold: z.string().min(1),
})

export const kalenderhendelseSkjema = z.object({
  id: z.string().min(1),
  tittel: z.string().min(1),
  dag: z.string().min(1),
  tid: z.string().min(1),
  sted: z.string().min(1),
})

export const smsMeldingSkjema = z.object({
  fra: z.enum(['veileder', 'elev']),
  tekst: z.string().min(1),
})

export const smsTraadSkjema = z.object({
  kontakt: z.string().min(1),
  meldinger: z.array(smsMeldingSkjema),
})

export const epostSkjema = z.object({
  id: z.string().min(1),
  fra: z.string().min(1),
  emne: z.string().min(1),
  innhold: z.string().min(1),
})

const oppgaveFelles = {
  id: z.string().min(1),
  instruksjon: z.string().min(1),
  instruksjonLyd: z.string().optional(),
  lydManus: z.string().min(1).optional(),
  tilbakemeldingRiktig: z.string().min(1),
  tilbakemeldingFeil: z.string().min(1),
}

export const alternativSkjema = z.object({
  id: z.string().min(1),
  tekst: z.string().min(1),
})

export const flervalgSkjema = z.object({
  type: z.literal('flervalg'),
  ...oppgaveFelles,
  spoersmal: z.string().min(1),
  alternativer: z.array(alternativSkjema).min(2),
  riktigId: z.string().min(1),
})

export const santUsantSkjema = z.object({
  type: z.literal('sant_usant'),
  ...oppgaveFelles,
  paastand: z.string().min(1),
  riktigErSant: z.boolean(),
})

export const ordbankSkjema = z.object({
  type: z.literal('ordbank'),
  ...oppgaveFelles,
  setning: z.string().min(1),
  ord: z.array(z.string().min(1)).min(2),
  riktig: z.string().min(1),
})

export const sorterSetningSkjema = z.object({
  type: z.literal('sorter_setning'),
  ...oppgaveFelles,
  biter: z.array(z.string().min(1)).min(3),
})

export const matchingParSkjema = z.object({
  id: z.string().min(1),
  venstre: z.string().min(1),
  hoyre: z.string().min(1),
})

export const matchingSkjema = z.object({
  type: z.literal('matching'),
  ...oppgaveFelles,
  par: z.array(matchingParSkjema).min(2),
})

export const finnOgRettSkjema = z
  .object({
    type: z.literal('finn_og_rett'),
    ...oppgaveFelles,
    tekst: z.string().min(1),
    feilOrd: z.string().min(1),
    /** Hvis utelatt: kun marker feil ord (Mark the word). */
    alternativer: z.array(alternativSkjema).min(2).optional(),
    riktigId: z.string().min(1).optional(),
  })
  .superRefine((verdi, ctx) => {
    const harAlt = (verdi.alternativer?.length ?? 0) > 0
    if (harAlt && !verdi.riktigId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'riktigId kreves når alternativer er satt',
        path: ['riktigId'],
      })
    }
    if (!harAlt && verdi.riktigId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'riktigId brukes bare sammen med alternativer',
        path: ['riktigId'],
      })
    }
  })

export const lyttOgVelgSkjema = z.object({
  type: z.literal('lytt_og_velg'),
  ...oppgaveFelles,
  spoersmal: z.string().min(1),
  alternativer: z.array(alternativSkjema).min(2),
  riktigId: z.string().min(1),
})

export const byggDelSkjema = z.object({
  id: z.string().min(1),
  tekst: z.string().min(1),
  hoflig: z.boolean(),
})

export const byggMeldingSkjema = z.object({
  type: z.literal('bygg_melding'),
  ...oppgaveFelles,
  hilsen: z.array(byggDelSkjema).min(2),
  innhold: z.array(byggDelSkjema).min(2),
  avslutning: z.array(byggDelSkjema).min(2),
  flaggHoflig: z.array(z.string().min(1)),
  flaggUhoflig: z.array(z.string().min(1)),
  nesteHoflig: z.string().min(1),
  nesteUhoflig: z.string().min(1),
  kanal: z.enum(['sms', 'epost']).optional(),
  emne: z.string().min(1).optional(),
})

export const sorterKategoriElementSkjema = z.object({
  id: z.string().min(1),
  tekst: z.string().min(1),
  kategori: z.enum(['erfaring', 'utdanning', 'sprak', 'sertifikater']),
  personId: z.string().min(1),
})

export const sorterKategoriSkjema = z.object({
  type: z.literal('sorter_kategori'),
  ...oppgaveFelles,
  kategorier: z.array(z.object({ id: z.string().min(1), tittel: z.string().min(1) })).min(2),
  elementer: z.array(sorterKategoriElementSkjema).min(4),
})

export const egenskapKoblingSkjema = z.object({
  type: z.literal('egenskap_kobling'),
  ...oppgaveFelles,
  min: z.number().int().positive(),
  max: z.number().int().positive(),
  egenskaper: z.array(
    z.object({
      id: z.string().min(1),
      ord: z.string().min(1),
      eksempel: z.string().min(1),
      personer: z.array(z.string().min(1)).min(1),
    }),
  ).min(3),
})

export const cvValgSeksjonSkjema = z.object({
  id: z.string().min(1),
  tittel: z.string().min(1),
  alternativer: z.array(
    z.object({
      id: z.string().min(1),
      tekst: z.string().min(1),
      personer: z.array(z.string().min(1)),
    }),
  ).min(2),
})

export const cvValgSkjema = z.object({
  type: z.literal('cv_valg'),
  ...oppgaveFelles,
  seksjoner: z.array(cvValgSeksjonSkjema).min(1),
})

export const portalSokSkjema = z.object({
  type: z.literal('portal_sok'),
  ...oppgaveFelles,
  sokkeord: z.array(alternativSkjema).min(2),
  steder: z.array(alternativSkjema).min(2),
  stillinger: z.array(alternativSkjema).min(2),
  riktigPerPerson: z.record(
    z.string(),
    z.object({
      sokkeordId: z.string().min(1),
      stedId: z.string().min(1),
      stillingId: z.string().min(1),
    }),
  ),
  flagg: z.array(z.string().min(1)),
})

export const matchSjekklisteSkjema = z.object({
  type: z.literal('match_sjekkliste'),
  ...oppgaveFelles,
  annonseId: z.string().min(1).optional(),
  fallbackPerPerson: z.record(z.string(), z.string().min(1)).optional(),
  kategorier: z.array(z.enum(['kompetanse', 'egenskaper', 'logistikk'])).min(1),
})

export const registrerAktiviteterSkjema = z.object({
  type: z.literal('registrer_aktiviteter'),
  ...oppgaveFelles,
  statuser: z.array(alternativSkjema).min(2),
  riktigStatusId: z.string().min(1),
  fristDistraktorer: z.array(z.string().min(1)).min(1),
  flagg: z.array(z.string().min(1)),
})

export const byggSoknadAvsnittSkjema = z.object({
  id: z.string().min(1),
  tekst: z.string().min(1),
  personer: z.array(z.string().min(1)),
})

export const byggSoknadSkjema = z.object({
  type: z.literal('bygg_soknad'),
  ...oppgaveFelles,
  innledning: z.array(byggSoknadAvsnittSkjema).min(2),
  hvorfor: z.array(byggSoknadAvsnittSkjema).min(2),
  avslutning: z.array(byggSoknadAvsnittSkjema).min(2),
  flagg: z.array(z.string().min(1)),
})

export const velgJobberSkjema = z.object({
  type: z.literal('velg_jobber'),
  ...oppgaveFelles,
  min: z.number().int().positive(),
  max: z.number().int().positive(),
  flagg: z.array(z.string().min(1)).optional(),
})

export const intervjuKvalitetSkjema = z.enum(['kort', 'langt', 'godt'])

export const intervjuSvarAlternativSkjema = z.object({
  id: z.string().min(1),
  tekst: z.string().min(1),
  kvalitet: intervjuKvalitetSkjema,
  personer: z.array(z.string().min(1)).min(1),
})

export const intervjuSvarSkjema = z.object({
  type: z.literal('intervju_svar'),
  ...oppgaveFelles,
  spoersmal: z.string().min(1),
  spoersmalLyd: z.string().min(1),
  alternativer: z.array(intervjuSvarAlternativSkjema).min(3),
})

export const reiseplanSkjema = z.object({
  type: z.literal('reiseplan'),
  ...oppgaveFelles,
  bufferMin: z.number().int().nonnegative(),
  flagg: z.array(z.string().min(1)),
})

export const fyllTallFeltSkjema = z.object({
  id: z.string().min(1),
  ledetekst: z.string().min(1),
  nokkel: z.enum(['maanedslonn', 'inntektHittil', 'maanederIgjen']),
  distraktorer: z.array(z.number()).min(1),
})

export const fyllTallSkjema = z.object({
  type: z.literal('fyll_tall'),
  ...oppgaveFelles,
  felt: z.array(fyllTallFeltSkjema).min(1),
})

export const skrivSvarSkjema = z.object({
  type: z.literal('skriv_svar'),
  ...oppgaveFelles,
  spoersmal: z.string().min(1),
  hint: z.string().min(1),
  riktigeSvar: z.array(z.string().min(1)).min(1),
  normalisering: z.enum(['tekst', 'dato', 'prosent']),
})

export const finnIDokumentSkjema = z.object({
  type: z.literal('finn_i_dokument'),
  ...oppgaveFelles,
  dokument: z.enum(['skattekort', 'lonnsslipp']),
  spoersmal: z.string().min(1),
  riktigFeltId: z.string().min(1),
})

export const oppgaveSkjema = z.discriminatedUnion('type', [
  flervalgSkjema,
  santUsantSkjema,
  ordbankSkjema,
  sorterSetningSkjema,
  matchingSkjema,
  finnOgRettSkjema,
  lyttOgVelgSkjema,
  byggMeldingSkjema,
  sorterKategoriSkjema,
  egenskapKoblingSkjema,
  cvValgSkjema,
  portalSokSkjema,
  matchSjekklisteSkjema,
  velgJobberSkjema,
  registrerAktiviteterSkjema,
  byggSoknadSkjema,
  intervjuSvarSkjema,
  reiseplanSkjema,
  fyllTallSkjema,
  skrivSvarSkjema,
  finnIDokumentSkjema,
])

export const sceneSkjema = z.object({
  id: z.string().min(1),
  tittel: z.string().min(1),
  dag: z.string().min(1),
  klokkeslett: z.string().min(1),
  app: appIdSkjema,
  media: mediaSkjema,
  tekst: z.string().min(1),
  tekstPerPerson: z.record(z.string(), z.string().min(1)).optional(),
  varsel: varselSkjema.optional(),
  kalenderhendelse: kalenderhendelseSkjema.optional(),
  smsTraad: smsTraadSkjema.optional(),
  epost: epostSkjema.optional(),
  valg: z.array(valgSkjema),
  oppgaver: z.array(oppgaveSkjema).min(1),
  annonseId: z.string().optional(),
})

export const oppsummeringPunktSkjema = z.object({
  tekst: z.string().min(1),
  visHvisFlagg: z.string().optional(),
  visHvisIkkeFlagg: z.string().optional(),
})

export const episodeSkjema = z.object({
  id: z.string().min(1),
  nummer: z.number().int().positive(),
  tittel: z.string().min(1),
  ingress: z.string().min(1),
  startSceneId: z.string().min(1),
  tillatteFlagg: z.array(z.string().min(1)),
  ordIds: z.array(z.string().min(1)).optional(),
  oppsummering: z.array(oppsummeringPunktSkjema).optional(),
  scener: z.array(sceneSkjema).min(1),
})

export const matchFasitSkjema = z.enum(['passer', 'passer_ikke'])

export const matchKravSkjema = z.object({
  id: z.string().min(1),
  kategori: z.enum(['kompetanse', 'egenskaper', 'logistikk']),
  tekst: z.string().min(1),
  fasit: z.record(z.string(), matchFasitSkjema),
  forklaringPasser: z.string().min(1),
  forklaringPasserIkke: z.string().min(1),
})

export const annonseSkjema = z.object({
  id: z.string().min(1),
  tittel: z.string().min(1),
  bedrift: z.string().min(1),
  sted: z.string().min(1),
  kommune: z.enum(['molde', 'vestnes', 'aukra']),
  sone: z.enum(['kviltorp', 'aarolia', 'sentrum', 'aaro']),
  stillingsprosent: z.string().min(1),
  heltid: z.boolean(),
  soknadsfrist: z.string().min(1),
  tiltredelse: z.string().min(1),
  kontaktperson: z.string().min(1),
  sokkeord: z.array(z.string().min(1)).min(1),
  tekst: z.string().min(1),
  bilde: z.string().min(1),
  krav: z.array(matchKravSkjema).min(3),
})

export const annonserFilSkjema = z.object({
  annonser: z.array(annonseSkjema).min(6),
})

export const episodeOversiktSkjema = z.object({
  id: z.string().min(1),
  nummer: z.number().int().positive(),
  tittel: z.string().min(1),
  fil: z.string().nullable(),
})

export const scenarioSkjema = z.object({
  tittel: z.string().min(1),
  nivaa: z.string().min(1),
  sted: z.string().min(1),
  kurs: z.string().min(1),
  episoder: z.array(episodeOversiktSkjema).min(1),
})

export const personerFilSkjema = z.object({
  personer: z.array(personSkjema).min(1),
})

export const ordlisteFilSkjema = z.object({
  ord: z.array(ordSkjema).min(1),
})

export const holdeplassSkjema = z.object({
  id: z.string().min(1),
  navn: z.string().min(1),
  sone: z.enum(['kviltorp', 'aarolia', 'sentrum', 'aaro']),
})

export const linjeSkjema = z.object({
  id: z.string().min(1),
  nummer: z.string().min(1),
  navn: z.string().min(1),
})

export const bytteSkjema = z.object({
  sted: z.string().min(1),
  ankomst: z.string().min(1),
  avgang: z.string().min(1),
  linjeId: z.string().min(1),
})

export const avgangSkjema = z.object({
  id: z.string().min(1),
  linjeId: z.string().min(1),
  fra: z.string().min(1),
  til: z.string().min(1),
  avgang: z.string().regex(/^\d{2}:\d{2}$/),
  ankomst: z.string().regex(/^\d{2}:\d{2}$/),
  reisetidMin: z.number().int().positive(),
  bytte: bytteSkjema.nullable(),
})

export const reiseOppdragSkjema = z.object({
  fra: z.string().min(1),
  til: z.string().min(1),
  ankomst: z.string().regex(/^\d{2}:\d{2}$/),
  riktigAvgangId: z.string().min(1),
  bedrift: z.string().min(1),
})

export const ruterFilSkjema = z.object({
  holdeplasser: z.array(holdeplassSkjema).min(4),
  linjer: z.array(linjeSkjema).min(2),
  avganger: z.array(avgangSkjema).min(6),
  oppdrag: z.record(z.string(), reiseOppdragSkjema),
})

export const sluttUtfallSkjema = z.object({
  id: z.string().min(1),
  tittel: z.string().min(1),
  tekst: z.string().min(1),
  kreverFlagg: z.array(z.string().min(1)),
  unngaFlagg: z.array(z.string().min(1)),
})

export const sluttFilSkjema = z.object({
  tittel: z.string().min(1),
  ingress: z.string().min(1),
  bevisTittel: z.string().min(1),
  bevisTekst: z.string().min(1),
  utfall: z.array(sluttUtfallSkjema).min(3),
  reisePunkter: z.array(oppsummeringPunktSkjema).min(1),
})

export const trinnskattTrinnSkjema = z.object({
  fra: z.number().nonnegative(),
  sats: z.number().nonnegative(),
})

export const satserSkjema = z.object({
  aar: z.number().int().positive(),
  kilde: z.string().min(1),
  skattAlminneligSats: z.number().positive(),
  personfradrag: z.number().nonnegative(),
  minstefradragSats: z.number().positive(),
  minstefradragMaks: z.number().positive(),
  trygdeavgiftSats: z.number().positive(),
  trygdeavgiftNedre: z.number().nonnegative(),
  trygdeavgiftMaksAvOver: z.number().positive(),
  frikortgrense: z.number().positive(),
  frikortProsentOver: z.number().positive(),
  feriepengeSats: z.number().positive(),
  fagforeningAar: z.number().nonnegative(),
  fagforeningMaaned: z.number().nonnegative(),
  trinnskatt: z.array(trinnskattTrinnSkjema).min(1),
})

export const arbeidsgiverSkjema = z.object({
  navn: z.string().min(1),
  adresse: z.string().min(1),
  orgnr: z.string().min(1),
})

export const arbeidsforholdSkjema = z.object({
  skattekortType: z.enum(['frikort', 'tabell']),
  fodselsnummer: z.string().min(1),
  forventetInntektKort: z.number().nonnegative(),
  inntektHittil: z.number().nonnegative(),
  skattHittil: z.number().nonnegative(),
  tabellnummer: z.string().nullable(),
  timelonn: z.number().positive(),
  timerOrdinare: z.number().nonnegative(),
  overtidTimer: z.number().nonnegative(),
  overtidProsent: z.number().nonnegative(),
  kveldTimer: z.number().nonnegative(),
  kveldProsent: z.number().nonnegative(),
  stilling: z.string().min(1),
  stillingsprosent: z.number().positive(),
  ansattnummer: z.string().min(1),
  kontonummerSkjult: z.string().min(1),
  arbeidsgiver: arbeidsgiverSkjema,
})

export const arbeidFilSkjema = z.object({
  maaned: z.string().min(1),
  utbetalingsdato: z.string().min(1),
  maanederIgjen: z.number().int().positive(),
  engangskode: z.string().min(4),
  kontaktLonn: z.string().min(1),
  personer: z.record(z.string(), arbeidsforholdSkjema),
})
