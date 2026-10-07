import type { Aktivitet, AktivitetStatus, Annonse } from '../modell/typer'

export const STANDARD_JOBBER: Record<string, string[]> = {
  olena: ['havna-handel', 'kafe-fjord'],
  taras: ['fjordlager', 'bygg-tre'],
  sofiia: ['molde-omsorg', 'solsiden-bolig'],
}

export function jobberForPerson(
  valgte: string[],
  personId: string,
  annonser: Annonse[],
): Annonse[] {
  const kilder = valgte.length >= 2 ? valgte : (STANDARD_JOBBER[personId] ?? [])
  return kilder
    .map((id) => annonser.find((a) => a.id === id))
    .filter((a): a is Annonse => Boolean(a))
}

export function matchAnnonseId(
  valgte: string[],
  personId: string,
  fastId: string | undefined,
  fallback: Record<string, string> | undefined,
): string | undefined {
  if (fastId) return fastId
  if (valgte[0]) return valgte[0]
  return fallback?.[personId] ?? STANDARD_JOBBER[personId]?.[0]
}

export function aktivitetFraAnnonse(annonse: Annonse): Aktivitet {
  return {
    id: annonse.id,
    annonseId: annonse.id,
    tittel: annonse.tittel,
    bedrift: annonse.bedrift,
    status: 'skal_soke',
    frist: annonse.soknadsfrist,
  }
}

export function settStatus(
  aktiviteter: Aktivitet[],
  status: AktivitetStatus,
  annonseId?: string | null,
): Aktivitet[] {
  if (aktiviteter.length === 0) return aktiviteter
  if (annonseId) {
    return aktiviteter.map((a) => (a.annonseId === annonseId ? { ...a, status } : a))
  }
  if (status === 'avslag') {
    const idx = aktiviteter.findIndex((a) => a.status !== 'innkalt')
    if (idx < 0) return aktiviteter
    return aktiviteter.map((a, i) => (i === idx ? { ...a, status } : a))
  }
  if (status === 'innkalt' || status === 'sendt_soknad') {
    const idx = aktiviteter.findIndex((a) => a.status === 'sendt_soknad' || a.status === 'skal_soke')
    if (idx < 0) return aktiviteter.map((a, i) => (i === 0 ? { ...a, status } : a))
    return aktiviteter.map((a, i) => (i === idx ? { ...a, status } : a))
  }
  return aktiviteter.map((a, i) => (i === 0 ? { ...a, status } : a))
}

export function visValg(valg: { visHvisFlagg?: string; visHvisIkkeFlagg?: string }, flagg: string[]): boolean {
  if (valg.visHvisFlagg && !flagg.includes(valg.visHvisFlagg)) return false
  if (valg.visHvisIkkeFlagg && flagg.includes(valg.visHvisIkkeFlagg)) return false
  return true
}
