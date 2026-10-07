# Jobbreisen

Digitalt, interaktivt scenariospill på bokmål for voksne innvandrere på CEFR-nivå A2. Kurset er MBO (Målrettet bedriftsopplæring) ved Molde voksenopplæringssenter.

**Øvingsversjon.** Alle bedrifter, personer, veiledere og rutetabeller er fiktive. Ingen ekte logoer, tjenestenavn eller kontaktopplysninger. Ingen personopplysninger samles inn. Eleven spiller en fiktiv person.

Lærerveiledning: se [LAERERVEILEDNING.md](LAERERVEILEDNING.md).

## Fase 1–6

Fase 1 leverer:

1. Innholdsmodell (TypeScript + Zod + JSON-skjema) og valideringsskript
2. Telefonramme med hjem, statuslinje, varsler, Meldinger, E-post og Kalender
3. Startskjerm med tre personer og valg av morsmål
4. Episode 1 «Melding til NAV-veilederen» med forgreining og åtte oppgavetyper
5. Ordkort med ukrainsk, engelsk og arabisk (arabisk med `dir="rtl"`)
6. Oppsummeringsside og læreroversikt over media (`?laerer=1`)

Fase 2 leverer:

1. Episode 2 «Hvem er jeg som arbeidstaker?» med CV, egenskaper og flagg `har_oppdatert_cv` / `cv_mangler_referanse`
2. Episode 3 «Finn jobber» med søk, lagret varsel og nøkkelord (`har_lagret_sok`)
3. Episode 4 «Passer jobben for meg?» med magasin, matchvurdering og `valgte_jobber`
4. Appene CV, Jobbportal og Jobbmagasinet
5. Gjenbrukbar matchvurdering (passer / passer ikke / vet ikke) til episode 6

Fase 3 leverer:

1. Episode 5 «Registrer i Aktivitetsplanen» med status, frist og melding til veileder (`aktiviteter_registrert`)
2. Episode 6 «Søk jobben» med match, søknadsavsnitt og finn-og-rett (`soknad_tilpasset`)
3. Episode 7 «Svar fra bedriftene» med tapt anrop, SMS, avslag og kalender (`intervju_bekreftet`, `intervju_i_kalender`)
4. Appen Aktivitetsplan (fire kolonner, aktivitetskort, øvingsbanner – uten ekte NAV-logo)

Fase 4 leverer:

1. Episode 8 «Jobbintervjuet» med forberedelse, simulert intervju (kort / langt / godt) og spørsmål til arbeidsgiver (`forberedt_intervju`)
2. Episode 9 «Reisen til jobb og første dag» med rute, forsinkelse-SMS, arbeidsavtale og første dag (`kom_presis`, `sendte_beskjed_om_forsinkelse`)
3. Appen Reiseplanlegger med fiktive linjer og holdeplasser i Molde (`ruter.json`)
4. Sluttutfall (3–4 avslutninger), samlet jobbreise og utskrivbart kursbevis med personens navn, episoder og dato (ingen elevdata lagres)

Fase 5 leverer:

1. Episode 10 «Ny jobb – nytt skattekort» med Skattøving (øvingsversjon, ikke skatteetaten.no), svindel-SMS og flagg `endret_skattekort` / `avslo_svindel`
2. Episode 11 «Den første lønnsslippen» med appen Lønn, bevisst manglende overtid og flagg `oppdaget_lonnsfeil`
3. Skattesatser i `satser-2026.json` og felles beregning for skattekort og lønnsslipp (`npm test`: 450 000 kr → 93 782 kr)
4. Sluttutfall og kursbevis etter episode 11 (flagg fra 10–11 teller med)

Fase 6 leverer:

1. WCAG AA-justeringer (fokus, etiketter, kontrast, hopp til innhold, 200 % zoom)
2. Responsiv layout på 360, 768 og 1280+ px uten horisontal sidescroll
3. Arabisk RTL i ordkort, A2-ordliste for uvanlige fagord
4. Lazy bilder og lyd som lastes ved avspilling
5. PWA / service worker til klasserom uten nett
6. `LAERERVEILEDNING.md` med elleve økter og kvalitetsfunn

## Kommandoer

```bash
npm install
npm run dev
npm run build
npm run preview
npm run valider
npm test
npm run lag-lyd
npm run lag-bilder
```

`npm run valider` stopper på manglende scener, døde valg, ukjente flagg, manglende oversettelser og manglende mediafiler.

## Arkitektur

Innholdet styrer spillet. Komponentene leser JSON. De inneholder ikke manus.

```
Scenario → Episode → Scene → { media, tekst, valg[], oppgaver[] }
Valg → { neste scene, flagg, tilbakemelding }
```

| Mappe | Innhold |
| --- | --- |
| `src/innhold/` | `scenario.json`, `personer.json`, `ordliste.json`, `annonser.json`, `ruter.json`, `slutt.json`, `satser-2026.json`, `arbeid.json`, `episoder/*.json` |
| `src/modell/` | Typer, Zod-skjema, JSON-skjema, mediahjelpere |
| `src/spill/` | Tilstand, localStorage (`jobbreisen-v1`), React-kontekst |
| `src/komponenter/` | Telefon, apper, oppgaver, ordkort, lydspiller |
| `public/media/bilder` | Illustrasjoner |
| `public/media/lyd` | Lydfiler |

Fremdrift lagres i `localStorage` i try/catch. Uten lagring virker økten likevel, uten minne ved neste besøk. Appen kaller ingen backend, ingen KI og ingen eksterne API-er.

Klikkbare ord i tekst skrives som `{{veileder}}` eller `{{veileder|veilederen}}` (id, deretter visning).

## Slik bytter læreren bilder og lyd

1. Se hvilke filer innholdet forventer: åpne appen med `?laerer=1` i adressen, for eksempel `http://localhost:5173/?laerer=1`.
2. Legg inn en ny fil med **samme filnavn** i `public/media/bilder` eller `public/media/lyd`.
3. Oppdater ikke JSON med mindre du også endrer filnavnet i innholdsfilen.

Navnekonvensjon for scener: `e01-s02-meldinger.svg`, `e01-s02-melding.wav`.

Manglende bilde viser en nøytral plassholder. Manglende lyd skjuler lydknappen. Appen krasjer ikke.

Lydspilleren har spill/pause, spol 5 sekunder tilbake, og hastighet 0,75× og 1×.

Plassholderlyd lages med `npm run lag-lyd`. Bytt dem ut med innspilte filer når de er klare.

## Publisering

Statiske filer. `base` i Vite er `./`, slik at bygget kan ligge på Vercel eller GitHub Pages.

```bash
npm run build
```

Last opp mappen `dist`.

Etter første besøk med nett kan appen brukes uten nett (service worker cacher sider, bilder og lyd etter hvert som de lastes). Installer som app fra nettleseren om dere vil.

Flagg fra ferdige episoder blir værende. Når du spiller en episode på nytt, nullstilles bare den episodens egne flagg.

## Hva som gjenstår

- Innspilte lydfiler og ferdige illustrasjoner (bytt plassholderfilene, se lærerveiledningen)
- Dra-og-slipp der det hører hjemme (reise)
