import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { lastInnhold } from '../src/innhold/lastInnhold.ts'
import { LYD_ROLLE_NAVN, grupperLydklipp, samleLydklipp } from '../src/modell/lydmanus.ts'

const rot = join(dirname(fileURLToPath(import.meta.url)), '..')
const innhold = lastInnhold()
const klipp = samleLydklipp(innhold)
const grupper = grupperLydklipp(klipp)

const linjer: string[] = [
  '# Innspilling – Jobbreisen',
  '',
  'Les høyt, sakte og tydelig (A2). Én fil = ett klipp. Lagre med **nøyaktig filnavn** i `public/media/lyd`. JSON trenger ikke endres.',
  '',
  `Antall unike lydfiler: **${klipp.length}**.`,
  '',
  'Åpne også `?laerer=1` i appen for å kopiere filnavn og høre plassholderen.',
  '',
]

for (const gruppe of grupper) {
  linjer.push(`## ${gruppe.tittel}`, '')
  for (const k of gruppe.klipp) {
    linjer.push(`### \`${k.fil}\``)
    linjer.push('')
    linjer.push(`- Rolle: ${LYD_ROLLE_NAVN[k.rolle]}`)
    linjer.push(`- Spilles: ${k.steder.join('; ')}`)
    linjer.push('')
    linjer.push('Les dette:')
    linjer.push('')
    linjer.push('> ' + k.les.replaceAll('\n', '\n> '))
    linjer.push('')
  }
}

const sti = join(rot, 'INNSPILLING.md')
mkdirSync(rot, { recursive: true })
writeFileSync(sti, linjer.join('\n'), 'utf8')
console.log(`Skrev ${klipp.length} lydklipp til INNSPILLING.md`)
