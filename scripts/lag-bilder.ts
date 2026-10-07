import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

function esc(tekst: string): string {
  return tekst
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function svg(label: string, tittel: string, linje: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img" aria-label="${esc(label)}">
  <rect width="640" height="360" fill="#E8EEF2"/>
  <rect x="80" y="40" width="480" height="280" rx="16" fill="#fff" stroke="#003057" stroke-width="4"/>
  <rect x="80" y="40" width="480" height="56" rx="16" fill="#003057"/>
  <rect x="80" y="80" width="480" height="16" fill="#003057"/>
  <text x="320" y="76" text-anchor="middle" fill="#fff" font-family="Segoe UI, Arial" font-size="24" font-weight="700">${esc(tittel)}</text>
  <text x="320" y="200" text-anchor="middle" fill="#003057" font-family="Segoe UI, Arial" font-size="22">${esc(linje)}</text>
  <rect x="120" y="240" width="160" height="12" rx="6" fill="#EE9B00"/>
  <rect x="300" y="240" width="220" height="12" rx="6" fill="#005F73"/>
</svg>
`
}

const mappe = join(dirname(fileURLToPath(import.meta.url)), '../public/media/bilder')
mkdirSync(mappe, { recursive: true })

const filer: Array<[string, string, string, string]> = [
  ['e02-s01-epost.svg', 'E-post om oppdatert CV', 'E-post', 'Oppdatert CV'],
  ['e02-s02-cv.svg', 'Fire bokser til CV', 'CV', 'Erfaring · skole · språk'],
  ['e02-s03-egenskaper.svg', 'Egenskaper og eksempler', 'Egenskaper', 'Punktlig · blid · nøyaktig'],
  ['e02-s04-setninger.svg', 'Jeg har jobbet og jeg jobbet', 'CV-setninger', 'Jeg har jobbet …'],
  ['e02-s05-referanse.svg', 'E-post som ber om referanse', 'Referanse', 'En tidligere leder'],
  ['e02-s06-verb.svg', 'Preteritum og perfektum', 'Verb', 'jobbet / har jobbet'],
  ['e03-s01-portal.svg', 'Søkeside i jobbportalen', 'Jobbportal', 'Søkeord · sted · stilling'],
  ['e03-s02-sok.svg', 'Lagre søk og varsel', 'Lagre søk', 'Varsel er på'],
  ['e03-s03-treff.svg', 'Treffliste med nøkkelord', 'Treffliste', 'Frist · prosent · start'],
  ['e03-s04-annonse.svg', 'Annonsetekst med sammensatte ord', 'Annonse', 'lager + medarbeider'],
  ['e03-s05-dato.svg', 'Dato og stillingsprosent', 'Dato og tall', '15.11.2026 · 100 %'],
  ['e04-s01-magasin.svg', 'Jobbmagasinet med flere annonser', 'Jobbmagasinet', 'Sju øvingsannonser'],
  ['e04-s02-krav.svg', 'Må, bør og det er en fordel', 'Krav og ønske', 'må · bør · fordel'],
  ['e04-s03-match.svg', 'Tre deler i matchvurdering', 'Match', 'Kompetanse · egenskaper · reise'],
  ['e04-s04-lager.svg', 'Lagerjobb og førerkort', 'Fjordlager', 'Førerkort klasse B'],
  ['e04-s05-omsorg.svg', 'Omsorgsjobb i sentrum', 'Molde Omsorg', 'Deltid i sentrum'],
  ['e04-s06-valg.svg', 'Tre valgte stillinger', 'Velg jobber', '2 eller 3 stillinger'],
  ['annonse-havna.svg', 'Butikkmedarbeider Havna Handel', 'Havna Handel', 'Butikkmedarbeider'],
  ['annonse-fjordlager.svg', 'Lagermedarbeider Fjordlager', 'Fjordlager', 'Lagermedarbeider'],
  ['annonse-omsorg.svg', 'Assistent i hjemmetjenesten', 'Molde Omsorg', 'Assistent'],
  ['annonse-renhold.svg', 'Renholder Romsdals Renhold', 'Romsdals Renhold', 'Renholder'],
  ['annonse-kafe.svg', 'Kafémedarbeider Kviltorp', 'Kafé Fjordutsikt', 'Kafémedarbeider'],
  ['annonse-bygg.svg', 'Hjelpearbeider bygg', 'Bygg og Tre', 'Hjelpearbeider'],
  ['annonse-solsiden.svg', 'Miljøarbeider Solsiden bolig', 'Solsiden bolig', 'Miljøarbeider'],
  ['e05-s01-plan.svg', 'Aktivitetsplan med fire statuskolonner', 'Aktivitetsplan', 'Skal søke · frist'],
  ['e05-s02-dato.svg', 'Kalender med den 12. oktober', 'Dato', 'den 12. oktober'],
  ['e05-s03-skjema.svg', 'Skjema med stjerne ved status og frist', 'Registrer', 'Velg status *'],
  ['e05-s04-sms.svg', 'Melding til veileder Linn Holm', 'Melding', 'Hei Linn'],
  ['e05-s05-svar.svg', 'Linn svarer på meldingen', 'Svar', 'Søk innen datoen'],
  ['e06-s01-cv.svg', 'CV ved siden av en stillingsannonse', 'CV og annonse', 'Hva passer?'],
  ['e06-s02-match.svg', 'Matchvurdering av CV-punkter', 'Match', 'Kompetanse · egenskaper'],
  ['e06-s03-soknad.svg', 'Tre avsnitt i en jobbsøknad', 'Søknad', 'Innledning · hvorfor meg'],
  ['e06-s04-rett.svg', 'Søknadsutkast med en feil', 'Finn og rett', 'fordi jeg ikke har'],
  ['e06-s05-formelt.svg', 'Formelt og uformelt språk', 'Språk', 'Vennlig hilsen'],
  ['e07-s01-anrop.svg', 'Tapt anrop og talemelding', 'Tapt anrop', '1 talemelding'],
  ['e07-s02-sms.svg', 'SMS med innkalling til intervju', 'SMS', 'På tirsdag klokka 10'],
  ['e07-s03-svar.svg', 'Høflig bekreftelse på intervju', 'Bekreft', 'Jeg kommer gjerne'],
  ['e07-s04-avslag.svg', 'E-post med avslag fra en bedrift', 'Avslag', 'Takk for søknaden'],
  ['e07-s05-kalender.svg', 'Kalender med jobbintervju', 'Kalender', 'Tirsdag 10.00'],
  ['e08-s01-forbered.svg', 'Vanlige intervjuspørsmål på et ark', 'Forberedelse', 'Fortell om deg selv'],
  ['e08-s02-pakke.svg', 'Mappe med CV og ID-kort', 'Ta med', 'CV og ID'],
  ['e08-s03-intervju.svg', 'Intervju med Kari Strand', 'Intervju', 'Lytt og svar'],
  ['e08-s06-grammatikk.svg', 'Inversjon og perfektum', 'Setninger', 'I Ukraina jobbet jeg'],
  ['e08-s07-sporsmal.svg', 'Spørsmål til arbeidsgiveren', 'Ditt spørsmål', 'Hva er arbeidstiden?'],
  ['e09-s01-rute.svg', 'Fiktiv rutetabell i Molde', 'Reiseplanlegger', 'Linje · avgang · ankomst'],
  ['e09-s02-forsinkelse.svg', 'Varsel om forsinket buss', 'Forsinket', 'Si ifra til Kari'],
  ['e09-s03-svar.svg', 'SMS-svar fra Kari Strand', 'Beskjed', 'Takk for beskjeden'],
  ['e09-s04-avtale.svg', 'Forenklet arbeidsavtale', 'Avtale', '80 % · prøvetid'],
  ['e09-s05-forstedag.svg', 'Første arbeidsdag i resepsjonen', 'Første dag', 'God morgen'],
  ['e09-s06-klokka.svg', 'Klokka, sted og framtid', 'Grammatikk', 'skal · kommer til å'],
  ['e10-s01-sms.svg', 'SMS om å sjekke skattekortet', 'SMS', 'Sjekk skattekortet'],
  ['e10-s02-svindel.svg', 'Falsk skatte-SMS med merkelig lenke', 'Svindel', 'Feil adresse'],
  ['e10-s03-trygg.svg', 'Trygg innlogging bare på ekte adresse', 'Netvett', 'Riktig adresse'],
  ['e10-s04-login.svg', 'Innlogging i Skattøving', 'Skattøving', 'Logg inn'],
  ['e10-s05-tall.svg', 'Tall fra arbeidsavtalen', 'Tall', 'Månedslønn'],
  ['e10-s06-hvis.svg', 'Hvis du ikke endrer skattekortet', 'Hvis', 'For mye eller for lite'],
  ['e10-s07-bekreft.svg', 'Kvittering for nytt skattekort', 'Bekreft', 'Nytt skattekort'],
  ['e11-s01-epost.svg', 'E-post om at lønnsslippen er klar', 'E-post', 'Lønnsslippen er klar'],
  ['e11-s02-slipp.svg', 'Lønnsslipp med brutto trekk og netto', 'Lønnsslipp', 'Brutto · trekk · netto'],
  ['e11-s03-netto.svg', 'Feltet netto utbetalt', 'Netto', 'På konto'],
  ['e11-s04-regn.svg', 'Timer ganger timelønn', 'Regn', '128 × timelønn'],
  ['e11-s05-overtid.svg', 'Timeliste med overtid som mangler på slippen', 'Overtid', '4 timer mangler'],
  ['e11-s06-ferie.svg', 'Feriepenger 10,2 prosent', 'Feriepenger', '10,2 % neste år'],
  ['e11-s07-prep.svg', 'Per time, for november, hittil i år', 'Tid og beløp', 'per · for · hittil'],
]

for (const [navn, label, tittel, linje] of filer) {
  writeFileSync(join(mappe, navn), svg(label, tittel, linje), 'utf8')
}

console.log(`Skrev ${filer.length} plassholder-bilder til public/media/bilder`)
