import type { Annonse } from '../modell/typer'
import type { LagretSok } from './tilstand'

export function filtrerAnnonser(annonser: Annonse[], sok: Pick<LagretSok, 'sokkeordId' | 'stedId' | 'stillingId'>): Annonse[] {
  return annonser.filter((annonse) => {
    const ordOk = annonse.sokkeord.includes(sok.sokkeordId)
    const stedOk = annonse.kommune === sok.stedId
    const stillingOk = sok.stillingId === 'heltid' ? annonse.heltid : !annonse.heltid
    return ordOk && stedOk && stillingOk
  })
}

export const KOMMUNE_NAVN: Record<string, string> = {
  molde: 'Molde',
  vestnes: 'Vestnes',
  aukra: 'Aukra',
  kristiansund: 'Kristiansund',
}
