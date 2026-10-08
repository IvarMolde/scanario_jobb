# Lærerveiledning – Jobbreisen

Kort veiledning for MBO ved Molde voksenopplæringssenter. Nivå: A2, bokmål. Øvingsversjon: alle bedrifter, ruter, personer og skatteopplysninger er fiktive. Ingen elevdata lagres.

## Før første økt

1. PWA virker i **produksjonsbygg** (`npm run build` og `npm run preview`, eller utplassert side), ikke i `npm run dev`. Åpne appen én gang **med nett**, slik at bilder og lyd caches. Deretter kan klassen bruke den **uten nett**.
2. Sjekk bilder og lyd: `?laerer=1` i adressen, for eksempel `http://localhost:5173/?laerer=1`.
3. Elevene velger morsmål (ukrainsk, engelsk eller arabisk) til **ordkort**. Undervisningsspråket i spillet er norsk.
4. Elevene spiller en fiktiv person (Olena, Taras eller Sofiia). De bruker ikke eget navn.
5. Skattøving er **ikke** skatteetaten.no. Si det høyt før episode 10: «Vi logger aldri inn via en lenke i SMS.»

**Installere på nettbrett:** nettlesermeny → «Legg til på startskjerm» / «Installer app».

**Bytte bilder og lyd:** Legg inn en ny fil med **samme filnavn** i `public/media/bilder` eller `public/media/lyd`. JSON trenger ikke endres. Navn: `e01-s02-meldinger.svg`, `e01-s02-melding.wav`.

## Innspilling av lyd (logistikk)

Nå ligger det **plassholder-lyd** (korte toner). Bytt dem ut med innlest tale. Filnavnet styrer plasseringen. Du endrer ikke JSON.

1. Åpne innspillingslista: `?laerer=1` (fane **Innspilling**), eller filen `INNSPILLING.md`.
2. Filtrer på én episode. Les teksten som står under filnavnet. Det er det eleven hører på det stedet.
3. Ta opp med telefon eller datamaskin. Snakk sakte, tydelig, bokmål, A2. Pause mellom setninger.
4. Eksporter som **`mp3`** (anbefalt i nettleseren) eller `wav` (16-bit PCM, 44100 Hz, mono). **Filnavn og endelse må stemme med JSON**, for eksempel `olena-presentasjon.mp3`.
5. Legg fila i `public/media/lyd` og overskriv plassholderen.
6. Sjekk i spillet: knappen «Lytt til teksten» på scenen, «Lytt» på lytt-oppgaver, «Spørsmål fra intervjueren» i episode 8.

Tre slags klipp:

| Rolle | Hva du leser | Hvor det spilles |
| --- | --- | --- |
| Scene | Sceneteksten (uten klammer) | «Lytt til teksten» |
| Intervju | Bare spørsmålet fra Kari | Episode 8, oppgaven |
| Annen stemme | Eget manus (talemelding, kollega) | Lytt-oppgave eller scene med `manus` |

Startskjermen har tre personklipp (`olena-presentasjon.mp3` og så videre).

Oppdater lista etter innholdsendringer: `npm run lydmanus`.

**Bytte skattesatser:** Rediger `src/innhold/satser-2026.json` (kilde står i fila). Kjør `npm test` og `npm run valider`.

## Tid og mål

Regn 20–25 minutter per episode i klassen, pluss 5–10 minutter før og etter. Hele løpet: omtrent elleve økter.

| Ep. | Tittel | Læringsmål | Grammatikk | Tid |
| --- | --- | --- | --- | --- |
| 1 | Melding til NAV-veilederen | Lese kalender. Sende høflig SMS. | *Jeg kommer*, spørreord | 20 min |
| 2 | Hvem er jeg som arbeidstaker? | Sortere CV. Velge egenskaper. | Perfektum / preteritum | 25 min |
| 3 | Finn jobber | Søke, lagre varsel, lese nøkkelord. | Dato, prosent, sammensatte ord | 20 min |
| 4 | Passer jobben for meg? | Match: kompetanse, egenskaper, logistikk. | *må / kan / bør* | 25 min |
| 5 | Registrer i Aktivitetsplanen | Status, frist, melding til veileder. | Dato, *innen* | 20 min |
| 6 | Søk jobben | Match mot CV. Bygge søknad. | *fordi*, formelt språk | 25 min |
| 7 | Svar fra bedriftene | Tapt anrop, bekrefte intervju, avslag. | *på tirsdag, klokka ti, om morgenen* | 20 min |
| 8 | Jobbintervjuet | Gode svar. Spørsmål til arbeidsgiver. | Inversjon, perfektum | 25 min |
| 9 | Reisen til jobb og første dag | Buss med buffer, SMS ved forsinkelse, avtale. | Klokka, preposisjoner, *skal* / *kommer til å* | 25 min |
| 10 | Ny jobb – nytt skattekort | Innlogging, skattekort, svindel-SMS. | Store tall, sammensatte ord, *hvis* + inversjon, *må* + infinitiv | 25 min |
| 11 | Den første lønnsslippen | Brutto/netto, trekk, overtid, feriepenger, høflig e-post. | Ganger/minus/prosent av, *per* / *for* / *hittil i år* | 25 min |

