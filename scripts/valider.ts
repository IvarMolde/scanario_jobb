import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  arbeidFilSkjema,
  annonserFilSkjema,
  episodeSkjema,
  ordlisteFilSkjema,
  personerFilSkjema,
  ruterFilSkjema,
  satserSkjema,
  scenarioSkjema,
  sluttFilSkjema,
} from '../src/modell/skjema.ts'
import { gyldigBildeNavn, gyldigLydNavn } from '../src/modell/filnavn.ts'
import { OPPSUMMERING_ID, SLUTT_ID } from '../src/modell/typer.ts'
import { kommerMedBuffer } from '../src/spill/reise.ts'
import { trekkUtOrdId } from '../src/utils/tekst.ts'
import type { Annonse, Episode, Ord, Person } from '../src/modell/typer.ts'

const rot = join(dirname(fileURLToPath(import.meta.url)), '..')
const feil: string[] = []

function lesJson(sti: string): unknown {
  return JSON.parse(readFileSync(sti, 'utf8')) as unknown
}

function samleTekst(verdi: unknown, ut: string[]): void {
  if (typeof verdi === 'string') ut.push(verdi)
  else if (Array.isArray(verdi)) verdi.forEach((v) => samleTekst(v, ut))
  else if (verdi && typeof verdi === 'object') {
    Object.values(verdi).forEach((v) => samleTekst(v, ut))
  }
}

