export const BILDE_MONSTER = /^[a-z0-9-]+\.(svg|jpg|jpeg|png|webp)$/
export const LYD_MONSTER = /^[a-z0-9-]+\.(mp3|wav|ogg)$/

export function gyldigBildeNavn(fil: string): boolean {
  return BILDE_MONSTER.test(fil)
}

export function gyldigLydNavn(fil: string): boolean {
  return LYD_MONSTER.test(fil)
}
