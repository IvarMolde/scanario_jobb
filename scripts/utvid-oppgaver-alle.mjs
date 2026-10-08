/**
 * Fyller hver scene opp til 5 oppgaver.
 * Spesialoppgaver som navigerer eller er «hovedøvelse» legges sist.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const SPECIAL = new Set([
  'bygg_melding',
  'sorter_kategori',
  'egenskap_kobling',
  'cv_valg',
  'portal_sok',
  'match_sjekkliste',
  'registrer_aktiviteter',
  'bygg_soknad',
  'velg_jobber',
  'intervju_svar',
  'reiseplan',
  'fyll_tall',
  'finn_i_dokument',
])

const fv = (id, spoersmal, alternativer, riktigId, ok, feil) => ({
  type: 'flervalg',
  id,
  instruksjon: 'Velg det riktige svaret.',
  spoersmal,
  alternativer: alternativer.map(([i, tekst]) => ({ id: i, tekst })),
  riktigId,
  tilbakemeldingRiktig: ok,
  tilbakemeldingFeil: feil,
})

const su = (id, paastand, riktigErSant, ok, feil) => ({
  type: 'sant_usant',
  id,
  instruksjon: 'Les påstanden. Velg sant eller usant.',
  paastand,
  riktigErSant,
  tilbakemeldingRiktig: ok,
  tilbakemeldingFeil: feil,
})

const ob = (id, setning, ord, riktig, ok, feil) => ({
  type: 'ordbank',
  id,
  instruksjon: 'Velg ordet som passer i setningen.',
  setning,
  ord,
  riktig,
  tilbakemeldingRiktig: ok,
  tilbakemeldingFeil: feil,
})

const ss = (id, biter, ok, feil) => ({
  type: 'sorter_setning',
  id,
  instruksjon: 'Trykk på ordene i riktig rekkefølge.',
  biter,
  tilbakemeldingRiktig: ok,
  tilbakemeldingFeil: feil,
})

const ma = (id, par, ok, feil) => ({
  type: 'matching',
  id,
  instruksjon: 'Trykk på ordet, og velg forklaringen som passer.',
  par: par.map(([i, venstre, hoyre]) => ({ id: i, venstre, hoyre })),
  tilbakemeldingRiktig: ok,
  tilbakemeldingFeil: feil,
})

const fr = (id, tekst, feilOrd, alternativer, riktigId, ok, feil) => ({
  type: 'finn_og_rett',
  id,
  instruksjon: 'Klikk på ordet som er feil. Velg deretter riktig form.',
  tekst,
  feilOrd,
  alternativer: alternativer.map(([i, t]) => ({ id: i, tekst: t })),
  riktigId,
  tilbakemeldingRiktig: ok,
  tilbakemeldingFeil: feil,
})

/** @type {Record<string, object[]>} */
const extras = {
  // —— Episode 1 ——
  'e01-s01': [
    ob('e01-s01-ob1', 'Møtet med Linn står i _____.', ['kalenderen', 'kjøleskapet', 'bussen'], 'kalenderen', 'Riktig. Du finner møtet i kalenderen.', 'Se på kalenderen på telefonen.'),
    su('e01-s01-su2', 'Linn Holm er veileder hos NAV.', true, 'Riktig. Linn Holm er NAV-veilederen din.', 'Linn er veilederen du skal møte.'),
    ss('e01-s01-ss1', ['Møtet', 'er', 'i', 'morgen', 'klokka', '10.00.'], 'Riktig. Slik sier vi tidspunktet klart.', 'Prøv igjen: Møtet er i morgen klokka 10.00.'),
  ],
  'e01-s02': [
    fv('e01-s02-fv1', 'Hvilken start er mest høflig i en melding til veilederen?', [['a', 'Hva skjer'], ['b', 'Kunne du …'], ['c', 'Du må']], 'b', 'Riktig. «Kunne du …» er en høflig måte å spørre på.', 'Til en veileder er «Kunne du …» eller «Jeg vil gjerne …» bedre.'),
    su('e01-s02-su1', '«Jeg vil gjerne» er en høflig måte å si hva du ønsker.', true, 'Riktig. «Gjerne» gjør setningen mykere og mer høflig.', 'Teksten anbefaler «Jeg vil gjerne …».'),
    ma('e01-s02-ma1', [['p1', 'høflig', 'snill og respektfull i språket'], ['p2', 'bekrefte', 'si at noe stemmer eller at du kommer']], 'Riktig. Disse ordene er viktige i meldingen.', 'Les teksten om høflig melding en gang til.'),
  ],
  'e01-s03': [
    fv('e01-s03-fv1', 'Hva bør en høflig melding til Linn inneholde?', [['a', 'Bare ett ord: ok'], ['b', 'Hilsen, tydelig innhold og vennlig avslutning'], ['c', 'Bare emojis']], 'b', 'Riktig. Hei, hele setninger og vennlig hilsen.', 'En veileder trenger hilsen, innhold og avslutning.'),
    ob('e01-s03-ob1', 'En _____ melding har hei og hele setninger.', ['høflig', 'sint', 'tom'], 'høflig', 'Riktig. En høflig melding er tydelig og vennlig.', 'Teksten sier at en høflig melding har hei og hele setninger.'),
    su('e01-s03-su1', '«Bye» er en god avslutning til NAV-veilederen.', false, 'Riktig. «Vennlig hilsen» eller «Hilsen» er bedre.', 'Til en veileder bruker vi vanligvis norsk avslutning, ikke «Bye».'),
    ss('e01-s03-ss1', ['Hei', 'Linn,', 'jeg', 'vil', 'gjerne', 'bekrefte', 'møtet.'], 'Riktig. Dette er en høflig start på meldingen.', 'Start med Hei Linn, deretter jeg vil gjerne bekrefte møtet.'),
  ],
  'e01-s04a': [
    ob('e01-s04a-ob1', 'Linn _____ møtet i morgen.', ['bekrefter', 'glemmer', 'avlyser'], 'bekrefter', 'Riktig. Hun sier ja til tiden.', 'Les SMS-en. Linn sier ja til møtet.'),
    su('e01-s04a-su1', 'Linn skriver at møtet er avlyst.', false, 'Riktig. Hun bekrefter møtet i morgen klokka 10.00.', 'Linn sier: «Ja, vi møtes i morgen klokka 10.00.»'),
    fv('e01-s04a-fv1', 'Hvilken dag er møtet?', [['a', 'I dag'], ['b', 'I morgen'], ['c', 'Neste uke']], 'b', 'Riktig. Møtet er i morgen.', 'SMS-en sier «i morgen».'),
  ],
  'e01-s04b': [
    ob('e01-s04b-ob1', 'Linn ber om en _____ melding.', ['tydeligere', 'lengre', 'sint'], 'tydeligere', 'Riktig. Hun forstår ikke den korte meldingen.', 'Linn spør om en tydeligere melding.'),
    su('e01-s04b-su1', 'En uklar melding kan gjøre at veilederen må spørre på nytt.', true, 'Riktig. Derfor trenger meldingen tid og tydelig språk.', 'Når meldingen er uklar, spør Linn på nytt.'),
    ss('e01-s04b-ss1', ['Kan', 'du', 'sende', 'en', 'tydeligere', 'melding?'], 'Riktig. Slik spør Linn høflig.', 'Prøv igjen: Kan du sende en tydeligere melding?'),
    ma('e01-s04b-ma1', [['p1', 'uklar', 'vanskelig å forstå'], ['p2', 'tydelig', 'lett å forstå']], 'Riktig. Nå skiller du mellom uklar og tydelig.', 'Tenk på hva Linn trenger for å forstå deg.'),
  ],
  'e01-s05': [
    fv('e01-s05-fv1', 'Hvilken form er riktig: «Jeg _____ i morgen.»', [['a', 'komme'], ['b', 'kommer'], ['c', 'å komme']], 'b', 'Riktig. Etter jeg sier vi «kommer» i presens.', 'Etter jeg får verbet ofte -er: kommer.'),
    su('e01-s05-su1', 'I setningen «Jeg komme i morgen» er verbet feil.', true, 'Riktig. Det skal være «jeg kommer».', '«Komme» uten -r er feil etter jeg.'),
    ob('e01-s05-ob1', 'Jeg _____ i morgen klokka 10.00.', ['kommer', 'komme', 'kommet'], 'kommer', 'Riktig. Presens: jeg kommer.', 'Husk -er etter jeg i presens.'),
    ss('e01-s05-ss1', ['Jeg', 'kommer', 'i', 'morgen', 'klokka', '10.00.'], 'Riktig. Nå er setningen korrekt.', 'Prøv igjen: Jeg kommer i morgen klokka 10.00.'),
  ],

  // —— Episode 3 ——
  'e03-s01': [
    ob('e03-s01-ob1', 'Du skal søke jobb i en _____.', ['jobbportal', 'bakeri', 'kino'], 'jobbportal', 'Riktig. Jobbportalen er stedet du søker.', 'Teksten handler om jobbportalen.'),
    su('e03-s01-su2', 'I en jobbportal kan du søke med søkeord, sted og type stilling.', true, 'Riktig. Det er vanlige felt i et jobbsøk.', 'Les teksten om hvordan du søker.'),
    ma('e03-s01-ma1', [['p1', 'annonse', 'tekst om en ledig jobb'], ['p2', 'stilling', 'en jobb du kan søke på'], ['p3', 'frist', 'siste dag du kan søke']], 'Riktig. Dette er viktige ord i jobbsøk.', 'Les forklaringene i episoden.'),
  ],
  'e03-s02': [
    fv('e03-s02-fv1', 'Hvorfor er det lurt å lagre et søk?', [['a', 'Da kan du få varsel om nye jobber'], ['b', 'Da sletter du CVen'], ['c', 'Da betaler du skatt']], 'a', 'Riktig. Et lagret søk kan gi varsel.', 'Når søket er lagret, kan du følge med på nye treff.'),
    ob('e03-s02-ob1', 'Jeg vil _____ søket mitt.', ['lagre', 'glemme', 'spise'], 'lagre', 'Riktig. Du lagrer søket i portalen.', 'Oppgaven handler om å lagre søket.'),
    su('e03-s02-su1', 'Du bør velge søkeord som passer jobben du vil ha.', true, 'Riktig. Gode søkeord gir bedre treff.', 'Tenk på yrket og stedet når du søker.'),
    ss('e03-s02-ss1', ['Jeg', 'har', 'lagret', 'søket', 'mitt.'], 'Riktig. Perfektum: har lagret.', 'Prøv igjen: Jeg har lagret søket mitt.'),
  ],
  'e03-s03': [
    fv('e03-s03-fv1', 'Hva er et nøkkelord i en treffliste?', [['a', 'Et viktig ord som sier noe om jobben'], ['b', 'Et passord til Facebook'], ['c', 'Navnet på bussen']], 'a', 'Riktig. Nøkkelord hjelper deg å forstå annonsen raskt.', 'Nøkkelord er viktige ord i trefflisten.'),
    ob('e03-s03-ob1', 'Se på _____ før du åpner annonsen.', ['nøkkelordene', 'værmeldingen', 'filmen'], 'nøkkelordene', 'Riktig. Nøkkelord gir deg rask info.', 'Teksten handler om nøkkelord i trefflisten.'),
    su('e03-s03-su1', 'Frist forteller hvor mye du tjener i måneden.', false, 'Riktig. Frist er siste dag du kan søke.', 'Frist er en dato, ikke lønn.'),
    ss('e03-s03-ss1', ['Søknadsfristen', 'er', 'den', '15.', 'november.'], 'Riktig. Slik kan du si en frist.', 'Prøv igjen med datoen i riktig rekkefølge.'),
  ],
  'e03-s04': [
    su('e03-s04-su1', 'En stillingsannonse forteller hva arbeidsgiveren søker.', true, 'Riktig. Annonsen beskriver jobben og kravene.', 'Les annonsen for å se hva som kreves.'),
    ob('e03-s04-ob2', 'I annonsen står det ofte hvilke _____ du må ha.', ['krav', 'ferier', 'filmer'], 'krav', 'Riktig. Krav er det arbeidsgiveren må ha.', 'Se etter ord som må, bør og krav.'),
    ss('e03-s04-ss1', ['Jeg', 'har', 'lest', 'annonsen', 'nøye.'], 'Riktig. Perfektum: har lest.', 'Prøv igjen: Jeg har lest annonsen nøye.'),
  ],
  'e03-s05': [
    ob('e03-s05-ob1', 'Søknadsfristen er en _____.', ['dato', 'buss', 'farge'], 'dato', 'Riktig. Frist er en dato.', 'Frist forteller hvilken dag du må søke innen.'),
    fv('e03-s05-fv2', 'Hva betyr 100 % stilling?', [['a', 'Fulltid'], ['b', 'Halv tid'], ['c', 'Ingen jobb']], 'a', 'Riktig. 100 % er vanligvis fulltid.', 'Prosenten viser hvor stor stillingen er.'),
    ss('e03-s05-ss1', ['Jobben', 'starter', 'den', '1.', 'desember.'], 'Riktig. Slik sier vi startdato.', 'Prøv igjen med datoen på slutten.'),
  ],

  // —— Episode 4 ——
  'e04-s01': [
    ob('e04-s01-ob1', 'I jobbmagasinet finner du flere _____.', ['annonser', 'oppskrifter', 'filmer'], 'annonser', 'Riktig. Magasinet viser øvingsannonser.', 'Jobbmagasinet handler om stillingsannonser.'),
    su('e04-s01-su2', 'Du bør lese flere annonser før du velger jobb.', true, 'Riktig. Da kan du sammenligne.', 'Episoden handler om å se på flere jobber.'),
    ma('e04-s01-ma1', [['p1', 'annonse', 'tekst om ledig stilling'], ['p2', 'arbeidsgiver', 'bedriften som søker folk']], 'Riktig. Viktige ord i jobbmagasinet.', 'Les forklaringene en gang til.'),
  ],
  'e04-s02': [
    fv('e04-s02-fv1', 'Hva betyr «må» i en annonse?', [['a', 'Et krav du skal oppfylle'], ['b', 'Et ønske som er helt valgfritt'], ['c', 'At jobben er ferdig']], 'a', 'Riktig. «Må» er et krav.', 'Skill mellom må, bør og det er en fordel.'),
    ob('e04-s02-ob1', '«Det er en fordel» betyr at noe er _____, men ikke et hardt krav.', ['bra', 'forbudt', 'umulig'], 'bra', 'Riktig. En fordel er positivt, men ikke alltid nødvendig.', 'Fordel er noe arbeidsgiveren liker.'),
    su('e04-s02-su1', '«Bør» er sterkere enn «må».', false, 'Riktig. «Må» er sterkere. «Bør» er et ønske.', 'Må = krav. Bør = ønske.'),
  ],
  'e04-s03': [
    fv('e04-s03-fv1', 'Hva sjekker du når du matcher en butikkjobb?', [['a', 'Kompetanse, egenskaper og reise'], ['b', 'Bare favorittfarge'], ['c', 'Bare vær']], 'a', 'Riktig. Match har flere deler.', 'Se på kompetanse, egenskaper og logistikk.'),
    ob('e04-s03-ob1', 'Kundebehandling er viktig i _____.', ['butikk', 'skogen', 'flyet'], 'butikk', 'Riktig. Butikkjobb handler ofte om kunder.', 'Tenk på hva en butikkmedarbeider gjør.'),
    su('e04-s03-su1', 'Hvis jobben ligger langt unna, må du tenke på reise.', true, 'Riktig. Reise er en del av match.', 'Logistikk handler også om veien til jobb.'),
    ss('e04-s03-ss1', ['Denne', 'jobben', 'passer', 'ganske', 'godt.'], 'Riktig. Slik kan du oppsummere en match.', 'Prøv igjen: Denne jobben passer ganske godt.'),
  ],
  'e04-s04': [
    fv('e04-s04-fv1', 'Hva trenger du ofte på lager?', [['a', 'Førerkort eller styrke til å løfte'], ['b', 'Bare sangstemme'], ['c', 'Bare en sykkelhjelm til kontoret']], 'a', 'Riktig. Lagerjobb kan kreve førerkort eller fysisk arbeid.', 'Les annonsen om lagerkrav.'),
    ob('e04-s04-ob1', 'På lageret _____ jeg tunge esker.', ['løfter', 'synger', 'baker'], 'løfter', 'Riktig. Løfte er vanlig på lager.', 'Tenk på typiske lageroppgaver.'),
    su('e04-s04-su1', 'Førerkort klasse B kan være et krav i lagerjobb.', true, 'Riktig. Noen lagerjobber krever bil.', 'Sjekk kravene i annonsen.'),
    ss('e04-s04-ss1', ['Jeg', 'har', 'førerkort', 'klasse', 'B.'], 'Riktig. Dette kan stå i CVen.', 'Prøv igjen: Jeg har førerkort klasse B.'),
  ],
  'e04-s05': [
    fv('e04-s05-fv1', 'Hva er viktig i omsorgsjobb?', [['a', 'Omsorg, tålmodighet og ansvar'], ['b', 'Bare å løpe fort'], ['c', 'Bare å lage mat til seg selv']], 'a', 'Riktig. Omsorgsyrker handler om å hjelpe andre.', 'Tenk på egenskaper i hjemmetjenesten.'),
    ob('e04-s05-ob1', 'Jeg er _____ når jeg forklarer sakte til brukeren.', ['tålmodig', 'sint', 'sen'], 'tålmodig', 'Riktig. Tålmodig passer godt i omsorg.', 'Tålmodig betyr at du venter og forklarer rolig.'),
    su('e04-s05-su1', 'Deltid kan bety at du jobber mindre enn 100 %.', true, 'Riktig. Deltid er ikke full stilling.', 'Les annonsen om stillingsprosent.'),
    ss('e04-s05-ss1', ['Jeg', 'har', 'hjulpet', 'eldre', 'hjemme.'], 'Riktig. En god erfaring i omsorg.', 'Prøv igjen: Jeg har hjulpet eldre hjemme.'),
  ],
  'e04-s06': [
    fv('e04-s06-fv1', 'Hvor mange jobber skal du velge?', [['a', 'To eller tre'], ['b', 'Null'], ['c', 'Tjue']], 'a', 'Riktig. Du skal velge 2 eller 3 stillinger.', 'Instruksen sier to eller tre jobber.'),
    ob('e04-s06-ob1', 'Jeg _____ to jobber jeg vil søke på.', ['velger', 'glemmer', 'sletter'], 'velger', 'Riktig. Nå velger du jobber.', 'Oppgaven er å velge jobber.'),
    su('e04-s06-su1', 'Det er lurt å velge jobber som passer deg.', true, 'Riktig. Match og interesse styrer valget.', 'Velg jobber du faktisk kan søke på.'),
    ss('e04-s06-ss1', ['Jeg', 'vil', 'gjerne', 'søke', 'på', 'disse', 'jobbene.'], 'Riktig. En høflig og tydelig setning.', 'Prøv igjen med «vil gjerne».'),
  ],

  // —— Episode 5 ——
  'e05-s01': [
    ob('e05-s01-ob1', 'I Aktivitetsplanen registrerer du _____.', ['aktiviteter', 'oppskrifter', 'filmer'], 'aktiviteter', 'Riktig. Planen viser hva du skal gjøre i jobbsøket.', 'Aktivitetsplanen handler om jobbsøk-aktiviteter.'),
    su('e05-s01-su2', 'Status forteller hvor langt du har kommet med en jobb.', true, 'Riktig. For eksempel «skal søke» eller «sendt søknad».', 'Status er et viktig felt i planen.'),
    ma('e05-s01-ma1', [['p1', 'frist', 'siste dag for å søke'], ['p2', 'status', 'hvor langt du har kommet']], 'Riktig. Frist og status brukes i planen.', 'Les forklaringene en gang til.'),
  ],
  'e05-s02': [
    fv('e05-s02-fv1', 'Hvilken preposisjon passer: «møtet er _____ tirsdag»?', [['a', 'på'], ['b', 'under'], ['c', 'mellom']], 'a', 'Riktig. Vi sier «på tirsdag».', 'Med ukedag bruker vi ofte «på».'),
    su('e05-s02-su1', 'Vi sier «den 12. oktober» om en dato.', true, 'Riktig. Slik sier vi dato på norsk.', 'Husk «den» foran datoen.'),
    ma('e05-s02-ma1', [['p1', 'på', 'brukes ofte med ukedag'], ['p2', 'den', 'brukes ofte foran dato']], 'Riktig. På + dag, den + dato.', 'Tenk på eksemplene i teksten.'),
  ],
  'e05-s03': [
    fv('e05-s03-fv1', 'Hva må du fylle inn når du registrerer en aktivitet?', [['a', 'Status og frist'], ['b', 'Bare favorittmat'], ['c', 'Bare skostørrelse']], 'a', 'Riktig. Status og frist er viktige felt.', 'Se på skjemaet i Aktivitetsplanen.'),
    ob('e05-s03-ob1', 'Statusen «skal søke» betyr at du _____ har søkt.', ['ikke', 'alltid', 'aldri skal'], 'ikke', 'Riktig. «Skal søke» er før du sender søknaden.', 'Les statusene nøye.'),
    su('e05-s03-su1', 'Det er viktig å registrere riktig frist.', true, 'Riktig. Da husker du siste søknadsdag.', 'Frist hjelper deg å søke i tide.'),
    ss('e05-s03-ss1', ['Jeg', 'har', 'registrert', 'aktiviteten', 'i', 'planen.'], 'Riktig. Perfektum: har registrert.', 'Prøv igjen: Jeg har registrert aktiviteten i planen.'),
  ],
  'e05-s04': [
    fv('e05-s04-fv1', 'Hva skal meldingen til Linn handle om?', [['a', 'At du har registrert aktiviteter'], ['b', 'At du vil ha gratis pizza'], ['c', 'At bussen er blå']], 'a', 'Riktig. Du melder fra om aktivitetsplanen.', 'Les oppgaven om melding til Linn.'),
    ob('e05-s04-ob1', 'Hei Linn, jeg har _____ aktivitetene.', ['registrert', 'spist', 'slettet'], 'registrert', 'Riktig. Du forteller at planen er oppdatert.', 'Bruk et verb som passer til Aktivitetsplanen.'),
    su('e05-s04-su1', 'En melding til veilederen bør være høflig og tydelig.', true, 'Riktig. Hei, innhold og hilsen.', 'Husk høflig språk til Linn.'),
    ss('e05-s04-ss1', ['Jeg', 'har', 'lagt', 'inn', 'fristen', 'i', 'planen.'], 'Riktig. Tydelig melding om det du har gjort.', 'Prøv igjen med har lagt inn.'),
  ],
  'e05-s05': [
    fv('e05-s05-fv1', 'Hva ber Linn deg ofte huske?', [['a', 'Å søke innen fristen'], ['b', 'Å glemme planen'], ['c', 'Å slette CVen']], 'a', 'Riktig. Frist er viktig i jobbsøk.', 'Les svaret fra Linn.'),
    ob('e05-s05-ob1', 'Søk _____ datoen.', ['innen', 'uten', 'bak'], 'innen', 'Riktig. «Innen» betyr før fristen er ute.', 'Linn snakker om å søke i tide.'),
    ss('e05-s05-ss1', ['Takk', 'for', 'meldingen,', 'hilsen', 'Linn.'], 'Riktig. En kort og høflig avslutning.', 'Prøv igjen: Takk for meldingen, hilsen Linn.'),
    ma('e05-s05-ma1', [['p1', 'innen', 'før en frist'], ['p2', 'aktivitet', 'noe du skal gjøre i planen']], 'Riktig. Nyttige ord i svaret fra Linn.', 'Les forklaringene en gang til.'),
  ],

  // —— Episode 6 ——
  'e06-s01': [
    ob('e06-s01-ob1', 'I søknaden skriver du hvorfor _____ passer for deg.', ['jobben', 'været', 'filmen'], 'jobben', 'Riktig. Søknaden kobler deg til stillingen.', 'Tenk på match mellom deg og annonsen.'),
    su('e06-s01-su1', 'Det er lurt å bruke ord fra annonsen i søknaden.', true, 'Riktig. Da viser du at du har lest kravene.', 'Les annonsen før du skriver.'),
    ma('e06-s01-ma1', [['p1', 'søknad', 'brev der du ber om jobben'], ['p2', 'kompetanse', 'det du kan fra jobb og kurs']], 'Riktig. Viktige ord før du skriver søknad.', 'Les forklaringene en gang til.'),
  ],
  'e06-s02': [
    fv('e06-s02-fv1', 'Hva gjør du i en match mot annonsen?', [['a', 'Sjekker hva som passer og ikke passer'], ['b', 'Sletter annonsen med en gang'], ['c', 'Ignorerer alle krav']], 'a', 'Riktig. Du vurderer kompetanse, egenskaper og mer.', 'Match handler om å sammenligne deg og jobben.'),
    ob('e06-s02-ob1', 'Denne erfaringen _____ godt til annonsen.', ['passer', 'synger', 'sover'], 'passer', 'Riktig. «Passer» er et viktig ord i match.', 'Tenk på om CV-en møter kravene.'),
    su('e06-s02-su1', 'Hvis noe ikke passer, kan du likevel være ærlig i vurderingen.', true, 'Riktig. Ærlig match hjelper deg videre.', 'Ikke kryss av «passer» hvis det ikke stemmer.'),
    ss('e06-s02-ss1', ['Jeg', 'har', 'erfaring', 'som', 'passer.'], 'Riktig. Kort og tydelig.', 'Prøv igjen: Jeg har erfaring som passer.'),
  ],
  'e06-s03': [
    fv('e06-s03-fv1', 'Hvilke deler har søknaden ofte?', [['a', 'Innledning, hvorfor meg, og avslutning'], ['b', 'Bare emojis'], ['c', 'Bare et telefonnummer']], 'a', 'Riktig. En søknad har flere korte avsnitt.', 'Bygg søknaden i tre deler.'),
    ob('e06-s03-ob1', 'I innledningen sier du hvilken _____ du søker på.', ['stilling', 'ferie', 'farge'], 'stilling', 'Riktig. Start med jobben du søker.', 'Vær tydelig på hvilken annonse det gjelder.'),
    su('e06-s03-su1', 'Avslutningen kan være «Vennlig hilsen».', true, 'Riktig. Det er en vanlig, høflig avslutning.', 'Bruk formelt og vennlig språk.'),
    ss('e06-s03-ss1', ['Jeg', 'søker', 'på', 'stillingen', 'som', 'butikkmedarbeider.'], 'Riktig. En klar innledning.', 'Prøv igjen med stillingstittelen.'),
  ],
  'e06-s04': [
    fv('e06-s04-fv1', 'Hva gjør du i «finn og rett»?', [['a', 'Finner feil ord og velger riktig form'], ['b', 'Sletter hele søknaden'], ['c', 'Ringer politiet']], 'a', 'Riktig. Du retter språket i utkastet.', 'Se etter ordet som er feil.'),
    ob('e06-s04-ob1', 'Jeg søker _____ jeg har erfaring fra butikk.', ['fordi', 'uten', 'bak'], 'fordi', 'Riktig. «Fordi» forklarer grunnen.', 'Bruk «fordi» når du gir en grunn.'),
    su('e06-s04-su1', 'Det er lurt å rette feil før du sender søknaden.', true, 'Riktig. Et korrekt språk gir et bedre inntrykk.', 'Finn feilen og rett den.'),
  ],
  'e06-s05': [
    ob('e06-s05-ob1', '«Vennlig hilsen» er _____ språk.', ['formelt', 'barnslig', 'sint'], 'formelt', 'Riktig. Det er høflig og formelt nok til søknad.', 'Skill mellom formelt og uformelt.'),
    su('e06-s05-su1', '«Hei du!!» er et godt eksempel på formelt språk i søknad.', false, 'Riktig. Det er for uformelt.', 'I søknad bruker vi mer formelt språk.'),
    ss('e06-s05-ss1', ['Med', 'vennlig', 'hilsen'], 'Riktig. En kort og høflig avslutning.', 'Prøv igjen: Med vennlig hilsen.'),
  ],

  // —— Episode 7 ——
  'e07-s01': [
    ob('e07-s01-ob1', 'Du har et _____ anrop på telefonen.', ['tapt', 'spist', 'malt'], 'tapt', 'Riktig. Et tapt anrop betyr at du ikke rakk å svare.', 'Se varselet om tapt anrop.'),
    su('e07-s01-su1', 'En talemelding kan fortelle hvorfor bedriften ringte.', true, 'Riktig. Lytt nøye til innholdet.', 'Talemeldingen gir viktig informasjon.'),
    ss('e07-s01-ss1', ['Jeg', 'har', 'et', 'tapt', 'anrop.'], 'Riktig. Kort og klart.', 'Prøv igjen: Jeg har et tapt anrop.'),
  ],
  'e07-s02a': [
    fv('e07-s02a-fv2', 'Hva er en innkalling?', [['a', 'En beskjed om at du er bedt inn til intervju'], ['b', 'En bussbillett'], ['c', 'En matoppskrift']], 'a', 'Riktig. Innkalling betyr at du er invitert til intervju.', 'Les SMS-en fra bedriften.'),
    ob('e07-s02a-ob2', 'Intervjuet er _____ tirsdag.', ['på', 'under', 'mellom'], 'på', 'Riktig. Vi sier «på tirsdag».', 'Ukedag tar ofte preposisjonen «på».'),
    su('e07-s02a-su1', 'Du bør lese tid og sted i SMS-en nøye.', true, 'Riktig. Tid og sted er viktige detaljer.', 'Sjekk klokkeslett og adresse.'),
  ],
  'e07-s02b': [
    ob('e07-s02b-ob1', 'Bedriften sender en kort _____.', ['SMS', 'bok', 'film'], 'SMS', 'Riktig. Du får beskjed på SMS.', 'Les den korte meldingen.'),
    su('e07-s02b-su2', 'Selv en kort SMS kan være viktig.', true, 'Riktig. Den kan handle om intervju eller svar.', 'Ikke overse korte meldinger fra bedrifter.'),
    ss('e07-s02b-ss1', ['Takk', 'for', 'meldingen.'], 'Riktig. En høflig og kort respons.', 'Prøv igjen: Takk for meldingen.'),
  ],
  'e07-s03': [
    fv('e07-s03-fv1', 'Hvordan bør du bekrefte et intervju?', [['a', 'Høflig, med dag og klokkeslett'], ['b', 'Bare med «ok»'], ['c', 'Med sinte ord']], 'a', 'Riktig. Bekreft tidspunktet klart.', 'Skriv hele setninger.'),
    ob('e07-s03-ob1', 'Jeg kommer _____ til intervjuet.', ['gjerne', 'aldri', 'sint'], 'gjerne', 'Riktig. «Gjerne» er høflig.', 'Bruk «Jeg kommer gjerne …».'),
    su('e07-s03-su1', 'Det er lurt å gjenta tidspunktet når du bekrefter.', true, 'Riktig. Da unngår du misforståelser.', 'Skriv dag og klokke i svaret.'),
    ss('e07-s03-ss1', ['Jeg', 'kommer', 'gjerne', 'på', 'tirsdag', 'klokka', '10.'], 'Riktig. En tydelig bekreftelse.', 'Prøv igjen med tidspunktet.'),
  ],
  'e07-s03b': [
    fv('e07-s03b-fv2', 'Hvorfor må du rette svaret?', [['a', 'Fordi noe i teksten er feil eller uklart'], ['b', 'Fordi du skal slette telefonen'], ['c', 'Fordi det er søndag']], 'a', 'Riktig. Du øver på å skrive et bedre svar.', 'Finn det som ikke stemmer.'),
    ob('e07-s03b-ob1', 'Jeg må _____ svaret før jeg sender.', ['rette', 'gjemme', 'male'], 'rette', 'Riktig. Rett feil først.', 'Oppgaven handler om å rette opp.'),
    su('e07-s03b-su1', 'Et klart svar gjør det lettere for bedriften.', true, 'Riktig. Tydelig språk er viktig.', 'Skriv kort, høflig og klart.'),
    ss('e07-s03b-ss1', ['Takk', 'for', 'innkallingen.'], 'Riktig. En høflig start.', 'Prøv igjen: Takk for innkallingen.'),
  ],
  'e07-s04': [
    fv('e07-s04-fv2', 'Hva er et avslag?', [['a', 'Beskjed om at du ikke får jobben'], ['b', 'En lønnsøkning'], ['c', 'En bussbillett']], 'a', 'Riktig. Avslag betyr at de ikke tilbyr deg jobben nå.', 'Les e-posten fra bedriften.'),
    ob('e07-s04-ob1', 'Takk for _____. Dessverre fikk jeg ikke jobben.', ['søknaden', 'bussen', 'været'], 'søknaden', 'Riktig. Bedrifter takker ofte for søknaden i et avslag.', 'Se hvordan avslag ofte er formulert.'),
    su('e07-s04-su1', 'Et avslag betyr at du aldri kan søke jobb igjen.', false, 'Riktig. Du kan søke andre jobber.', 'Avslag gjelder denne stillingen, ikke hele framtida.'),
    ss('e07-s04-ss1', ['Takk', 'for', 'svar', 'på', 'søknaden.'], 'Riktig. Høflig og rolig.', 'Prøv igjen: Takk for svar på søknaden.'),
  ],
  'e07-s05': [
    fv('e07-s05-fv1', 'Hvor legger du inn intervjuet?', [['a', 'I kalenderen'], ['b', 'I kjøleskapet'], ['c', 'I skoene']], 'a', 'Riktig. Kalenderen hjelper deg å huske tiden.', 'Bruk kalender-appen.'),
    ob('e07-s05-ob1', 'Intervjuet står _____ tirsdag.', ['på', 'bak', 'uten'], 'på', 'Riktig. På + ukedag.', 'Husk preposisjonen «på».'),
    su('e07-s05-su1', 'Det er lurt å legge inn både tid og sted.', true, 'Riktig. Da er du forberedt.', 'Sjekk at avtalen er komplett.'),
  ],

  // —— Episode 8 ——
  'e08-s01': [
    ob('e08-s01-ob1', '«Fortell om deg selv» er et vanlig _____ på intervju.', ['spørsmål', 'tog', 'vær'], 'spørsmål', 'Riktig. Dette spørsmålet kommer ofte.', 'Forbered et kort svar.'),
    su('e08-s01-su2', 'Det er lurt å øve på vanlige intervjuspørsmål.', true, 'Riktig. Øving gjør deg tryggere.', 'Les lista med spørsmål.'),
    ss('e08-s01-ss1', ['Kan', 'du', 'fortelle', 'litt', 'om', 'deg', 'selv?'], 'Riktig. Et vanlig intervjuspørsmål.', 'Prøv igjen med hele spørsmålet.'),
  ],
  'e08-s02': [
    fv('e08-s02-fv2', 'Hva bør du ta med til intervju?', [['a', 'CV og ID'], ['b', 'Bare en pute'], ['c', 'Bare en fotball']], 'a', 'Riktig. CV og ID er vanlig å ha med.', 'Les lista over hva du skal pakke.'),
    ob('e08-s02-ob1', 'Jeg _____ med CV og ID.', ['tar', 'kaster', 'gjemmer'], 'tar', 'Riktig. Ta med det du trenger.', 'Pakk det du skal ha i mappa.'),
    su('e08-s02-su1', 'Det er greit å komme for sent til intervju uten å si ifra.', false, 'Riktig. Kom i god tid, og si ifra hvis noe skjer.', 'Punktlighet er viktig.'),
  ],
  'e08-s03': [
    fv('e08-s03-fv1', 'Hva bør svaret «fortell om deg selv» inneholde?', [['a', 'Kort om erfaring, utdanning og mål'], ['b', 'Bare hva du spiste i går'], ['c', 'Bare et nei']], 'a', 'Riktig. Hold det kort og relevant for jobben.', 'Knytt svaret til arbeid.'),
    ob('e08-s03-ob1', 'Jeg har _____ i butikk i tre år.', ['jobbet', 'svømt', 'sovet'], 'jobbet', 'Riktig. Fortell om relevant erfaring.', 'Bruk erfaring fra CVen.'),
    su('e08-s03-su1', 'Svaret bør være forståelig og ikke for langt.', true, 'Riktig. Et godt svar er klart og passe langt.', 'Unngå både for kort og alt for langt.'),
    ss('e08-s03-ss1', ['Jeg', 'heter', 'Sofiia,', 'og', 'jeg', 'har', 'omsorgserfaring.'], 'Riktig. En tydelig start.', 'Prøv igjen med navn og erfaring.'),
  ],
  'e08-s04': [
    fv('e08-s04-fv1', 'Hva betyr spørsmålet «Hvorfor denne jobben?»', [['a', 'Hvorfor vil du ha akkurat denne stillingen'], ['b', 'Hvilken farge du liker'], ['c', 'Når bussen går']], 'a', 'Riktig. De vil høre motivasjonen din.', 'Koble svaret til annonsen.'),
    ob('e08-s04-ob1', 'Jeg søker _____ jeg liker å hjelpe mennesker.', ['fordi', 'uten', 'bak'], 'fordi', 'Riktig. «Fordi» gir en grunn.', 'Forklar motivasjonen med fordi.'),
    su('e08-s04-su1', 'Det er lurt å nevne noe konkret fra annonsen.', true, 'Riktig. Da viser du at du har forberedt deg.', 'Les annonsen før intervjuet.'),
    ss('e08-s04-ss1', ['Jeg', 'vil', 'gjerne', 'jobbe', 'her', 'fordi', 'jeg', 'har', 'erfaring.'], 'Riktig. Motivert og konkret.', 'Prøv igjen med «fordi».'),
  ],
  'e08-s05': [
    fv('e08-s05-fv1', 'Hva spør de om når de sier «Hva har du gjort før?»', [['a', 'Om tidligere jobb og erfaring'], ['b', 'Om favorittfilm'], ['c', 'Om været i går']], 'a', 'Riktig. De vil høre om erfaringen din.', 'Bruk perfektum: jeg har …'),
    ob('e08-s05-ob1', 'Jeg _____ hjulpet eldre hjemme.', ['har', 'skal', 'vil'], 'har', 'Riktig. Perfektum: har hjulpet.', 'Har + verb forteller om erfaring.'),
    su('e08-s05-su1', 'Du kan bruke eksempler fra tidligere jobb.', true, 'Riktig. Eksempler gjør svaret sterkere.', 'Fortell kort hva du faktisk gjorde.'),
    ss('e08-s05-ss1', ['Jeg', 'har', 'jobbet', 'i', 'butikk', 'før.'], 'Riktig. En klar erfaringssetning.', 'Prøv igjen: Jeg har jobbet i butikk før.'),
  ],
  'e08-s06': [
    fv('e08-s06-fv1', 'Hva er inversjon?', [['a', 'At verb kommer før subjekt i noen setninger'], ['b', 'At du sover på jobb'], ['c', 'At du sletter CVen']], 'a', 'Riktig. For eksempel: «I Ukraina jobbet jeg …»', 'Når et ledd står først, bytter verb og subjekt plass.'),
    ob('e08-s06-ob2', 'I fjor _____ jeg i butikk.', ['jobbet', 'har jobbet', 'skal jobbe'], 'jobbet', 'Riktig. Med «i fjor» passer preteritum.', 'Tydelig ferdig tid → preteritum.'),
    su('e08-s06-su1', '«Jeg har jobbet» er perfektum.', true, 'Riktig. Har + verb = perfektum.', 'Husk forskjellen på har jobbet og jobbet.'),
  ],
  'e08-s07': [
    fv('e08-s07-fv2', 'Hvorfor bør du stille spørsmål til arbeidsgiveren?', [['a', 'For å vise interesse og forstå jobben bedre'], ['b', 'For å være uforskammet'], ['c', 'For å avlyse intervjuet']], 'a', 'Riktig. Et godt spørsmål viser at du er forberedt.', 'Spør om arbeidstid, oppgaver eller opplæring.'),
    ob('e08-s07-ob1', 'Hva er _____ på denne arbeidsplassen?', ['arbeidstiden', 'favorittfargen', 'hundenavnet'], 'arbeidstiden', 'Riktig. Arbeidstid er et nyttig spørsmål.', 'Velg et praktisk spørsmål.'),
    su('e08-s07-su1', '«Hva er arbeidstiden?» er et høflig og nyttig spørsmål.', true, 'Riktig. Det er konkret og relevant.', 'Øv på å stille korte spørsmål.'),
  ],

  // —— Episode 9 ——
  'e09-s01': [
    fv('e09-s01-fv2', 'Hvorfor planlegger du reisen før intervjuet?', [['a', 'For å komme i tide'], ['b', 'For å være sen med vilje'], ['c', 'For å glemme adressen']], 'a', 'Riktig. God tid gir mindre stress.', 'Velg en buss som kommer tidlig nok.'),
    ob('e09-s01-ob1', 'Jeg sjekker _____ i reiseplanleggeren.', ['rutetabellen', 'oppskriften', 'filmen'], 'rutetabellen', 'Riktig. Rutetabellen viser avganger.', 'Se på linje, avgang og ankomst.'),
    su('e09-s01-su1', 'Det er lurt med litt buffer før intervjuet.', true, 'Riktig. Da tåler du litt forsinkelse.', 'Kom gjerne litt før.'),
  ],
  'e09-s02': [
    fv('e09-s02-fv1', 'Hva bør du gjøre hvis bussen er forsinket?', [['a', 'Sende beskjed til Kari'], ['b', 'Si ingenting'], ['c', 'Slette kalenderen']], 'a', 'Riktig. Si ifra så tidlig du kan.', 'En kort, høflig melding er nok.'),
    ob('e09-s02-ob1', 'Bussen er _____. Jeg kommer litt senere.', ['forsinket', 'lilla', 'spist'], 'forsinket', 'Riktig. Si tydelig hva som er galt.', 'Bruk ordet forsinket.'),
    su('e09-s02-su1', 'Det er uhøflig å si ifra om forsinkelse.', false, 'Riktig. Det er høflig og ansvarlig å si ifra.', 'Arbeidsgiver vil vite at du er på vei.'),
    ss('e09-s02-ss1', ['Hei', 'Kari,', 'bussen', 'er', 'forsinket.'], 'Riktig. Kort og tydelig beskjed.', 'Prøv igjen: Hei Kari, bussen er forsinket.'),
  ],
  'e09-s03a': [
    fv('e09-s03a-fv1', 'Hvorfor takker Kari for beskjeden?', [['a', 'Fordi det er ansvarlig å si ifra'], ['b', 'Fordi hun er sint'], ['c', 'Fordi du ikke skal komme']], 'a', 'Riktig. Beskjed om forsinkelse er bra.', 'Les svaret fra Kari.'),
    ob('e09-s03a-ob1', 'Takk for _____.', ['beskjeden', 'bussen', 'regnet'], 'beskjeden', 'Riktig. Kari takker for at du sa ifra.', 'Se hva Kari skriver.'),
    ss('e09-s03a-ss1', ['Takk', 'for', 'at', 'du', 'sa', 'ifra.'], 'Riktig. En vennlig respons.', 'Prøv igjen: Takk for at du sa ifra.'),
    ma('e09-s03a-ma1', [['p1', 'beskjed', 'informasjon du sender til noen'], ['p2', 'forsinket', 'kommer senere enn planlagt']], 'Riktig. Nyttige ord når noe skjer på veien.', 'Les forklaringene en gang til.'),
  ],
  'e09-s03b': [
    fv('e09-s03b-fv2', 'Hva er viktig i et kort svar fra Kari?', [['a', 'At du forstår om alt er greit'], ['b', 'At du sletter meldingen med en gang'], ['c', 'At du ignorerer den']], 'a', 'Riktig. Les svaret nøye.', 'Kari kan bekrefte at det går bra.'),
    ob('e09-s03b-ob1', 'Kari sender et _____ svar.', ['kort', 'tomt', 'usynlig'], 'kort', 'Riktig. Svaret kan være kort, men viktig.', 'Les hele meldingen.'),
    su('e09-s03b-su1', 'Du kan svare høflig med «Takk».', true, 'Riktig. Et kort takk er ofte nok.', 'Hold tonen vennlig.'),
    ss('e09-s03b-ss1', ['Takk,', 'da', 'ses', 'vi', 'snart.'], 'Riktig. Kort og hyggelig.', 'Prøv igjen: Takk, da ses vi snart.'),
  ],
  'e09-s04': [
    fv('e09-s04-fv2', 'Hva er en arbeidsavtale?', [['a', 'Et dokument om jobb, lønn og arbeidstid'], ['b', 'En matoppskrift'], ['c', 'En bussbillett']], 'a', 'Riktig. Avtalen forteller om vilkårene.', 'Les de viktigste punktene.'),
    ob('e09-s04-ob1', 'Jeg har fått et _____.', ['jobbtilbud', 'regnvær', 'spill'], 'jobbtilbud', 'Riktig. Et tilbud betyr at de vil ansette deg.', 'Les hva tilbudet inneholder.'),
    su('e09-s04-su1', 'Prøvetid betyr at både du og arbeidsgiver kan avslutte i en periode.', true, 'Riktig. Prøvetid er vanlig i starten.', 'Sjekk hva som står om prøvetid.'),
  ],
  'e09-s05': [
    fv('e09-s05-fv2', 'Hva er lurt på første arbeidsdag?', [['a', 'Komme i tide og hilse høflig'], ['b', 'Komme tre timer for sent uten beskjed'], ['c', 'Ignorere kollegaene']], 'a', 'Riktig. Førsteinntrykket betyr mye.', 'Si «god morgen» og vær punktlig.'),
    ob('e09-s05-ob1', '_____ morgen! Jeg er ny her.', ['God', 'Dårlig', 'Ingen'], 'God', 'Riktig. «God morgen» er en høflig hilsen.', 'Start dagen med en vennlig hilsen.'),
    su('e09-s05-su1', 'Det er greit å spørre hvis du er usikker på en oppgave.', true, 'Riktig. Å spørre viser ansvar.', 'Bedre å spørre enn å gjette feil.'),
  ],
  'e09-s06': [
    fv('e09-s06-fv1', 'Hvilken setning handler om framtida?', [['a', 'Jeg skal begynne klokka åtte.'], ['b', 'Jeg jobbet i går.'], ['c', 'Jeg har spist lunsj.']], 'a', 'Riktig. «Skal» peker framover.', 'Skill mellom fortid og framtid.'),
    ob('e09-s06-ob2', 'Jeg _____ komme til å lære mye den første uka.', ['kommer', 'kom', 'har kommet'], 'kommer', 'Riktig. «Kommer til å» snakker om framtida.', 'Bruk «kommer til å» om det som skal skje.'),
  ],

  // —— Episode 10 ——
  'e10-s01': [
    fv('e10-s01-fv1', 'Hvorfor skal du sjekke skattekortet?', [['a', 'Fordi trekkprosenten skal stemme med ny jobb'], ['b', 'Fordi du skal bestille pizza'], ['c', 'Fordi bussen er sen']], 'a', 'Riktig. Ny jobb kan bety nytt skattekort.', 'Les SMS-en fra lønnskontoret.'),
    ob('e10-s01-ob1', 'Du må sjekke _____.', ['skattekortet', 'filmen', 'været'], 'skattekortet', 'Riktig. Skattekortet styrer trekk i lønna.', 'SMS-en handler om skattekort.'),
    su('e10-s01-su1', 'Skattekortet påvirker hvor mye som trekkes i skatt.', true, 'Riktig. Feil kort kan gi for lite eller for mye trekk.', 'Derfor er det viktig å oppdatere.'),
    ss('e10-s01-ss1', ['Jeg', 'må', 'sjekke', 'skattekortet', 'mitt.'], 'Riktig. En tydelig setning.', 'Prøv igjen: Jeg må sjekke skattekortet mitt.'),
  ],
  'e10-s02': [
    fv('e10-s02-fv2', 'Hva er et typisk tegn på svindel-SMS?', [['a', 'Merkelig lenke og press om å klikke raskt'], ['b', 'Offisiell avsender uten lenke'], ['c', 'En melding fra veilederen din uten krav']], 'a', 'Riktig. Vær forsiktig med rare lenker.', 'Ikke logg inn via mistenkelige lenker.'),
    ob('e10-s02-ob1', 'Denne SMS-en ser ut som _____.', ['svindel', 'en buss', 'en blomst'], 'svindel', 'Riktig. Noen meldinger prøver å lure deg.', 'Se etter feil og rare lenker.'),
    su('e10-s02-su1', 'Du skal alltid klikke på lenker i rare SMS-er.', false, 'Riktig. Ikke klikk. Gå til riktig side selv.', 'Bruk offisiell adresse.'),
    ss('e10-s02-ss1', ['Jeg', 'klikket', 'ikke', 'på', 'lenken.'], 'Riktig. Det var et trygt valg.', 'Prøv igjen: Jeg klikket ikke på lenken.'),
  ],
  'e10-s03a': [
    fv('e10-s03a-fv1', 'Hvorfor er det bra at du sa nei til den rare lenken?', [['a', 'Fordi du unngår svindel'], ['b', 'Fordi du mister jobben'], ['c', 'Fordi du skal betale mer skatt']], 'a', 'Riktig. Å si nei beskytter deg.', 'God nettvett på jobb og privat.'),
    ob('e10-s03a-ob1', 'Jeg sa _____ til den mistenkelige lenken.', ['nei', 'ja', 'kanskje'], 'nei', 'Riktig. Nei til svindel.', 'Ikke logg inn via ulik lenke.'),
    su('e10-s03a-su1', 'Det er trygt å bruke den ekte adressen til Skatteetaten.', true, 'Riktig. Gå direkte til riktig side.', 'Ikke bruk lenker fra rare SMS-er.'),
    ss('e10-s03a-ss1', ['Jeg', 'går', 'til', 'riktig', 'nettside.'], 'Riktig. Trygt valg.', 'Prøv igjen: Jeg går til riktig nettside.'),
  ],
  'e10-s03b': [
    fv('e10-s03b-fv2', 'Hva gjør du hvis du kommer til feil side?', [['a', 'Går ut og bruker riktig adresse'], ['b', 'Skriver inn bankkort med en gang'], ['c', 'Deler passordet med alle']], 'a', 'Riktig. Stopp hvis siden ser feil ut.', 'Sjekk adressen nøye.'),
    ob('e10-s03b-ob1', 'Denne siden er _____. Jeg går ut.', ['feil', 'perfekt', 'min'], 'feil', 'Riktig. Ikke logg inn på feil side.', 'Se etter rare adresser.'),
    su('e10-s03b-su1', 'Du skal logge inn selv om adressen ser rar ut.', false, 'Riktig. Feil adresse = gå ut.', 'Bruk bare kjente, trygge sider.'),
    ss('e10-s03b-ss1', ['Dette', 'er', 'feil', 'side.'], 'Riktig. Kort og klart.', 'Prøv igjen: Dette er feil side.'),
  ],
  'e10-s04': [
    fv('e10-s04-fv1', 'Hva gjør du først i Skatteøving?', [['a', 'Logger inn'], ['b', 'Sletter kontoen'], ['c', 'Sender lønnsslippen til en fremmed']], 'a', 'Riktig. Innlogging er første steg.', 'Følg trinnene i øvingen.'),
    ob('e10-s04-ob1', 'Jeg må _____ inn før jeg endrer skattekortet.', ['logge', 'løpe', 'synge'], 'logge', 'Riktig. Logg inn på den trygge siden.', 'Innlogging kommer før endring.'),
    su('e10-s04-su1', 'Du skal bare logge inn på den ekte øvingssiden i spillet.', true, 'Riktig. Følg den trygge flyten i spillet.', 'Ikke bruk rare lenker utenfor øvingen.'),
    ma('e10-s04-ma1', [['p1', 'logge inn', 'skrive brukernavn og passord for å åpne siden'], ['p2', 'skattekort', 'dokument som styrer skattetrekk']], 'Riktig. Viktige ord før du endrer kortet.', 'Les forklaringene en gang til.'),
  ],
  'e10-s05': [
    fv('e10-s05-fv1', 'Hvorfor trenger du tall fra arbeidsavtalen?', [['a', 'For å fylle inn riktig forventet inntekt'], ['b', 'For å bestille buss'], ['c', 'For å velge favorittfarge']], 'a', 'Riktig. Inntektstall påvirker skattekortet.', 'Bruk månedslønn og perioder fra avtalen.'),
    ob('e10-s05-ob1', '_____ er pengene du tjener før skatt i måneden.', ['Månedslønn', 'Busskort', 'Ferie'], 'Månedslønn', 'Riktig. Månedslønn er et nøkkeltall.', 'Finn tallet i avtalen.'),
    su('e10-s05-su1', 'Feil tall kan gi feil trekkprosent.', true, 'Riktig. Derfor må tallene være riktige.', 'Sjekk avtalen før du fyller inn.'),
    ss('e10-s05-ss1', ['Jeg', 'fyller', 'inn', 'riktig', 'månedslønn.'], 'Riktig. Tydelig og konkret.', 'Prøv igjen: Jeg fyller inn riktig månedslønn.'),
  ],
  'e10-s06': [
    ob('e10-s06-ob1', 'Hvis du ikke endrer skattekortet, kan trekket bli _____.', ['feil', 'lilla', 'søtt'], 'feil', 'Riktig. For lite eller for mye trekk.', 'Les om hva som kan skje.'),
    su('e10-s06-su1', '«Hvis»-setninger snakker om mulige følger.', true, 'Riktig. Hvis A, så B.', 'Dette er nyttig språk om skatt og jobb.'),
    ss('e10-s06-ss1', ['Hvis', 'jeg', 'ikke', 'endrer,', 'kan', 'trekket', 'bli', 'feil.'], 'Riktig. En klar hvis-setning.', 'Prøv igjen med hele setningen.'),
  ],
  'e10-s07': [
    fv('e10-s07-fv1', 'Hva betyr bekreftelsen?', [['a', 'At det nye skattekortet er registrert'], ['b', 'At du har mistet jobben'], ['c', 'At bussen er innstilt']], 'a', 'Riktig. Du har fullført endringen.', 'Les kvitteringen nøye.'),
    su('e10-s07-su1', 'Det er lurt å sjekke tallene på bekreftelsen.', true, 'Riktig. Kontroller at trekket ser riktig ut.', 'Finn riktig felt i dokumentet.'),
    ss('e10-s07-ss1', ['Jeg', 'har', 'fått', 'nytt', 'skattekort.'], 'Riktig. Perfektum: har fått.', 'Prøv igjen: Jeg har fått nytt skattekort.'),
  ],

  // —— Episode 11 ——
  'e11-s01': [
    fv('e11-s01-fv1', 'Hva er en lønnsslipp?', [['a', 'Et dokument som viser lønn, trekk og utbetaling'], ['b', 'En bussbillett'], ['c', 'En handleliste']], 'a', 'Riktig. Lønnsslippen forklarer pengene du får.', 'Les e-posten om at slippen er klar.'),
    ob('e11-s01-ob1', 'Lønnsslippen er _____.', ['klar', 'lilla', 'usynlig'], 'klar', 'Riktig. Nå kan du åpne den.', 'E-posten sier at den er klar.'),
    su('e11-s01-su2', 'Du bør lese lønnsslippen når den kommer.', true, 'Riktig. Da kan du oppdage feil tidlig.', 'Sjekk brutto, trekk og netto.'),
    ss('e11-s01-ss1', ['Jeg', 'har', 'fått', 'lønnsslippen', 'min.'], 'Riktig. Perfektum: har fått.', 'Prøv igjen: Jeg har fått lønnsslippen min.'),
  ],
  'e11-s02a': [
    fv('e11-s02a-fv1', 'Hva er trekk på lønnsslippen?', [['a', 'Penger som trekkes, for eksempel skatt'], ['b', 'En bonus du alltid får ekstra'], ['c', 'Navnet på sjefen']], 'a', 'Riktig. Trekk er penger som går ut før du får netto.', 'Se på skattetrekket.'),
    ob('e11-s02a-ob1', 'Etter nytt skattekort kan _____ endre seg.', ['trekket', 'været', 'bussfargen'], 'trekket', 'Riktig. Nytt kort kan gi nytt trekk.', 'Sammenlign med det du forventet.'),
    su('e11-s02a-su1', 'Brutto er beløpet før trekk.', true, 'Riktig. Netto er det du får på konto.', 'Skill mellom brutto og netto.'),
    ss('e11-s02a-ss1', ['Trekket', 'ser', 'riktig', 'ut', 'nå.'], 'Riktig. En klar vurdering.', 'Prøv igjen: Trekket ser riktig ut nå.'),
  ],
  'e11-s02b': [
    fv('e11-s02b-fv2', 'Hva gjør du hvis trekket ser feil ut?', [['a', 'Sjekker tallene og spør hvis du er usikker'], ['b', 'Ignorerer det alltid'], ['c', 'Sletter arbeidsavtalen']], 'a', 'Riktig. Si ifra hvis noe ikke stemmer.', 'Sammenlign med skattekort og timer.'),
    ob('e11-s02b-ob1', 'Trekket ser _____. Jeg må sjekke.', ['feil', 'perfekt', 'usynlig'], 'feil', 'Riktig. Da undersøker du videre.', 'Ikke gjett – sjekk dokumentene.'),
    su('e11-s02b-su1', 'Det er lov å spørre lønnskontoret hvis noe er uklart.', true, 'Riktig. Spør høflig og konkret.', 'Ta vare på lønnsslippen.'),
    ss('e11-s02b-ss1', ['Kan', 'dere', 'sjekke', 'trekket', 'mitt?'], 'Riktig. Et høflig spørsmål.', 'Prøv igjen: Kan dere sjekke trekket mitt?'),
  ],
  'e11-s03': [
    fv('e11-s03-fv1', 'Hva er netto utbetalt?', [['a', 'Pengene du får på konto etter trekk'], ['b', 'Lønn før skatt'], ['c', 'Bare feriepengene']], 'a', 'Riktig. Netto er det som utbetales.', 'Finn feltet på slippen.'),
    ob('e11-s03-ob1', '_____ utbetalt er det jeg får på konto.', ['Netto', 'Brutto', 'Ingen'], 'Netto', 'Riktig. Netto = etter trekk.', 'Se etter ordet netto.'),
    su('e11-s03-su1', 'Brutto og netto er det samme beløpet.', false, 'Riktig. Brutto er før trekk. Netto er etter.', 'Sammenlign linjene på slippen.'),
    ss('e11-s03-ss1', ['Jeg', 'får', 'dette', 'beløpet', 'på', 'konto.'], 'Riktig. Tydelig formulering.', 'Prøv igjen: Jeg får dette beløpet på konto.'),
  ],
  'e11-s04': [
    fv('e11-s04-fv2', 'Hvordan regner du ofte ut lønn?', [['a', 'Timer ganger timelønn'], ['b', 'Timer minus buss'], ['c', 'Timer pluss vær']], 'a', 'Riktig. Antall timer × timelønn.', 'Sjekk tallene i oppgaven.'),
    ob('e11-s04-ob1', '128 _____ 200 kroner er bruttolønn før trekk.', ['ganger', 'minus', 'uten'], 'ganger', 'Riktig. Vi ganger timer med timelønn.', 'Bruk gange-tegnet i hodet: ×'),
    su('e11-s04-su1', 'Hvis timene mangler, kan lønna bli for lav.', true, 'Riktig. Derfor er det viktig å sjekke timene.', 'Sammenlign timeliste og lønnsslipp.'),
    ss('e11-s04-ss1', ['Timer', 'ganger', 'timelønn', 'gir', 'brutto.'], 'Riktig. En enkel regel.', 'Prøv igjen: Timer ganger timelønn gir brutto.'),
  ],
  'e11-s05': [
    fv('e11-s05-fv1', 'Hva gjør du hvis overtid mangler på slippen?', [['a', 'Sjekker timelista og spør høflig'], ['b', 'Sier ingenting noen gang'], ['c', 'Sletter timelista']], 'a', 'Riktig. Ta kontakt med en klar beskjed.', 'Vis hvilke timer som mangler.'),
    ob('e11-s05-ob1', 'Fire timer _____ på lønnsslippen.', ['mangler', 'synger', 'sover'], 'mangler', 'Riktig. Da må du si ifra.', 'Sammenlign med timelista.'),
    su('e11-s05-su1', 'Det er lurt å være konkret når du spør om lønn.', true, 'Riktig. Oppgi dato, timer og beløp hvis du kan.', 'En høflig melding hjelper.'),
  ],
  'e11-s06': [
    fv('e11-s06-fv1', 'Hva er feriepenger?', [['a', 'Penger du tjener opp til ferie, ofte utbetalt senere'], ['b', 'En bot fra politiet'], ['c', 'Et busskort']], 'a', 'Riktig. Feriepenger beregnes av lønn.', 'I Norge er 10,2 % vanlig i mange tilfeller.'),
    ob('e11-s06-ob1', 'Feriepengene er _____ prosent.', ['10,2', '100', '0'], '10,2', 'Riktig. 10,2 % er et vanlig tall i øvingen.', 'Les teksten om feriepenger.'),
    ss('e11-s06-ss1', ['Jeg', 'tjener', 'opp', 'feriepenger', 'når', 'jeg', 'jobber.'], 'Riktig. En klar forklaring.', 'Prøv igjen med hele setningen.'),
  ],
  'e11-s07': [
    fv('e11-s07-fv1', 'Hva betyr «per time»?', [['a', 'For hver time'], ['b', 'For hele året uten pause'], ['c', 'Aldri']], 'a', 'Riktig. Per = for hver.', 'Skill mellom per, for og hittil.'),
    ob('e11-s07-ob1', '_____ i år har jeg tjent …', ['Hittil', 'Bak', 'Uten'], 'Hittil', 'Riktig. Hittil i år = fra januar til nå.', 'Dette er nyttig på lønnsslippen.'),
    su('e11-s07-su1', '«For november» betyr beløpet som gjelder den måneden.', true, 'Riktig. «For» knytter beløpet til perioden.', 'Les linjene nøye.'),
  ],
}