function validerEpisode(episode: Episode, ordliste: Ord[], annonser: Annonse[]): void {
  const sceneIder = new Set(episode.scener.map((s) => s.id))
  const flaggTillatt = new Set(episode.tillatteFlagg)

  if (!sceneIder.has(episode.startSceneId)) {
    feil.push(`${episode.id}: startSceneId ${episode.startSceneId} finnes ikke`)
  }

  const unike = new Set<string>()
  for (const scene of episode.scener) {
    if (unike.has(scene.id)) feil.push(`Duplikat scene ${scene.id}`)
    unike.add(scene.id)

    if (scene.valg.length === 0 && !scene.oppgaver.some((o) => o.type === 'bygg_melding')) {
      feil.push(`${scene.id}: mangler valg og har ikke bygg_melding`)
    }

    for (const valg of scene.valg) {
      const neste = valg.nesteSceneId
      if (neste !== OPPSUMMERING_ID && neste !== SLUTT_ID && !sceneIder.has(neste)) {
        feil.push(`${scene.id}: dødt valg ${valg.id} peker på ${neste}`)
      }
      for (const flagg of valg.flagg ?? []) {
        if (!flaggTillatt.has(flagg)) feil.push(`${scene.id}: ukjent flagg ${flagg}`)
      }
    }

    if (scene.annonseId && !annonser.some((a) => a.id === scene.annonseId)) {
      feil.push(`${scene.id}: ukjent annonseId ${scene.annonseId}`)
    }

    for (const oppgave of scene.oppgaver) {
      if (oppgave.instruksjonLyd && !oppgave.lydManus) {
        feil.push(`${oppgave.id}: instruksjonLyd krever lydManus (tekst å lese inn)`)
      }
      if (oppgave.type === 'bygg_melding') {
        for (const neste of [oppgave.nesteHoflig, oppgave.nesteUhoflig]) {
          if (neste !== OPPSUMMERING_ID && neste !== SLUTT_ID && !sceneIder.has(neste)) {
            feil.push(`${oppgave.id}: død neste-scene ${neste}`)
          }
        }
        for (const flagg of [...oppgave.flaggHoflig, ...oppgave.flaggUhoflig]) {
          if (!flaggTillatt.has(flagg)) feil.push(`${oppgave.id}: ukjent flagg ${flagg}`)
        }
      }
      if (oppgave.type === 'portal_sok') {
        for (const flagg of oppgave.flagg) {
          if (!flaggTillatt.has(flagg)) feil.push(`${oppgave.id}: ukjent flagg ${flagg}`)
        }
      }
      if (oppgave.type === 'velg_jobber') {
        for (const flagg of oppgave.flagg ?? []) {
          if (!flaggTillatt.has(flagg)) feil.push(`${oppgave.id}: ukjent flagg ${flagg}`)
        }
      }
      if (oppgave.type === 'registrer_aktiviteter' || oppgave.type === 'bygg_soknad' || oppgave.type === 'reiseplan') {
        for (const flagg of oppgave.flagg) {
          if (!flaggTillatt.has(flagg)) feil.push(`${oppgave.id}: ukjent flagg ${flagg}`)
        }
      }
      if (oppgave.type === 'intervju_svar') {
        if (!gyldigLydNavn(oppgave.spoersmalLyd)) {
          feil.push(`${oppgave.id}: ugyldig spoersmalLyd ${oppgave.spoersmalLyd}`)
        }
        const personer = ['olena', 'taras', 'sofiia']
        for (const personId of personer) {
          const alt = oppgave.alternativer.filter((a) => a.personer.includes(personId))
          const kvaliteter = new Set(alt.map((a) => a.kvalitet))
          if (!kvaliteter.has('kort') || !kvaliteter.has('langt') || !kvaliteter.has('godt')) {
            feil.push(`${oppgave.id}: mangler kort/langt/godt for ${personId}`)
          }
        }
      }
      if (oppgave.type === 'bygg_soknad') {
        const personer = ['olena', 'taras', 'sofiia']
        for (const felt of ['innledning', 'hvorfor', 'avslutning'] as const) {
          for (const personId of personer) {
            if (!oppgave[felt].some((a) => a.personer.includes(personId))) {
              feil.push(`${oppgave.id}: ${felt} mangler avsnitt for ${personId}`)
            }
          }
        }
      }
      if (oppgave.type === 'match_sjekkliste') {
        if (!oppgave.annonseId && !oppgave.fallbackPerPerson) {
          feil.push(`${oppgave.id}: mangler annonseId eller fallbackPerPerson`)
        }
        if (oppgave.annonseId && !annonser.some((a) => a.id === oppgave.annonseId)) {
          feil.push(`${oppgave.id}: ukjent annonseId ${oppgave.annonseId}`)
        }
        if (oppgave.fallbackPerPerson) {
          for (const [personId, annonseId] of Object.entries(oppgave.fallbackPerPerson)) {
            if (!annonser.some((a) => a.id === annonseId)) {
              feil.push(`${oppgave.id}: ukjent fallback-annonse ${annonseId} for ${personId}`)
            }
          }
        }
      }
    }

    if (scene.media.bilde && !gyldigBildeNavn(scene.media.bilde)) {
      feil.push(`${scene.id}: ugyldig bildenavn ${scene.media.bilde}`)
    }
    if (scene.media.lyd && !gyldigLydNavn(scene.media.lyd)) {
      feil.push(`${scene.id}: ugyldig lydnavn ${scene.media.lyd}`)
    }
  }

  const tekster: string[] = []
  samleTekst(episode, tekster)
  const kjenteOrd = new Set(ordliste.map((o) => o.id))
  for (const tekst of tekster) {
    for (const id of trekkUtOrdId(tekst)) {
      if (!kjenteOrd.has(id)) feil.push(`Ukjent ordtoken {{${id}}}`)
    }
  }
}

function validerFlaggRekkefolge(episoder: Episode[]): void {
  const sortert = [...episoder].sort((a, b) => a.nummer - b.nummer)
  const tidligere = new Set<string>()
  for (const episode of sortert) {
    const synlige: string[] = []
    for (const punkt of episode.oppsummering ?? []) {
      if (punkt.visHvisFlagg) synlige.push(punkt.visHvisFlagg)
      if (punkt.visHvisIkkeFlagg) synlige.push(punkt.visHvisIkkeFlagg)
    }
    for (const scene of episode.scener) {
      for (const valg of scene.valg) {
        if (valg.visHvisFlagg) synlige.push(valg.visHvisFlagg)
        if (valg.visHvisIkkeFlagg) synlige.push(valg.visHvisIkkeFlagg)
      }
    }
    for (const flagg of synlige) {
      const her = episode.tillatteFlagg.includes(flagg)
      const fraTidligere = tidligere.has(flagg)
      if (!her && !fraTidligere) {
        feil.push(`${episode.id}: visHvisFlagg ${flagg} finnes ikke i denne eller tidligere episoder`)
      }
      if (her && fraTidligere) {
        feil.push(
          `${episode.id}: ${flagg} er fra tidligere episode og må ikke ligge i tillatteFlagg (blir slettet ved replay)`,
        )
      }
    }
    for (const flagg of episode.tillatteFlagg) tidligere.add(flagg)
  }
}

