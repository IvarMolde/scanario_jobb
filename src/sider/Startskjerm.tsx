import { useState } from 'react'
import { MORSMAL_ETIKETTER, type Morsmal } from '../modell/typer'
import { useSpill } from '../spill/SpillProvider'
import type { SpillModus } from '../spill/tilstand'
import { SceneBilde } from '../komponenter/SceneBilde'

type IntroSprak = 'nb' | Morsmal

const INTRO_ETIKETTER: Record<IntroSprak, string> = {
  nb: 'Norsk',
  uk: MORSMAL_ETIKETTER.uk,
  en: MORSMAL_ETIKETTER.en,
  ar: MORSMAL_ETIKETTER.ar,
}

const INTRO_TEKST: Record<
  IntroSprak,
  { tittel: string; avsnitt: string[]; lang: string; dir: 'ltr' | 'rtl' }
> = {
  nb: {
    tittel: 'Hva går spillet ut på?',
    avsnitt: [
      'Jobbreisen er et spill der du øver på å søke jobb i Norge. Du spiller som en jobbsøker og møter ulike situasjoner fra hverdagen.',
      'Du får blant annet øve på å lese jobbannonser, forstå hva annonsen betyr, svare på meldinger, skrive i aktivitetsplanen, forberede deg til jobbintervju, og bruke annen viktig informasjon som er aktuell når du søker jobb.',
      'Velg morsmål for ordkort, velg en person å spille som, og velg om du vil følge hele historien eller hoppe rett til en episode.',
    ],
    lang: 'nb',
    dir: 'ltr',
  },
  uk: {
    tittel: 'Про що ця гра?',
    avsnitt: [
      'Jobbreisen — це гра, у якій ви тренуєтеся шукати роботу в Норвегії. Ви граєте як шукач роботи і стикаєтеся з різними життєвими ситуаціями.',
      'Ви практикуєте, зокрема, читання оголошень про роботу, розуміння їхнього змісту, відповіді на повідомлення, записи в плані активності, підготовку до співбесіди та іншу важливу інформацію, потрібну під час пошуку роботи.',
      'Оберіть рідну мову для карток зі словами, оберіть персонажа та вирішіть, чи йти за історією по порядку, чи одразу відкрити потрібний епізод.',
    ],
    lang: 'uk',
    dir: 'ltr',
  },
  en: {
    tittel: 'What is this game about?',
    avsnitt: [
      'Jobbreisen is a game where you practise looking for a job in Norway. You play as a job seeker and meet different everyday situations.',
      'You will practise reading job ads, understanding what the ads mean, answering messages, writing in the activity plan, preparing for a job interview, and using other important information that matters when you apply for work.',
      'Choose a mother tongue for the word cards, choose a person to play as, and choose whether to follow the full story or go straight to an episode.',
    ],
    lang: 'en',
    dir: 'ltr',
  },
  ar: {
    tittel: 'ما موضوع اللعبة؟',
    avsnitt: [
      'Jobbreisen هي لعبة تتدرب فيها على البحث عن عمل في النرويج. تلعب دور باحث عن عمل وتواجه مواقف مختلفة من الحياة اليومية.',
      'تتدرب على قراءة إعلانات الوظائف وفهم معناها، والرد على الرسائل، والكتابة في خطة النشاط، والتحضير لمقابلة العمل، واستخدام معلومات أخرى مهمة عند البحث عن وظيفة.',
      'اختر لغتك الأم لبطاقات الكلمات، واختر شخصية للعب، واختر ما إذا كنت تريد اتباع القصة بالترتيب أو الانتقال مباشرة إلى حلقة معينة.',
    ],
    lang: 'ar',
    dir: 'rtl',
  },
}

