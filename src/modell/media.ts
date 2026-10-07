import type { Innhold } from '../innhold/lastInnhold'

export interface MediaRef {
  type: 'bilde' | 'lyd'
  fil: string
  kilde: string
}

export function bildeUrl(fil: string): string {
  return `${import.meta.env.BASE_URL}media/bilder/${fil}`
}

export function lydUrl(fil: string): string {
  return `${import.meta.env.BASE_URL}media/lyd/${fil}`
}

export function samleMedia(innhold: Innhold): MediaRef[] {
  const funnet: MediaRef[] = []

  for (const person of innhold.personer) {
    funnet.push({ type: 'bilde', fil: person.bilde, kilde: `person.${person.id}.bilde` })
    funnet.push({ type: 'lyd', fil: person.presentasjonLyd, kilde: `person.${person.id}.presentasjonLyd` })
  }

  for (const ord of innhold.ordliste) {
    if (ord.bilde) {
      funnet.push({ type: 'bilde', fil: ord.bilde, kilde: `ord.${ord.id}.bilde` })
    }
    if (ord.lyd) {
      funnet.push({ type: 'lyd', fil: ord.lyd, kilde: `ord.${ord.id}.lyd` })
    }
  }

  for (const annonse of innhold.annonser) {
    funnet.push({ type: 'bilde', fil: annonse.bilde, kilde: `annonse.${annonse.id}.bilde` })
  }

  for (const episode of innhold.episoder) {
    for (const scene of episode.scener) {
      if (scene.media.bilde) {
        funnet.push({
          type: 'bilde',
          fil: scene.media.bilde,
          kilde: `${scene.id}.media.bilde`,
        })
      }
      if (scene.media.lyd) {
        funnet.push({
          type: 'lyd',
          fil: scene.media.lyd,
          kilde: `${scene.id}.media.lyd`,
        })
      }
      for (const oppgave of scene.oppgaver) {
        if (oppgave.instruksjonLyd) {
          funnet.push({
            type: 'lyd',
            fil: oppgave.instruksjonLyd,
            kilde: `${oppgave.id}.instruksjonLyd`,
          })
        }
        if (oppgave.type === 'intervju_svar') {
          funnet.push({
            type: 'lyd',
            fil: oppgave.spoersmalLyd,
            kilde: `${oppgave.id}.spoersmalLyd`,
          })
        }
      }
    }
  }

  return funnet
}

export function unikeFiler(refs: MediaRef[], type: 'bilde' | 'lyd'): string[] {
  return [...new Set(refs.filter((ref) => ref.type === type).map((ref) => ref.fil))]
}
