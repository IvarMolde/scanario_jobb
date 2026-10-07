import type { Avgang, Linje, ReiseOppdrag, Ruter, SluttUtfall } from '../modell/typer'

export interface LagretReise {
  fra: string
  til: string
  avgangId: string
}

export function tilMinutt(klokke: string): number {
  const [timer, minutt] = klokke.split(':').map((n) => Number(n))
  return (timer ?? 0) * 60 + (minutt ?? 0)
}

export function filtrerAvganger(ruter: Ruter, fra: string, til: string): Avgang[] {
  return ruter.avganger
    .filter((a) => a.fra === fra && a.til === til)
    .slice()
    .sort((a, b) => tilMinutt(a.avgang) - tilMinutt(b.avgang))
}

export function linjeNavn(ruter: Ruter, linjeId: string): Linje | undefined {
  return ruter.linjer.find((l) => l.id === linjeId)
}

export function holdeplassNavn(ruter: Ruter, id: string): string {
  return ruter.holdeplasser.find((h) => h.id === id)?.navn ?? id
}

export function oppdragFor(ruter: Ruter, personId: string): ReiseOppdrag | undefined {
  return ruter.oppdrag[personId]
}

export function kommerMedBuffer(avgang: Avgang, ankomst: string, bufferMin: number): boolean {
  return tilMinutt(avgang.ankomst) <= tilMinutt(ankomst) - bufferMin
}

export function velgUtfall(utfall: SluttUtfall[], flagg: string[]): SluttUtfall {
  const treff = utfall.find((u) => {
    const krever = u.kreverFlagg.every((f) => flagg.includes(f))
    const unnga = u.unngaFlagg.every((f) => !flagg.includes(f))
    return krever && unnga
  })
  return treff ?? utfall[utfall.length - 1] ?? utfall[0]!
}