function apply(path) {
  const ep = JSON.parse(readFileSync(path, 'utf8'))
  let changed = 0
  for (const scene of ep.scener) {
    const add = extras[scene.id] || []
    const eksisterende = scene.oppgaver || []
    const normals = eksisterende.filter((o) => !SPECIAL.has(o.type))
    const specials = eksisterende.filter((o) => SPECIAL.has(o.type))
    const need = 5 - eksisterende.length
    if (need > 0 && add.length < need) {
      console.warn(`FOR FÅ EXTRAS ${scene.id}: trenger ${need}, har ${add.length}`)
    }
    if (need > 0) {
      scene.oppgaver = [...normals, ...add.slice(0, need), ...specials]
      changed++
      console.log(`${scene.id}: ${eksisterende.length} -> ${scene.oppgaver.length}`)
    } else if (specials.length && normals.length) {
      // reorder only
      scene.oppgaver = [...normals, ...specials]
      console.log(`${scene.id}: reorder specials last (${scene.oppgaver.length})`)
    } else if (specials.length === eksisterende.length && eksisterende.length === 5) {
      console.log(`${scene.id}: ok 5`)
    } else {
      // still ensure specials last when already 5
      if (specials.length) {
        scene.oppgaver = [...normals, ...specials]
      }
      if ((scene.oppgaver?.length ?? 0) !== 5) {
        console.warn(`${scene.id}: har ${scene.oppgaver?.length}, ikke 5`)
      } else {
        console.log(`${scene.id}: ok 5`)
      }
    }
  }
  writeFileSync(path, `${JSON.stringify(ep, null, 2)}\n`, 'utf8')
  return changed
}

