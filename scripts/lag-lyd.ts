import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

function lagWav(sekunder = 0.6, frekvens = 440): Buffer {
  const sampleRate = 22050
  const samples = Math.floor(sampleRate * sekunder)
  const dataSize = samples * 2
  const buffer = Buffer.alloc(44 + dataSize)
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + dataSize, 4)
  buffer.write('WAVE', 8)
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20)
  buffer.writeUInt16LE(1, 22)
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(sampleRate * 2, 28)
  buffer.writeUInt16LE(2, 32)
  buffer.writeUInt16LE(16, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(dataSize, 40)
  for (let i = 0; i < samples; i += 1) {
    const fade = i < 400 ? i / 400 : i > samples - 400 ? (samples - i) / 400 : 1
    const verdi = Math.sin((2 * Math.PI * frekvens * i) / sampleRate) * 0.22 * fade
    buffer.writeInt16LE(Math.round(verdi * 32767), 44 + i * 2)
  }
  return buffer
}

const mappe = join(dirname(fileURLToPath(import.meta.url)), '../public/media/lyd')
mkdirSync(mappe, { recursive: true })

const filer: Array<[string, number]> = [
  ['olena-presentasjon.mp3', 392],
  ['taras-presentasjon.wav', 330],
  ['sofiia-presentasjon.wav', 494],
  ['e01-s01-kalender.wav', 349],
  ['e01-s02-melding.wav', 440],
  ['e01-s03-melding.wav', 466],
  ['e01-s04a-svar.wav', 523],
  ['e01-s04b-svar.wav', 311],
  ['e01-s05-feil.wav', 277],
  ['e02-s01-epost.wav', 370],
  ['e02-s02-cv.wav', 392],
  ['e02-s03-egenskaper.wav', 415],
  ['e02-s04-setninger.wav', 440],
  ['e02-s05-referanse.wav', 466],
  ['e02-s06-verb.wav', 494],
  ['e03-s01-portal.wav', 349],
  ['e03-s02-sok.wav', 330],
  ['e03-s03-treff.wav', 311],
  ['e03-s04-annonse.wav', 294],
  ['e03-s05-dato.wav', 277],
  ['e04-s01-magasin.wav', 523],
  ['e04-s02-krav.wav', 554],
  ['e04-s03-match.wav', 587],
  ['e04-s04-lager.wav', 622],
  ['e04-s05-omsorg.wav', 659],
  ['e04-s06-valg.wav', 698],
  ['e05-s01-plan.wav', 330],
  ['e05-s02-dato.wav', 349],
  ['e05-s03-skjema.wav', 370],
  ['e05-s04-sms.wav', 392],
  ['e05-s05-svar.wav', 415],
  ['e06-s01-cv.wav', 440],
  ['e06-s02-match.wav', 466],
  ['e06-s03-soknad.wav', 494],
  ['e06-s04-rett.wav', 523],
  ['e06-s05-formelt.wav', 554],
  ['e07-s01-anrop.wav', 277],
  ['e07-s02-sms.wav', 294],
  ['e07-s03-svar.wav', 311],
  ['e07-s04-avslag.wav', 330],
  ['e07-s05-kalender.wav', 349],
  ['e08-s01-forbered.wav', 370],
  ['e08-s02-pakke.wav', 392],
  ['e08-s03-q.wav', 415],
  ['e08-s04-q.wav', 440],
  ['e08-s05-q.wav', 466],
  ['e08-s06-grammatikk.wav', 494],
  ['e08-s07-sporsmal.wav', 523],
  ['e09-s01-rute.wav', 330],
  ['e09-s02-forsinkelse.wav', 311],
  ['e09-s03-svar.wav', 294],
  ['e09-s04-avtale.wav', 277],
  ['e09-s05-forstedag.wav', 349],
  ['e09-s06-klokka.wav', 262],
  ['e10-s01-sms.wav', 330],
  ['e10-s02-svindel.wav', 311],
  ['e10-s03-trygg.wav', 294],
  ['e10-s04-login.wav', 277],
  ['e10-s05-tall.wav', 349],
  ['e10-s06-hvis.wav', 370],
  ['e10-s06-kollega.wav', 392],
  ['e10-s07-bekreft.wav', 415],
  ['e11-s01-epost.wav', 440],
  ['e11-s02-slipp.wav', 466],
  ['e11-s03-netto.wav', 494],
  ['e11-s04-regn.wav', 523],
  ['e11-s05-overtid.wav', 554],
  ['e11-s06-ferie.wav', 587],
  ['e11-s06-kollega.wav', 622],
  ['e11-s07-prep.wav', 659],
]

for (const [navn, hz] of filer) {
  writeFileSync(join(mappe, navn), lagWav(0.7, hz))
}

console.log(`Skrev ${filer.length} plassholder-lydfiler til public/media/lyd`)