function validerOrdliste(ordliste: Ord[]): void {
  const ider = new Set<string>()
  for (const ord of ordliste) {
    if (ider.has(ord.id)) feil.push(`Duplikat ord ${ord.id}`)
    ider.add(ord.id)
    if (!ord.oversettelser.uk || !ord.oversettelser.en || !ord.oversettelser.ar) {
      feil.push(`${ord.id}: mangler oversettelse`)
    }
    if (ord.bilde && !gyldigBildeNavn(ord.bilde)) feil.push(`${ord.id}: ugyldig bilde`)
    if (ord.lyd && !gyldigLydNavn(ord.lyd)) feil.push(`${ord.id}: ugyldig lyd`)
  }
}

function validerMediaFiler(): void {
  const scenario = scenarioSkjema.parse(lesJson(join(rot, 'src/innhold/scenario.json')))
  const personer = personerFilSkjema.parse(lesJson(join(rot, 'src/innhold/personer.json')))
  const ordliste = ordlisteFilSkjema.parse(lesJson(join(rot, 'src/innhold/ordliste.json')))
  const annonser = annonserFilSkjema.parse(lesJson(join(rot, 'src/innhold/annonser.json')))
  const episoder: Episode[] = []
  const personIder = personer.personer.map((p: Person) => p.id)

  for (const oversikt of scenario.episoder) {
    if (!oversikt.fil) continue
    const sti = join(rot, 'src/innhold/episoder', oversikt.fil)
    if (!existsSync(sti)) {
      feil.push(`Mangler episodefil ${oversikt.fil}`)
      continue
    }
    episoder.push(episodeSkjema.parse(lesJson(sti)))
  }

  validerOrdliste(ordliste.ord)
  for (const episode of episoder) validerEpisode(episode, ordliste.ord, annonser.annonser)
  validerFlaggRekkefolge(episoder)

  const satserSti = join(rot, 'src/innhold/satser-2026.json')
  const arbeidSti = join(rot, 'src/innhold/arbeid.json')
  if (!existsSync(satserSti)) feil.push('Mangler satser-2026.json')
  else satserSkjema.parse(lesJson(satserSti))
  if (!existsSync(arbeidSti)) feil.push('Mangler arbeid.json')
  else {
    const arbeid = arbeidFilSkjema.parse(lesJson(arbeidSti))
    for (const person of personer.personer) {
      const forhold = arbeid.personer[person.id]
      if (!forhold) {
        feil.push(`arbeid.json: mangler person ${person.id}`)
        continue
      }
      if (forhold.fodselsnummer !== person.fodselsnummer) {
        feil.push(`arbeid.json: fødselsnummer matcher ikke ${person.id}`)
      }
    }
    for (const id of Object.keys(arbeid.personer)) {
      if (!personIder.includes(id)) feil.push(`arbeid.json: ukjent person ${id}`)
    }
  }

  const ruterSti = join(rot, 'src/innhold/ruter.json')
  const sluttSti = join(rot, 'src/innhold/slutt.json')
  if (!existsSync(ruterSti)) feil.push('Mangler ruter.json')
  if (!existsSync(sluttSti)) feil.push('Mangler slutt.json')
  if (existsSync(ruterSti) && existsSync(sluttSti)) {
    const ruter = ruterFilSkjema.parse(lesJson(ruterSti))
    sluttFilSkjema.parse(lesJson(sluttSti))
    for (const personId of personIder) {
      const oppdrag = ruter.oppdrag[personId]
      if (!oppdrag) {
        feil.push(`ruter.json: mangler oppdrag for ${personId}`)
        continue
      }
      const avgang = ruter.avganger.find((a) => a.id === oppdrag.riktigAvgangId)
      if (!avgang) {
        feil.push(`ruter.json: ukjent avgang ${oppdrag.riktigAvgangId} for ${personId}`)
      } else if (avgang.fra !== oppdrag.fra || avgang.til !== oppdrag.til) {
        feil.push(`ruter.json: ${oppdrag.riktigAvgangId} matcher ikke fra/til for ${personId}`)
      } else if (!kommerMedBuffer(avgang, oppdrag.ankomst, 10)) {
        feil.push(`ruter.json: ${oppdrag.riktigAvgangId} kommer for sent med 10 min buffer`)
      }
    }
    for (const avgang of ruter.avganger) {
      if (!ruter.holdeplasser.some((h) => h.id === avgang.fra)) {
        feil.push(`ruter.json: ukjent fra ${avgang.fra}`)
      }
      if (!ruter.holdeplasser.some((h) => h.id === avgang.til)) {
        feil.push(`ruter.json: ukjent til ${avgang.til}`)
      }
      if (!ruter.linjer.some((l) => l.id === avgang.linjeId)) {
        feil.push(`ruter.json: ukjent linje ${avgang.linjeId}`)
      }
    }
  }

  const kjenteOrd = new Set(ordliste.ord.map((o: Ord) => o.id))
  for (const annonse of annonser.annonser) {
    for (const personId of personIder) {
      for (const krav of annonse.krav) {
        if (!krav.fasit[personId]) {
          feil.push(`${annonse.id}.${krav.id}: mangler fasit for ${personId}`)
        }
      }
    }
    const tekster: string[] = []
    samleTekst(annonse, tekster)
    for (const tekst of tekster) {
      for (const id of trekkUtOrdId(tekst)) {
        if (!kjenteOrd.has(id)) feil.push(`Annonse ${annonse.id}: ukjent ordtoken {{${id}}}`)
      }
    }
  }

  const bilder: string[] = [
    ...personer.personer.map((p) => p.bilde),
    ...annonser.annonser.map((a) => a.bilde),
  ]
  const lyd: string[] = personer.personer.map((p) => p.presentasjonLyd)
  for (const episode of episoder) {
    for (const scene of episode.scener) {
      if (scene.media.bilde) bilder.push(scene.media.bilde)
      if (scene.media.lyd) lyd.push(scene.media.lyd)
      for (const oppgave of scene.oppgaver) {
        if (oppgave.instruksjonLyd) lyd.push(oppgave.instruksjonLyd)
        if (oppgave.type === 'intervju_svar') lyd.push(oppgave.spoersmalLyd)
      }
    }
  }
  for (const ord of ordliste.ord) {
    if (ord.bilde) bilder.push(ord.bilde)
    if (ord.lyd) lyd.push(ord.lyd)
  }

  for (const fil of [...new Set(bilder)]) {
    const sti = join(rot, 'public/media/bilder', fil)
    if (!existsSync(sti)) feil.push(`Mangler bilde ${fil}`)
  }
  for (const fil of [...new Set(lyd)]) {
    const sti = join(rot, 'public/media/lyd', fil)
    if (!existsSync(sti)) feil.push(`Mangler lyd ${fil}`)
  }

  const mediaDir = join(rot, 'public/media')
  if (existsSync(join(mediaDir, 'bilder'))) {
    for (const fil of readdirSync(join(mediaDir, 'bilder'))) {
      if (!gyldigBildeNavn(fil)) feil.push(`Ugyldig bildenavn på disk: ${fil}`)
    }
  }
  if (existsSync(join(mediaDir, 'lyd'))) {
    for (const fil of readdirSync(join(mediaDir, 'lyd'))) {
      if (!gyldigLydNavn(fil)) feil.push(`Ugyldig lydnavn på disk: ${fil}`)
    }
  }
}

try {
  validerMediaFiler()
} catch (err) {
  feil.push(err instanceof Error ? err.message : String(err))
}

if (feil.length > 0) {
  console.error(`Validering feilet (${feil.length}):`)
  for (const linje of feil) console.error(` - ${linje}`)
  process.exit(1)
}

console.log('Innholdet er gyldig.')
