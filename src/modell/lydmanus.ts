import type { Innhold } from '../innhold/lastInnhold'
import { tilLesetekst } from '../utils/tekst'

export type LydRolle = 'person' | 'scene' | 'intervju' | 'lytt' | 'ord'

export const LYD_ROLLE_NAVN: Record<LydRolle, string> = {
  person: 'Startskjerm · person',
  scene: 'Scene · les teksten',
  intervju: 'Intervju · spørsmålet',
  lytt: 'Lytt-oppgave · annen stemme',
  ord: 'Ordkort',
}

export interface Lydklipp {
  fil: string
  rolle: LydRolle
  episodeId: string | null
  episodeNr: number | null
  episodeTittel: string | null
  steder: string[]
  les: string
}

const ROLLE_VEKT: Record<LydRolle, number> = {
  lytt: 4,
  intervju: 3,
  person: 2,
  ord: 2,
  scene: 1,
}

function settInn(
  kart: Map<string, Lydklipp>,
  klipp: Omit<Lydklipp, 'steder'> & { sted: string },
): void {
  const eksisterende = kart.get(klipp.fil)
  if (!eksisterende) {
    kart.set(klipp.fil, {
      fil: klipp.fil,
      rolle: klipp.rolle,
      episodeId: klipp.episodeId,
      episodeNr: klipp.episodeNr,
      episodeTittel: klipp.episodeTittel,
      steder: [klipp.sted],
      les: klipp.les,
    })
    return
  }
  if (!eksisterende.steder.includes(klipp.sted)) eksisterende.steder.push(klipp.sted)
  if (ROLLE_VEKT[klipp.rolle] > ROLLE_VEKT[eksisterende.rolle]) {
    eksisterende.rolle = klipp.rolle
    eksisterende.les = klipp.les
  }
}

export function samleLydklipp(innhold: Innhold): Lydklipp[] {
  const kart = new Map<string, Lydklipp>()

  for (const person of innhold.personer) {
    settInn(kart, {
      fil: person.presentasjonLyd,
      rolle: 'person',
      episodeId: null,
      episodeNr: 0,
      episodeTittel: 'Startskjerm',
      sted: `Startskjerm · ${person.fornavn} ${person.etternavn}`,
      les: tilLesetekst(person.presentasjon),
    })
  }

  for (const ord of innhold.ordliste) {
    if (!ord.lyd) continue
    settInn(kart, {
      fil: ord.lyd,
      rolle: 'ord',
      episodeId: null,
      episodeNr: 0,
      episodeTittel: 'Ordliste',
      sted: `Ordkort · ${ord.ord}`,
      les: ord.ord,
    })
  }

  for (const episode of innhold.episoder) {
    for (const scene of episode.scener) {
      const sted = `Episode ${episode.nummer} · ${scene.tittel}`
      if (scene.media.lyd) {
        settInn(kart, {
          fil: scene.media.lyd,
          rolle: 'scene',
          episodeId: episode.id,
          episodeNr: episode.nummer,
          episodeTittel: episode.tittel,
          sted,
          les: tilLesetekst(scene.media.manus ?? scene.tekst),
        })
      }
      for (const oppgave of scene.oppgaver) {
        if (oppgave.instruksjonLyd) {
          settInn(kart, {
            fil: oppgave.instruksjonLyd,
            rolle: 'lytt',
            episodeId: episode.id,
            episodeNr: episode.nummer,
            episodeTittel: episode.tittel,
            sted: `${sted} · lytt-oppgave`,
            les: tilLesetekst(oppgave.lydManus ?? oppgave.instruksjon),
          })
        }
        if (oppgave.type === 'intervju_svar') {
          settInn(kart, {
            fil: oppgave.spoersmalLyd,
            rolle: 'intervju',
            episodeId: episode.id,
            episodeNr: episode.nummer,
            episodeTittel: episode.tittel,
            sted: `${sted} · intervju`,
            les: tilLesetekst(oppgave.lydManus ?? oppgave.spoersmal),
          })
        }
      }
    }
  }

  return [...kart.values()].sort((a, b) => {
    const nr = (a.episodeNr ?? 0) - (b.episodeNr ?? 0)
    if (nr !== 0) return nr
    return a.fil.localeCompare(b.fil, 'nb')
  })
}

export function grupperLydklipp(klipp: Lydklipp[]): Array<{ tittel: string; klipp: Lydklipp[] }> {
  const grupper: Array<{ tittel: string; klipp: Lydklipp[] }> = []
  for (const k of klipp) {
    const tittel = k.episodeNr
      ? `Episode ${k.episodeNr}: ${k.episodeTittel}`
      : (k.episodeTittel ?? 'Andre')
    const siste = grupper[grupper.length - 1]
    if (siste && siste.tittel === tittel) siste.klipp.push(k)
    else grupper.push({ tittel, klipp: [k] })
  }
  return grupper
}
