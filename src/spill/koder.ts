/** Lager en tilfeldig sekssifret kode til innlogging. */
export function tilfeldigSekssiffer(): string {
  const n = Math.floor(100000 + Math.random() * 900000)
  return String(n)
}

export type InnloggingMetode = 'kodebrikke' | 'sms' | 'passord'

export interface InnloggingKoder {
  passord: string
  kodebrikke: string | null
  sms: string | null
}
