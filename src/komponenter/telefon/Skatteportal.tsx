import { useState } from 'react'
import type { Arbeidsforhold, Person } from '../../modell/typer'
import { SkattekortDokument } from '../skatt/SkattekortDokument'
import { nyttSkattekortFraValg } from '../../spill/lonn'
import {
  SATSER_2026,
  beregnSkatt,
  formatKr,
  forventetAarsinntekt,
  maanedslonnFraTimer,
  maanedstrekk,
} from '../../spill/skatt'
import { useSpill } from '../../spill/SpillProvider'

type Steg =
  | 'start'
  | 'metode'
  | 'koder'
  | 'min-side'
  | 'kort'
  | 'endre-lonn'
  | 'endre-hittil'
  | 'endre-fradrag'
  | 'beregning'
  | 'kvittering'

const METODER = ['Kodebrikke', 'SMS-kode', 'Passord'] as const

export function Skatteportal() {
  const { innhold, person, fremdrift, lagreSkattekort } = useSpill()
  const [steg, setSteg] = useState<Steg>(fremdrift.skattekort?.loggetInn ? 'min-side' : 'start')
  const [metode, setMetode] = useState<string | null>(null)
  const [fnr, setFnr] = useState('')
  const [kode, setKode] = useState('')
  const [loginFeil, setLoginFeil] = useState<string | null>(null)
  const [fagforening, setFagforening] = useState(fremdrift.skattekort?.fagforening ?? false)

  const forhold = person ? innhold.arbeid.personer[person.id] : undefined

  if (!person || !forhold) {
    return (
      <div>
        <header className="hjem-hode">
          <h1>Skatteøving</h1>
          <p>Se skattekortet ditt.</p>
        </header>
        <p>Velg en person først.</p>
      </div>
    )
  }

  const lagreInnlogging = () => {
    lagreSkattekort(
      {
        loggetInn: true,
        endret: fremdrift.skattekort?.endret ?? false,
        fagforening: fremdrift.skattekort?.fagforening ?? false,
        forventetInntekt: fremdrift.skattekort?.forventetInntekt ?? forhold.forventetInntektKort,
        trekkprosent: fremdrift.skattekort?.trekkprosent ?? 0,
        maanedstrekk: fremdrift.skattekort?.maanedstrekk ?? 0,
        aarsskatt: fremdrift.skattekort?.aarsskatt ?? 0,
      },
      [],
    )
    setSteg('min-side')
  }

  const bekreft = () => {
    const kort = nyttSkattekortFraValg(forhold, innhold.arbeid.maanederIgjen, fagforening)
    lagreSkattekort(kort, ['endret_skattekort'])
    setSteg('kvittering')
  }

  return (
    <div>
      <header className="hjem-hode">
        <div className="skatt-logo" aria-hidden="true">
          SØ
        </div>
        <h1>Skatteøving</h1>
        <p>Se og endre skattekortet ditt.</p>
      </header>

      {steg === 'start' ? (
        <div>
          <p>Her kan du se skattekortet og endre forventet inntekt.</p>
          <div className="handlinger">
            <button type="button" className="knapp" onClick={() => setSteg('metode')}>
              Logg inn
            </button>
          </div>
        </div>
      ) : null}

      {steg === 'metode' ? (
        <div>
          <h2>Velg innloggingsmetode</h2>
          <div className="valggruppe">
            {METODER.map((m) => (
              <button
                key={m}
                type="button"
                className="knapp knapp-sekundaer"
                aria-pressed={metode === m}
                onClick={() => setMetode(m)}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="handlinger">
            <button type="button" className="knapp" disabled={!metode} onClick={() => setSteg('koder')}>
              Neste
            </button>
            <button type="button" className="knapp knapp-sekundaer" onClick={() => setSteg('start')}>
              Tilbake
            </button>
          </div>
        </div>
      ) : null}

      {steg === 'koder' ? (
        <LoginSkjema
          person={person}
          forventetFnr={forhold.fodselsnummer}
          forventetKode={innhold.arbeid.engangskode}
          fnr={fnr}
          kode={kode}
          feil={loginFeil}
          onFnr={setFnr}
          onKode={setKode}
          onFeil={setLoginFeil}
          onOk={lagreInnlogging}
        />
      ) : null}

      {steg === 'min-side' ? (
        <div>
          <h2>Min side</h2>
          <p>Du er innlogget som {person.fornavn}.</p>
          <div className="handlinger">
            <button type="button" className="knapp" onClick={() => setSteg('kort')}>
              Skattekort
            </button>
          </div>
        </div>
      ) : null}

      {steg === 'kort' ? (
        <div>
          <SkattekortDokument
            person={person}
            forhold={forhold}
            skattekort={fremdrift.skattekort}
            maanederIgjen={innhold.arbeid.maanederIgjen}
          />
          <div className="handlinger">
            <button type="button" className="knapp" onClick={() => setSteg('endre-lonn')}>
              Endre skattekort
            </button>
            <button type="button" className="knapp knapp-sekundaer" onClick={() => setSteg('min-side')}>
              Tilbake
            </button>
          </div>
        </div>
      ) : null}

      {steg === 'endre-lonn' ? (
        <div>
          <h2>Lønn fra ny arbeidsgiver</h2>
          <p>
            Månedslønn: {formatKr(maanedslonnFraTimer(forhold))}. Måneder igjen av året:{' '}
            {innhold.arbeid.maanederIgjen}.
          </p>
          <p>
            {innhold.arbeid.maanederIgjen} × {formatKr(maanedslonnFraTimer(forhold))} ={' '}
            {formatKr(maanedslonnFraTimer(forhold) * innhold.arbeid.maanederIgjen)}.
          </p>
          <div className="handlinger">
            <button type="button" className="knapp" onClick={() => setSteg('endre-hittil')}>
              Neste
            </button>
          </div>
        </div>
      ) : null}

      {steg === 'endre-hittil' ? (
        <div>
          <h2>Inntekt tidligere i år</h2>
          <p>Du har tjent {formatKr(forhold.inntektHittil)} hittil i år.</p>
          <p>
            Forventet inntekt i år: {formatKr(forventetAarsinntekt(forhold, innhold.arbeid.maanederIgjen))}.
          </p>
          <div className="handlinger">
            <button type="button" className="knapp" onClick={() => setSteg('endre-fradrag')}>
              Neste
            </button>
          </div>
        </div>
      ) : null}

      {steg === 'endre-fradrag' ? (
        <div>
          <h2>Fradrag</h2>
          <p>Minstefradraget beregnes automatisk.</p>
          <p className="avkryss">
            <label htmlFor="skatt-fagforening">
              <input
                id="skatt-fagforening"
                type="checkbox"
                checked={fagforening}
                onChange={(e) => setFagforening(e.target.checked)}
              />{' '}
              Fagforeningskontingent, {formatKr(SATSER_2026.fagforeningAar)} i året (valgfritt)
            </label>
          </p>
          <div className="handlinger">
            <button type="button" className="knapp" onClick={() => setSteg('beregning')}>
              Se beregning
            </button>
          </div>
        </div>
      ) : null}

      {steg === 'beregning' ? (
        <BeregningSteg
          forhold={forhold}
          maanederIgjen={innhold.arbeid.maanederIgjen}
          fagforening={fagforening}
          onNeste={() => setSteg('kort')}
          onBekreft={bekreft}
        />
      ) : null}

      {steg === 'kvittering' ? (
        <div>
          <p className="tilbakemelding ok" role="status">
            Nytt skattekort er laget. Arbeidsgiveren henter det automatisk.
          </p>
          <SkattekortDokument
            person={person}
            forhold={forhold}
            skattekort={fremdrift.skattekort}
            maanederIgjen={innhold.arbeid.maanederIgjen}
          />
          <div className="handlinger">
            <button type="button" className="knapp knapp-sekundaer" onClick={() => setSteg('min-side')}>
              Min side
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function LoginSkjema({
  person,
  forventetFnr,
  forventetKode,
  fnr,
  kode,
  feil,
  onFnr,
  onKode,
  onFeil,
  onOk,
}: {
  person: Person
  forventetFnr: string
  forventetKode: string
  fnr: string
  kode: string
  feil: string | null
  onFnr: (v: string) => void
  onKode: (v: string) => void
  onFeil: (v: string | null) => void
  onOk: () => void
}) {
  return (
    <form
      className="plan-skjema"
      onSubmit={(e) => {
        e.preventDefault()
        const fnrOk = fnr.replaceAll(' ', '') === forventetFnr.replaceAll(' ', '')
        const kodeOk = kode.trim() === forventetKode
        if (!fnrOk || !kodeOk) {
          onFeil('Feil nummer eller kode. Se personkortet og Meldinger.')
          return
        }
        onFeil(null)
        onOk()
      }}
    >
      <h2>Logg inn</h2>
      <p>
        Skriv inn fødselsnummeret til {person.fornavn}. Koden kommer som SMS i Meldinger.
      </p>
      <label htmlFor="skatt-fnr">
        <span className="skjema-hjelp">Fødselsnummer</span>
        <input
          id="skatt-fnr"
          value={fnr}
          onChange={(e) => onFnr(e.target.value)}
          autoComplete="off"
          inputMode="numeric"
          aria-required="true"
        />
      </label>
      <label htmlFor="skatt-kode">
        <span className="skjema-hjelp">Engangskode fra SMS</span>
        <input
          id="skatt-kode"
          value={kode}
          onChange={(e) => onKode(e.target.value)}
          autoComplete="off"
          inputMode="numeric"
          aria-required="true"
        />
      </label>
      {feil ? (
        <p className="tilbakemelding feil" role="status">
          {feil}
        </p>
      ) : null}
      <div className="handlinger">
        <button type="submit" className="knapp">
          Logg inn
        </button>
      </div>
    </form>
  )
}

function BeregningSteg({
  forhold,
  maanederIgjen,
  fagforening,
  onNeste,
  onBekreft,
}: {
  forhold: Arbeidsforhold
  maanederIgjen: number
  fagforening: boolean
  onNeste: () => void
  onBekreft: () => void
}) {
  const forventet = forventetAarsinntekt(forhold, maanederIgjen)
  const beregnet = beregnSkatt(forventet, fagforening ? SATSER_2026.fagforeningAar : 0)
  const trekk = maanedstrekk(beregnet.aarsskatt, forhold.skattHittil, maanederIgjen)
  return (
    <div>
      <h2>Beregning</h2>
      <p>Forventet lønn i år: {formatKr(forventet)}.</p>
      <p>Skatt på alminnelig inntekt: {formatKr(beregnet.skattAlminnelig)}.</p>
      <p>Trinnskatt: {formatKr(beregnet.trinnskatt)}.</p>
      <p>Trygdeavgift: {formatKr(beregnet.trygdeavgift)}.</p>
      <p>
        Sum: {formatKr(beregnet.aarsskatt)} ({beregnet.trekkprosent} %).
      </p>
      <p>Ny trekkprosent omtrent {beregnet.trekkprosent} %.</p>
      <p>Månedstrekk omtrent {formatKr(trekk)}. Dette er omtrentlig. Ekte tabelltrekk varierer.</p>
      <p className="dok-fot">
        Forenkling: ingen formue, rentefradrag, arbeidsfradrag for unge eller innsatssone.
      </p>
      <div className="handlinger">
        <button type="button" className="knapp" onClick={onBekreft}>
          Bekreft
        </button>
        <button type="button" className="knapp knapp-sekundaer" onClick={onNeste}>
          Tilbake
        </button>
      </div>
    </div>
  )
}