// Reorder e02 specials to end as well
function reorderFile(path) {
  const ep = JSON.parse(readFileSync(path, 'utf8'))
  for (const scene of ep.scener) {
    const eksisterende = scene.oppgaver || []
    if (eksisterende.length !== 5) continue
    const normals = eksisterende.filter((o) => !SPECIAL.has(o.type))
    const specials = eksisterende.filter((o) => SPECIAL.has(o.type))
    if (specials.length) scene.oppgaver = [...normals, ...specials]
  }
  writeFileSync(path, `${JSON.stringify(ep, null, 2)}\n`, 'utf8')
}

const files = [
  'src/innhold/episoder/e01.json',
  'src/innhold/episoder/e03.json',
  'src/innhold/episoder/e04.json',
  'src/innhold/episoder/e05.json',
  'src/innhold/episoder/e06.json',
  'src/innhold/episoder/e07.json',
  'src/innhold/episoder/e08.json',
  'src/innhold/episoder/e09.json',
  'src/innhold/episoder/e10.json',
  'src/innhold/episoder/e11.json',
]

for (const f of files) {
  console.log('\n===', f, '===')
  apply(f)
}
console.log('\n=== reorder e02 ===')
reorderFile('src/innhold/episoder/e02.json')

// Summary
console.log('\n=== OPPSUMMERING ===')
for (const f of [...files, 'src/innhold/episoder/e02.json']) {
  const ep = JSON.parse(readFileSync(f, 'utf8'))
  for (const s of ep.scener) {
    const n = s.oppgaver?.length ?? 0
    if (n !== 5) console.warn('IKKE 5:', s.id, n)
  }
}
