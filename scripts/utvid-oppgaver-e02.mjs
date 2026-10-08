import { readFileSync, writeFileSync } from 'node:fs'

const extras = {
  'e02-s01': [
    {
      type: 'ordbank',
      id: 'e02-s01-ob1',
      instruksjon: 'Velg ordet som passer i setningen.',
      setning: 'Linn ber om en oppdatert _____.',
      ord: ['CV', 'lønnsslipp', 'bussbillett'],
      riktig: 'CV',
      tilbakemeldingRiktig: 'Riktig. Linn ber om en oppdatert CV.',
      tilbakemeldingFeil: 'Les e-posten. Linn skriver om CV.',
    },
    {
      type: 'sant_usant',
      id: 'e02-s01-su2',
      instruksjon: 'Les påstanden. Velg sant eller usant.',
      paastand: 'Det er lurt å oppdatere CVen på nav.no under «Min side».',
      riktigErSant: true,
      tilbakemeldingRiktig: 'Riktig. På Min side kan veilederen se CVen din.',
      tilbakemeldingFeil: 'Teksten sier at du bør oppdatere CVen på www.nav.no, under «Min side».',
    },
    {
      type: 'matching',
      id: 'e02-s01-ma1',
      instruksjon: 'Trykk på ordet, og velg forklaringen som passer.',
      par: [
        { id: 'p1', venstre: 'erfaring', hoyre: 'jobb og arbeid du har gjort før' },
        { id: 'p2', venstre: 'utdanning', hoyre: 'skole, studie og kurs' },
        { id: 'p3', venstre: 'sertifikat', hoyre: 'bevis på at du kan noe spesielt' },
      ],
      tilbakemeldingRiktig: 'Riktig. Disse ordene er viktige deler i en CV.',
      tilbakemeldingFeil: 'Tenk på hva som hører hjemme i CVen: jobb, skole og bevis.',
    },
  ],
  'e02-s02': [
    {
      type: 'flervalg',
      id: 'e02-s02-fv1',
      instruksjon: 'Velg det riktige svaret.',
      spoersmal: 'Hva er erfaring i en CV?',
      alternativer: [
        { id: 'a', tekst: 'Hobbyer du liker hjemme' },
        { id: 'b', tekst: 'Jobb og arbeid du har gjort før' },
        { id: 'c', tekst: 'Navnet på veilederen din' },
      ],
      riktigId: 'b',
      tilbakemeldingRiktig: 'Riktig. Erfaring er jobb, praksis eller frivillig arbeid.',
      tilbakemeldingFeil: 'Erfaring handler om arbeid du har gjort, ikke om hobbyer.',
    },
    {
      type: 'ordbank',
      id: 'e02-s02-ob1',
      instruksjon: 'Velg ordet som passer i setningen.',
      setning: 'Førerkort klasse B er et _____.',
      ord: ['sertifikat', 'språk', 'bosted'],
      riktig: 'sertifikat',
      tilbakemeldingRiktig: 'Riktig. Førerkort er et sertifikat.',
      tilbakemeldingFeil: 'Førerkort og kursbevis er sertifikater.',
    },
    {
      type: 'sant_usant',
      id: 'e02-s02-su1',
      instruksjon: 'Les påstanden. Velg sant eller usant.',
      paastand: 'Språk i CVen er bare morsmål. Du skal ikke skrive norsk.',
      riktigErSant: false,
      tilbakemeldingRiktig: 'Riktig. Du skal også skrive norsk og andre språk du kan.',
      tilbakemeldingFeil: 'Skriv morsmål først, men også norsk og andre språk.',
    },
    {
      type: 'sorter_setning',
      id: 'e02-s02-ss1',
      instruksjon: 'Trykk på ordene i riktig rekkefølge.',
      biter: ['Jeg', 'har', 'jobbet', 'i', 'butikk'],
      tilbakemeldingRiktig: 'Riktig. Slik kan en kort CV-setning se ut.',
      tilbakemeldingFeil: 'Prøv igjen: Jeg har jobbet i butikk.',
    },
  ],
  'e02-s03': [
    {
      type: 'flervalg',
      id: 'e02-s03-fv1',
      instruksjon: 'Velg det riktige svaret.',
      spoersmal: 'Hva er en egenskap?',
      alternativer: [
        { id: 'a', tekst: 'Hvordan du er som person og arbeidstaker' },
        { id: 'b', tekst: 'Navnet på skolen din' },
        { id: 'c', tekst: 'Telefonnummeret til sjefen' },
      ],
      riktigId: 'a',
      tilbakemeldingRiktig: 'Riktig. Egenskaper sier hvordan du jobber og møter andre.',
      tilbakemeldingFeil: 'En egenskap er ikke utdanning. Den sier noe om måten du er på.',
    },
    {
      type: 'ordbank',
      id: 'e02-s03-ob1',
      instruksjon: 'Velg ordet som passer i setningen.',
      setning: 'Jeg er _____. Jeg kommer alltid i god tid.',
      ord: ['punktlig', 'sint', 'forsinket'],
      riktig: 'punktlig',
      tilbakemeldingRiktig: 'Riktig. Punktlig betyr at du kommer i tide.',
      tilbakemeldingFeil: 'Når du kommer i god tid, er du punktlig.',
    },
    {
      type: 'sant_usant',
      id: 'e02-s03-su1',
      instruksjon: 'Les påstanden. Velg sant eller usant.',
      paastand: 'Det er lurt å lese jobbannonsen før du velger egenskaper i CVen.',
      riktigErSant: true,
      tilbakemeldingRiktig: 'Riktig. Da kan du velge egenskaper arbeidsgiveren søker.',
      tilbakemeldingFeil: 'Teksten sier at du bør lese annonsen først.',
    },
    {
      type: 'matching',
      id: 'e02-s03-ma1',
      instruksjon: 'Trykk på ordet, og velg forklaringen som passer.',
      par: [
        { id: 'p1', venstre: 'fleksibel', hoyre: 'du kan endre planer og gjøre nye oppgaver' },
        { id: 'p2', venstre: 'samarbeidsvillig', hoyre: 'du liker å jobbe sammen med andre' },
        { id: 'p3', venstre: 'læringsvillig', hoyre: 'du vil lære nye ting på jobben' },
      ],
      tilbakemeldingRiktig: 'Riktig. Du kjenner viktige egenskaper i arbeidslivet.',
      tilbakemeldingFeil: 'Les forklaringene i teksten en gang til.',
    },
  ],
  'e02-s04': [
    {
      type: 'flervalg',
      id: 'e02-s04-fv1',
      instruksjon: 'Velg det riktige svaret.',
      spoersmal: 'Når bruker vi ofte perfektum i en CV?',
      alternativer: [
        { id: 'a', tekst: 'Når erfaringen fortsatt gjelder' },
        { id: 'b', tekst: 'Bare når du snakker om i morgen' },
        { id: 'c', tekst: 'Bare når du skriver om ferie' },
      ],
      riktigId: 'a',
      tilbakemeldingRiktig: 'Riktig. Perfektum (har + verb) er vanlig når erfaringen gjelder fortsatt.',
      tilbakemeldingFeil: 'I CV bruker vi ofte «jeg har jobbet» når erfaringen fortsatt gjelder.',
    },
    {
      type: 'ordbank',
      id: 'e02-s04-ob1',
      instruksjon: 'Velg verbet som passer.',
      setning: 'Jeg _____ i butikk i 2021.',
      ord: ['jobbet', 'har jobbet', 'skal jobbe'],
      riktig: 'jobbet',
      tilbakemeldingRiktig: 'Riktig. Med et ferdig år (2021) bruker vi ofte preteritum: jobbet.',
      tilbakemeldingFeil: 'Når tiden er tydelig ferdig, passer preteritum: «Jeg jobbet … i 2021.»',
    },
    {
      type: 'sant_usant',
      id: 'e02-s04-su1',
      instruksjon: 'Les påstanden. Velg sant eller usant.',
      paastand: '«Jeg har jobbet i butikk» er preteritum.',
      riktigErSant: false,
      tilbakemeldingRiktig: 'Riktig. «Har jobbet» er perfektum.',
      tilbakemeldingFeil: '«Har + verb» er perfektum, ikke preteritum.',
    },
    {
      type: 'sorter_setning',
      id: 'e02-s04-ss1',
      instruksjon: 'Trykk på ordene i riktig rekkefølge.',
      biter: ['Jeg', 'har', 'hjulpet', 'eldre', 'hjemme'],
      tilbakemeldingRiktig: 'Riktig. Dette er en god CV-setning i perfektum.',
      tilbakemeldingFeil: 'Prøv igjen: Jeg har hjulpet eldre hjemme.',
    },
  ],
  'e02-s05': [
    {
      type: 'sant_usant',
      id: 'e02-s05-su1',
      instruksjon: 'Les påstanden. Velg sant eller usant.',
      paastand: 'En referanse kan være en tidligere leder.',
      riktigErSant: true,
      tilbakemeldingRiktig: 'Riktig. En tidligere leder er en vanlig referanse.',
      tilbakemeldingFeil: 'Linn skriver at det kan være en tidligere leder.',
    },
    {
      type: 'ordbank',
      id: 'e02-s05-ob1',
      instruksjon: 'Velg ordet som passer i setningen.',
      setning: 'Linn savner en _____ i CVen.',
      ord: ['referanse', 'buss', 'ferie'],
      riktig: 'referanse',
      tilbakemeldingRiktig: 'Riktig. Linn ber om en referanse.',
      tilbakemeldingFeil: 'Les e-posten. Hun spør om referanse.',
    },
    {
      type: 'matching',
      id: 'e02-s05-ma1',
      instruksjon: 'Trykk på ordet, og velg forklaringen som passer.',
      par: [
        { id: 'p1', venstre: 'referanse', hoyre: 'person som kan si at du er en god arbeidstaker' },
        { id: 'p2', venstre: 'CV', hoyre: 'kort oversikt over erfaring og utdanning' },
      ],
      tilbakemeldingRiktig: 'Riktig. Nå skiller du mellom CV og referanse.',
      tilbakemeldingFeil: 'Referanse er et menneske. CV er dokumentet.',
    },
    {
      type: 'flervalg',
      id: 'e02-s05-fv2',
      instruksjon: 'Velg det riktige svaret.',
      spoersmal: 'Hva kan du gjøre når Linn ber om referanse?',
      alternativer: [
        { id: 'a', tekst: 'Legge den inn nå, eller gå videre uten' },
        { id: 'b', tekst: 'Slette hele CVen' },
        { id: 'c', tekst: 'Sende lønnsslippen til Linn' },
      ],
      riktigId: 'a',
      tilbakemeldingRiktig: 'Riktig. Du kan legge inn referanse nå, eller gå videre.',
      tilbakemeldingFeil: 'Teksten sier at du kan legge den inn nå, eller gå videre.',
    },
  ],
  'e02-s06': [
    {
      type: 'flervalg',
      id: 'e02-s06-fv1',
      instruksjon: 'Velg det riktige svaret.',
      spoersmal: 'Hvilken setning bruker preteritum?',
      alternativer: [
        { id: 'a', tekst: 'Jeg jobbet i en butikk i 2022.' },
        { id: 'b', tekst: 'Jeg har jobbet i en butikk i tre år.' },
        { id: 'c', tekst: 'Jeg skal jobbe i en butikk.' },
      ],
      riktigId: 'a',
      tilbakemeldingRiktig: 'Riktig. «Jobbet» uten «har» er preteritum.',
      tilbakemeldingFeil: 'Preteritum er fortid uten «har», for eksempel «jeg jobbet».',
    },
    {
      type: 'sant_usant',
      id: 'e02-s06-su1',
      instruksjon: 'Les påstanden. Velg sant eller usant.',
      paastand: '«Jeg har fullført et datakurs» er perfektum.',
      riktigErSant: true,
      tilbakemeldingRiktig: 'Riktig. «Har fullført» er perfektum.',
      tilbakemeldingFeil: 'Når vi bruker har + verb, er det perfektum.',
    },
    {
      type: 'ordbank',
      id: 'e02-s06-ob2',
      instruksjon: 'Velg verbet som passer.',
      setning: 'Jeg _____ kontorer hver kveld.',
      ord: ['vasket', 'skal vaske', 'har vask'],
      riktig: 'vasket',
      tilbakemeldingRiktig: 'Riktig. Her passer preteritum: vasket.',
      tilbakemeldingFeil: 'I eksempelet står det «Jeg vasket kontorer hver kveld».',
    },
    {
      type: 'sorter_setning',
      id: 'e02-s06-ss1',
      instruksjon: 'Trykk på ordene i riktig rekkefølge.',
      biter: ['Jeg', 'har', 'lært', 'god', 'kundebehandling'],
      tilbakemeldingRiktig: 'Riktig. Dette er perfektum: har lært.',
      tilbakemeldingFeil: 'Prøv igjen: Jeg har lært god kundebehandling.',
    },
  ],
}

const path = 'src/innhold/episoder/e02.json'
const ep = JSON.parse(readFileSync(path, 'utf8'))
for (const scene of ep.scener) {
  const add = extras[scene.id]
  if (!add) {
    console.warn('MANGLER', scene.id)
    continue
  }
  const eksisterende = scene.oppgaver || []
  const need = 5 - eksisterende.length
  if (need <= 0) {
    console.log('OK', scene.id, eksisterende.length)
    continue
  }
  scene.oppgaver = [...eksisterende, ...add.slice(0, need)]
  console.log(scene.id, eksisterende.length, '->', scene.oppgaver.length)
}
writeFileSync(path, `${JSON.stringify(ep, null, 2)}\n`, 'utf8')
