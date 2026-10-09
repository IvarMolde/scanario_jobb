export type SkrivNormalisering = 'tekst' | 'dato' | 'prosent'

/** Normaliserer elevsvar før sammenligning med fasit. */
export function normaliserSkrivSvar(svar: string, modus: SkrivNormalisering): string {
  let s = svar.trim().replace(/\u00a0/g, ' ').replace(/\s+/g, ' ')

  if (modus === 'dato') {
    return s.replace(/\s/g, '').toLowerCase()
  }

  if (modus === 'prosent') {
    s = s.toLowerCase().replace(/\s*prosent\s*$/i, '%')
    s = s.replace(/\s*%\s*$/, '%').replace(/\s+/g, '')
    return s
  }

  return s.toLowerCase()
}

export function erRiktigSkrivSvar(
  svar: string,
  riktigeSvar: string[],
  modus: SkrivNormalisering,
): boolean {
  const elev = normaliserSkrivSvar(svar, modus)
  if (!elev) return false
  return riktigeSvar.some((fasit) => normaliserSkrivSvar(fasit, modus) === elev)
}
