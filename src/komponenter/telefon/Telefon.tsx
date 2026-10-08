import { useEffect, useRef, useState } from 'react'
import { APP_ETIKETTER, type AppId } from '../../modell/typer'
import { useSpill } from '../../spill/SpillProvider'
import { sceneKreverTelefon } from '../../spill/telefonhjelp'
import { AppIkon } from '../Ikoner'
import { Aktivitetsplan } from './Aktivitetsplan'
import { Cv } from './Cv'
import { Epost } from './Epost'
import { Hjem } from './Hjem'
import { Innstillinger } from './Innstillinger'
import { Jobbmagasin } from './Jobbmagasin'
import { Jobbportal } from './Jobbportal'
import { Kalender } from './Kalender'
import { Meldinger } from './Meldinger'
import { Reiseplanlegger } from './Reiseplanlegger'
import { Statuslinje } from './Statuslinje'
import { Varsler } from './Varsler'
import { Skatteportal } from './Skatteportal'
import { Lonn } from './Lonn'

const BUNN: AppId[] = ['hjem', 'meldinger', 'epost', 'kalender', 'innstillinger']
const BLINK_MS = 5000

export function Telefon() {
  const {
    fremdrift,
    person,
    scene,
    innhold,
    aapneApp,
    lestVarsel,
    velgMorsmal,
    velgOrd,
    settMagasinAnnonse,
    nullstill,
    tilbakeTilEpisoder,
  } = useSpill()

  const dag = scene?.dag ?? 'Mandag'
  const klokke = scene?.klokkeslett ?? '09:00'
  const app = fremdrift.aktivApp
  const ulesteSms = fremdrift.varsler.filter((v) => !v.lest && v.type === 'sms').length
  const ulestEpost = fremdrift.varsler.filter((v) => !v.lest && v.type === 'epost').length
  const ulesteVarsler = fremdrift.varsler.filter((v) => !v.lest).length
  const ulesteMeldinger = fremdrift.varsler.filter(
    (v) => !v.lest && (v.type === 'sms' || v.type === 'epost'),
  ).length
  const innkommendeAntall =
    fremdrift.sms.filter((m) => m.fra !== 'elev').length +
    fremdrift.eposter.filter((e) => e.id !== 'ovingsmail').length
  const brukTelefon =
    fremdrift.visning === 'scene' && scene != null && sceneKreverTelefon(scene)

  const [blinker, setBlinker] = useState(false)
  const [vibrerer, setVibrerer] = useState(false)
  const forrigeSceneId = useRef<string | null>(null)
  const forrigeUleste = useRef(0)
  const forrigeMeldinger = useRef(0)
  const forrigeInnkommende = useRef(0)
  const effektTimeout = useRef<number | null>(null)
  const hapticInterval = useRef<number | null>(null)

  useEffect(() => {
    const sceneId = scene?.id ?? null
    const nySceneKreverTelefon =
      fremdrift.visning === 'scene' &&
      scene != null &&
      sceneKreverTelefon(scene) &&
      sceneId !== forrigeSceneId.current
    const nyttVarsel = ulesteVarsler > forrigeUleste.current
    const nyMelding =
      ulesteMeldinger > forrigeMeldinger.current ||
      innkommendeAntall > forrigeInnkommende.current

    forrigeSceneId.current = sceneId
    forrigeUleste.current = ulesteVarsler
    forrigeMeldinger.current = ulesteMeldinger
    forrigeInnkommende.current = innkommendeAntall

    if (!nySceneKreverTelefon && !nyttVarsel && !nyMelding) return

    if (nySceneKreverTelefon || nyttVarsel || nyMelding) setBlinker(true)
    if (nyMelding) {
      setVibrerer(true)
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        if (hapticInterval.current != null) window.clearInterval(hapticInterval.current)
        const start = Date.now()
        navigator.vibrate([35, 55, 35])
        hapticInterval.current = window.setInterval(() => {
          if (Date.now() - start >= BLINK_MS) {
            if (hapticInterval.current != null) window.clearInterval(hapticInterval.current)
            hapticInterval.current = null
            navigator.vibrate?.(0)
            return
          }
          navigator.vibrate?.([30, 50, 30])
        }, 160)
      }
    }

    if (effektTimeout.current != null) window.clearTimeout(effektTimeout.current)
    effektTimeout.current = window.setTimeout(() => {
      setBlinker(false)
      setVibrerer(false)
      effektTimeout.current = null
      if (hapticInterval.current != null) {
        window.clearInterval(hapticInterval.current)
        hapticInterval.current = null
      }
      navigator.vibrate?.(0)
    }, BLINK_MS)
  }, [scene, fremdrift.visning, ulesteVarsler, ulesteMeldinger, innkommendeAntall])

  useEffect(() => {
    return () => {
      if (effektTimeout.current != null) window.clearTimeout(effektTimeout.current)
      if (hapticInterval.current != null) window.clearInterval(hapticInterval.current)
      navigator.vibrate?.(0)
    }
  }, [])

  const rammeKlasse = [
    'telefon-ramme',
    brukTelefon ? 'telefon-aktiv' : '',
    blinker ? 'telefon-blink' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={vibrerer ? 'telefon-kolonne telefon-vibrerer' : 'telefon-kolonne'}>
      <div className={rammeKlasse} role="region" aria-label="Telefon">
        <div className="telefon-skjerm">
          <div className="telefon-hakk" aria-hidden="true" />
          <Statuslinje dag={dag} klokkeslett={klokke} />
          <Varsler varsler={fremdrift.varsler} onLukk={lestVarsel} />
          <div className={app === 'meldinger' ? 'app-innhold app-innhold-sms' : 'app-innhold'}>
            {app === 'hjem' ? (
              <Hjem onAapne={aapneApp} ulesteSms={ulesteSms} ulestEpost={ulestEpost} />
            ) : null}
            {app === 'meldinger' ? (
              <Meldinger
                kontakt={fremdrift.smsKontakt}
                meldinger={fremdrift.sms}
                person={person}
                utkast={fremdrift.smsUtkast}
              />
            ) : null}
            {app === 'epost' ? <Epost eposter={fremdrift.eposter} person={person} /> : null}
            {app === 'kalender' ? <Kalender hendelser={fremdrift.kalender} /> : null}
            {app === 'cv' ? (
              <Cv
                person={person}
                harOppdatert={fremdrift.flagg.includes('har_oppdatert_cv')}
                manglerReferanse={fremdrift.flagg.includes('cv_mangler_referanse')}
              />
            ) : null}
            {app === 'jobbportal' ? (
              <Jobbportal annonser={innhold.annonser} lagretSok={fremdrift.lagretSok} />
            ) : null}
            {app === 'jobbmagasin' ? (
              <Jobbmagasin
                key={scene?.annonseId ?? 'magasin'}
                annonser={innhold.annonser}
                startId={scene?.annonseId ?? fremdrift.magasinAnnonseId}
                onVelgOrd={velgOrd}
                onBytt={settMagasinAnnonse}
              />
            ) : null}
            {app === 'aktivitetsplan' ? (
              <Aktivitetsplan aktiviteter={fremdrift.aktiviteter} soknadTekst={fremdrift.soknadTekst} />
            ) : null}
            {app === 'reise' ? (
              <Reiseplanlegger
                ruter={innhold.ruter}
                personId={fremdrift.personId}
                lagret={fremdrift.lagretReise}
              />
            ) : null}
            {app === 'skatt' ? <Skatteportal /> : null}
            {app === 'lonn' ? <Lonn /> : null}
            {app === 'innstillinger' ? (
              <Innstillinger
                person={person}
                morsmal={fremdrift.morsmal}
                onMorsmal={velgMorsmal}
                onNullstill={nullstill}
                onTilbake={() => aapneApp(scene?.app ?? 'hjem')}
              />
            ) : null}
          </div>
          <nav className="bunnmeny" aria-label="Apper">
            {BUNN.map((id) => (
              <button
                key={id}
                type="button"
                aria-label={APP_ETIKETTER[id]}
                aria-current={app === id ? 'page' : undefined}
                onClick={() => {
                  if (id === 'hjem') {
                    aapneApp('hjem')
                    if (!scene) tilbakeTilEpisoder()
                    return
                  }
                  aapneApp(id)
                }}
              >
                <AppIkon app={id} />
                <span className="bunnmeny-tekst">{APP_ETIKETTER[id]}</span>
                {id === 'meldinger' && ulesteSms > 0 ? (
                  <span className="badge" aria-hidden="true">
                    {ulesteSms}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
          <div className="telefon-home" aria-hidden="true" />
        </div>
      </div>
      {brukTelefon ? (
        <p className="telefon-hjelp" role="status">
          Bruk telefon
        </p>
      ) : null}
    </div>
  )
}