export function Startskjerm() {
  const { innhold, fremdrift, velgPerson, velgMorsmal, velgSpillModus, startSpill } = useSpill()
  const [introSprak, setIntroSprak] = useState<IntroSprak>('nb')
  const klar = Boolean(fremdrift.personId && fremdrift.morsmal && fremdrift.spillModus)
  const intro = INTRO_TEKST[introSprak]

  return (
    <div className="startside" id="oppgave-innhold" tabIndex={-1}>
      <p className="ingress">{innhold.scenario.kurs} · Nivå {innhold.scenario.nivaa}</p>
      <h1>Jobbreisen – et spill utviklet av Ivar Øverland</h1>

      <section className="spill-intro" aria-labelledby="spill-intro-tittel">
        <div className="spill-intro-sprak" role="group" aria-label="Les introduksjonen på et annet språk">
          {(Object.keys(INTRO_ETIKETTER) as IntroSprak[]).map((kode) => (
            <button
              key={kode}
              type="button"
              className={`spill-intro-sprak-knapp${introSprak === kode ? ' er-valgt' : ''}`}
              aria-pressed={introSprak === kode}
              lang={kode === 'nb' ? 'nb' : kode === 'uk' ? 'uk' : kode}
              dir={kode === 'ar' ? 'rtl' : 'ltr'}
              onClick={() => setIntroSprak(kode)}
            >
              {INTRO_ETIKETTER[kode]}
            </button>
          ))}
        </div>

        <div className="spill-intro-innhold" lang={intro.lang} dir={intro.dir}>
          <h2 id="spill-intro-tittel">{intro.tittel}</h2>
          {intro.avsnitt.map((tekst) => (
            <p key={tekst}>{tekst}</p>
          ))}
        </div>
      </section>

      <h2 id="velg-morsmal">1. Velg morsmål</h2>
      <p>Ordkort vises på dette språket.</p>
      <div className="morsmal-valg" role="group" aria-labelledby="velg-morsmal">
        {(Object.keys(MORSMAL_ETIKETTER) as Morsmal[]).map((kode) => (
          <button
            key={kode}
            type="button"
            className="knapp knapp-sekundaer"
            aria-pressed={fremdrift.morsmal === kode}
            lang={kode === 'uk' ? 'uk' : kode}
            dir={kode === 'ar' ? 'rtl' : 'ltr'}
            onClick={() => velgMorsmal(kode)}
          >
            {MORSMAL_ETIKETTER[kode]}
          </button>
        ))}
      </div>

      <h2 id="velg-person">2. Velg person</h2>
      <div className="person-liste" role="group" aria-labelledby="velg-person">
        {innhold.personer.map((person) => (
          <article key={person.id}>
            <button
              type="button"
              className="personkort"
              aria-pressed={fremdrift.personId === person.id}
              onClick={() => velgPerson(person.id)}
            >
              <SceneBilde
                fil={person.bilde}
                alt={`${person.fornavn} ${person.etternavn}`}
                klasseNavn="avatar"
                prioritet
              />
              <span>
                <strong>
                  {person.fornavn} {person.etternavn}
                </strong>
                <br />
                Jobbønske: {person.yrkesmal}
                <br />
                Bosted: {person.bosted}
                <br />
                Førerkort:{' '}
                {person.forerkort ? person.forerkortType ?? 'Ja' : 'Ikke førerkort'}
                <br />
                Fødselsnummer: {person.fodselsnummer}
              </span>
            </button>
            <p>{person.presentasjon}</p>
          </article>
        ))}
      </div>

      <h2 id="velg-modus">3. Velg spillmodus</h2>
      <p>Velg hvordan du vil gå gjennom episodene.</p>
      <div className="modus-valg" role="group" aria-labelledby="velg-modus">
        <ModusKort
          id="scenario"
          tittel="Fast scenario"
          tekst="Følg historien i rekkefølge. Episodene låses opp etter hvert."
          valgt={fremdrift.spillModus === 'scenario'}
          onVelg={() => velgSpillModus('scenario')}
        />
        <ModusKort
          id="valgfri"
          tittel="Valgfri scenario"
          tekst="Velg selv hvilken episode du vil spille. Alle episoder er åpne."
          valgt={fremdrift.spillModus === 'valgfri'}
          onVelg={() => velgSpillModus('valgfri')}
        />
      </div>

      <div className="handlinger">
        <button type="button" className="knapp knapp-amber" disabled={!klar} onClick={startSpill}>
          Start
        </button>
      </div>
    </div>
  )
}

function ModusKort({
  id,
  tittel,
  tekst,
  valgt,
  onVelg,
}: {
  id: SpillModus
  tittel: string
  tekst: string
  valgt: boolean
  onVelg: () => void
}) {
  return (
    <button
      type="button"
      className={`modus-kort${valgt ? ' er-valgt' : ''}`}
      aria-pressed={valgt}
      onClick={onVelg}
    >
      <span className="modus-kort-merke" aria-hidden="true">
        {id === 'scenario' ? '1–11' : 'Åpen'}
      </span>
      <span className="modus-kort-tittel">{tittel}</span>
      <span className="modus-kort-tekst">{tekst}</span>
    </button>
  )
}