## Før og etter hver episode

**Før:** Les tittelen høyt. Gå gjennom 4–6 ord i ordlisten (klikkbare ord i teksten). Si hva eleven skal *gjøre*, ikke bare hva de skal *lese*.

**Etter:** Eleven viser oppsummeringen (eller kursbeviset etter episode 11). To spørsmål i plenum: «Hva gjorde personen?» og «Hvilken setning tar du med deg?»

Forslag per episode:

| Ep. | Før | Etter |
| --- | --- | --- |
| 1 | Øv «Hei Linn. Jeg kommer …» på tavla. | Sammenlign høflig og kort SMS. |
| 2 | Tre kort: erfaring, skole, språk. | Si én setning: *Jeg har jobbet …* |
| 3 | Vis et fiktivt søk: sted + søkeord. | Les frist og stillingsprosent høyt. |
| 4 | «Passer / passer ikke» med to eksempler. | Hvorfor valgte du disse jobbene? |
| 5 | Tegn fire kolonner på tavla. | Si fristen med *innen*. |
| 6 | Tre avsnitt: innledning, hvorfor, avslutning. | Les søknaden høyt. Er den formell? |
| 7 | Lytt: tapt anrop. Hva gjør du? | Legg en avtale i en papirkalender. |
| 8 | Tre svar: kort, for langt, godt. | Eleven stiller ett spørsmål til «sjefen». |
| 9 | Klokka + «ti minutter før». | Les stillingsprosent, arbeidstid, prøvetid og månedslønn. |
| 10 | Vis tre faretegn: feil adresse, hastverk, «send koden». | Si: *Hvis du tjener mer, må du endre skattekortet.* |
| 11 | Skriv 128 × timelønn på tavla. | Les netto høyt. Hva gjør du når overtiden mangler? |

## Flagg og slutt

Flagg viser valg eleven tok (høflig SMS, forberedt intervju, kom i rett tid, endret skattekort). Når eleven spiller en episode på nytt, nullstilles **bare den episodens flagg**. Flagg fra episode 10 (`endret_skattekort`, `avslo_svindel`) blir værende i episode 11, slik at lønnsslippen viser konsekvensen i kroner.

Etter episode 11: fire mulige sluttutfall og et utskrivbart kursbevis med personens navn, episoder og dato. Ingen elevnavn lagres.

## Tilgjengelighet i klassen

- Tekst kan forstørres til 200 % (nettleser-zoom). Layouten skal ikke scrolle sidelengs.
- Ordkort på arabisk vises høyre-til-venstre.
- Hopp til innhold / Hopp til oppgaven: Tab fra toppen av siden.
- Lyd: spill, pause, −5 s, 0,75×.

## Kvalitetsgjennomgang (fase 6)

| Problem | Alvorlighet | Rettet |
| --- | --- | --- |
| Print-CSS skjulte hele telefonrammen, så lønnsslippen ikke kunne skrives ut | høy | ja |
| Fyll-tall blandet alternativene på nytt ved hver render | middels | ja |
| Klikkbare felt i skattekort/lønnsslipp manglet `aria-label` og `aria-pressed` | middels | ja |
| Innlogging i Skattøving: input uten `id`/`htmlFor` | lav | ja |
| Fagforening-avkryssing uten 44 px treffflate | lav | ja |
| `visHvisFlagg` fra tidligere episode i `tillatteFlagg` ville slettet valget ved replay av e11 | høy | ja (e11 har ikke `endret_skattekort` i tillatteFlagg; validering sjekker rekkefølge) |
| Kursbevis etter e09, før skattekort og lønn | høy | ja (flyttet til etter e11) |
| Manglende media for e10–e11 | høy | ja (plassholdere) |
| 11 app-ikoner på 360 px: tekst kan bli tett | lav | ja (ellipsis, 3 kolonner, `overflow-wrap`) |
| Kontrast amber på hvit i valgknapper | info | ja fra før (MBO-farger, fokusring) |
| Arabisk RTL bare på oversettelsen, ikke hele kortet | info | nei – bevisst: norsk forklaring skal leses venstre-til-høyre |
| PWA cacher ikke alt før første besøk | info | nei – forventet: åpne med nett én gang |
| Forenklet skatt (ingen formue, rentefradrag, ungdomsfradrag, innsatssone) | info | ja – vises i appen |

## Mal for justering etter test i klassen

Bruk denne når du har testet en episode med elevene. Konkrete observasjoner gir mye bedre resultat enn generelle ønsker.

```
Vi har testet episode [nr] med [antall] elever på A2. Gjør disse endringene
uten å endre arkitekturen:

Observasjoner:
- [Hvor elevene stoppet opp, og hvorfor]
- [Instruksjoner som ikke ble forstått]
- [Oppgaver som var for lette eller for vanskelige]
- [Tidsbruk: faktisk antall minutter]

Ønskede endringer:
- [Konkret endring 1]
- [Konkret endring 2]
```

Oppdater valideringsskriptet (`npm run valider`) hvis innholdsmodellen endres.
