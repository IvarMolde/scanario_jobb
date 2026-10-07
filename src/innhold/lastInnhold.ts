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
} from '../modell/skjema'
import type {
  Annonse,
  ArbeidInnhold,
  Episode,
  Ord,
  Person,
  Ruter,
  Satser,
  Scenario,
  Scene,
  SluttInnhold,
} from '../modell/typer'
import arbeidRaw from './arbeid.json'
import annonserRaw from './annonser.json'
import e01Raw from './episoder/e01.json'
import e02Raw from './episoder/e02.json'
import e03Raw from './episoder/e03.json'
import e04Raw from './episoder/e04.json'
import e05Raw from './episoder/e05.json'
import e06Raw from './episoder/e06.json'
import e07Raw from './episoder/e07.json'
import e08Raw from './episoder/e08.json'
import e09Raw from './episoder/e09.json'
import e10Raw from './episoder/e10.json'
import e11Raw from './episoder/e11.json'
import ordlisteRaw from './ordliste.json'
import satserRaw from './satser-2026.json'
import personerRaw from './personer.json'
import ruterRaw from './ruter.json'
import scenarioRaw from './scenario.json'
import sluttRaw from './slutt.json'

export interface Innhold {
  scenario: Scenario
  personer: Person[]
  ordliste: Ord[]
  episoder: Episode[]
  annonser: Annonse[]
  ruter: Ruter
  slutt: SluttInnhold
  satser: Satser
  arbeid: ArbeidInnhold
}

export class InnholdFeil extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InnholdFeil'
  }
}

export function lastInnhold(): Innhold {
  const scenario = scenarioSkjema.parse(scenarioRaw)
  const personer = personerFilSkjema.parse(personerRaw).personer
  const ordliste = ordlisteFilSkjema.parse(ordlisteRaw).ord
  const e01 = episodeSkjema.parse(e01Raw)
  const e02 = episodeSkjema.parse(e02Raw)
  const e03 = episodeSkjema.parse(e03Raw)
  const e04 = episodeSkjema.parse(e04Raw)
  const e05 = episodeSkjema.parse(e05Raw)
  const e06 = episodeSkjema.parse(e06Raw)
  const e07 = episodeSkjema.parse(e07Raw)
  const e08 = episodeSkjema.parse(e08Raw)
  const e09 = episodeSkjema.parse(e09Raw)
  const e10 = episodeSkjema.parse(e10Raw)
  const e11 = episodeSkjema.parse(e11Raw)
  const annonser = annonserFilSkjema.parse(annonserRaw).annonser
  const ruter = ruterFilSkjema.parse(ruterRaw)
  const slutt = sluttFilSkjema.parse(sluttRaw)
  const satser = satserSkjema.parse(satserRaw)
  const arbeid = arbeidFilSkjema.parse(arbeidRaw)

  return {
    scenario,
    personer,
    ordliste,
    episoder: [e01, e02, e03, e04, e05, e06, e07, e08, e09, e10, e11],
    annonser,
    ruter,
    slutt,
    satser,
    arbeid,
  }
}

export function hentEpisode(innhold: Innhold, id: string): Episode | undefined {
  return innhold.episoder.find((episode) => episode.id === id)
}

export function hentScene(episode: Episode, id: string): Scene | undefined {
  return episode.scener.find((scene) => scene.id === id)
}

export function hentPerson(innhold: Innhold, id: string): Person | undefined {
  return innhold.personer.find((person) => person.id === id)
}

export function hentOrd(innhold: Innhold, id: string): Ord | undefined {
  return innhold.ordliste.find((ord) => ord.id === id)
}

export function hentAnnonse(innhold: Innhold, id: string): Annonse | undefined {
  return innhold.annonser.find((annonse) => annonse.id === id)
}
