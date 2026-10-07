import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { arbeidFilSkjema, personerFilSkjema } from '../src/modell/skjema.ts'
import { byggLonnsslipp, nyttSkattekortFraValg } from '../src/spill/lonn.ts'
import { beregnSkatt, frikortTrekkDenneMaaned, maanedslonnFraTimer } from '../src/spill/skatt.ts'

const feil: string[] = []

function sjekk(navn: string, faktisk: number, forventet: number) {
  if (faktisk !== forventet) {
    feil.push(`${navn}: fikk ${faktisk}, forventet ${forventet}`)
  }
}

const r = beregnSkatt(450_000)
sjekk('trygdeavgift', r.trygdeavgift, 34_200)
sjekk('trinnskatt', r.trinnskatt, 6_835)
sjekk('skattAlminnelig', r.skattAlminnelig, 52_747)
sjekk('aarsskatt', r.aarsskatt, 93_782)
sjekk('trekkprosent', r.trekkprosent, 20.8)

const rot = join(dirname(fileURLToPath(import.meta.url)), '..')
const arbeid = arbeidFilSkjema.parse(
  JSON.parse(readFileSync(join(rot, 'src/innhold/arbeid.json'), 'utf8')) as unknown,
)
const personer = personerFilSkjema.parse(
  JSON.parse(readFileSync(join(rot, 'src/innhold/personer.json'), 'utf8')) as unknown,
).personer

const olena = arbeid.personer.olena
if (olena) {
  const brutto = maanedslonnFraTimer(olena)
  sjekk('olena-frikort-50', frikortTrekkDenneMaaned(brutto, olena.inntektHittil), 2_800)
}

for (const person of personer) {
  const forhold = arbeid.personer[person.id]
  if (!forhold) {
    feil.push(`Mangler arbeidsforhold for ${person.id}`)
    continue
  }
  const kort = nyttSkattekortFraValg(forhold, arbeid.maanederIgjen, false)
  const slipp = byggLonnsslipp(person, arbeid, kort, false)
  if (!slipp) {
    feil.push(`Mangler lønnsslipp for ${person.id}`)
    continue
  }
  if (slipp.skattetrekk !== kort.maanedstrekk) {
    feil.push(
      `${person.id}: lønnsslipp ${slipp.skattetrekk} != skattekort ${kort.maanedstrekk}`,
    )
  }
}

if (feil.length > 0) {
  console.error('Skattetest feilet:')
  for (const linje of feil) console.error(` - ${linje}`)
  process.exit(1)
}

console.log('Skattetest OK: 450 000 kr → 93 782 kr (20,8 %). Samme trekk på kort og slipp.')
