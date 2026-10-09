import { useEffect, useId, useMemo, useState } from 'react'
import type { Annonse, Person, PortalSokOppgave } from '../../modell/typer'
import { filtrerAnnonser, KOMMUNE_NAVN } from '../../spill/sok'
import type { LagretSok } from '../../spill/tilstand'
import { TilbakemeldingBoks } from './TilbakemeldingBoks'

interface Props {
  oppgave: PortalSokOppgave
  person: Person
  ferdig: boolean
  annonser: Annonse[]
  onSvar: (riktig: boolean) => void
  onLagreSok: (sok: LagretSok, flagg: string[]) => void
}

export function PortalSok({ oppgave, person, ferdig, annonser, onSvar, onLagreSok }: Props) {
  const tittelId = useId()
  const lagret = ferdig ? oppgave.riktigPerPerson[person.id] : undefined
  const [aapen, setAapen] = useState(!ferdig)
  const [visLagreDialog, setVisLagreDialog] = useState(false)
  const [sokkeordId, setSokkeordId] = useState<string | null>(lagret?.sokkeordId ?? null)
  const [stedId, setStedId] = useState<string | null>(lagret?.stedId ?? null)
  const [stillingId, setStillingId] = useState<string | null>(lagret?.stillingId ?? null)
  const [varsel, setVarsel] = useState(ferdig)
  const [status, setStatus] = useState<'ok' | 'feil' | null>(ferdig ? 'ok' : null)

  useEffect(() => {
    if (!aapen) return
    const forrige = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onTaste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (visLagreDialog) setVisLagreDialog(false)
        else setAapen(false)
      }
    }
    window.addEventListener('keydown', onTaste)
    return () => {
      document.body.style.overflow = forrige
      window.removeEventListener('keydown', onTaste)
    }
  }, [aapen, visLagreDialog])

  const treff = useMemo(() => {
    if (!sokkeordId || !stedId || !stillingId) return []
    return filtrerAnnonser(annonser, { sokkeordId, stedId, stillingId })
  }, [annonser, sokkeordId, stedId, stillingId])

  const kanLagre = Boolean(sokkeordId && stedId && stillingId) && status !== 'ok'
  const sokkeordTekst = oppgave.sokkeord.find((a) => a.id === sokkeordId)?.tekst
  const stedTekst = oppgave.steder.find((a) => a.id === stedId)?.tekst
  const stillingTekst = oppgave.stillinger.find((a) => a.id === stillingId)?.tekst

  const lagre = () => {
    if (!kanLagre || !sokkeordId || !stedId || !stillingId) return
    const fasit = oppgave.riktigPerPerson[person.id]
    const riktig =
      Boolean(fasit) &&
      fasit.sokkeordId === sokkeordId &&
      fasit.stedId === stedId &&
      fasit.stillingId === stillingId &&
      varsel
    setStatus(riktig ? 'ok' : 'feil')
    onSvar(riktig)
    if (riktig) {
      onLagreSok({ sokkeordId, stedId, stillingId, varsel: true }, oppgave.flagg)
      setVisLagreDialog(false)
    } else {
      setVisLagreDialog(false)
    }
  }

  const fjernChip = (type: 'sokkeord' | 'sted' | 'stilling') => {
    if (status === 'ok') return
    if (type === 'sokkeord') setSokkeordId(null)
    if (type === 'sted') setStedId(null)
    if (type === 'stilling') setStillingId(null)
  }

  return (
    <div className="portal-sok">
      {!aapen ? (
        <button type="button" className="knapp knapp-amber" onClick={() => setAapen(true)}>
          {status === 'ok' ? 'Se søket i Arbeidsplassen' : 'Åpne Arbeidsplassen'}
        </button>
      ) : null}

      {aapen ? (
        <div
          className="arbeidsplassen-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby={tittelId}
        >
          <div className="arbeidsplassen">
            <header className="arbeidsplassen-topp">
              <div className="arbeidsplassen-merke">
                <span className="arbeidsplassen-logo" aria-hidden="true">
                  ▣
                </span>
                <div>
                  <p className="arbeidsplassen-navn">arbeidsplassen.no</p>
                  <p className="arbeidsplassen-hint">Øving – ser ut som NAV Arbeidsplassen</p>
                </div>
              </div>
              <button
                type="button"
                className="arbeidsplassen-lukk"
                onClick={() => {
                  setAapen(false)
                  setVisLagreDialog(false)
                }}
              >
                Lukk
              </button>
            </header>

            <section className="arbeidsplassen-sokeflate">
              <div className="arbeidsplassen-sokeflate-hode">
                <h2 id={tittelId}>Søk etter jobber</h2>
                <button
                  type="button"
                  className="arbeidsplassen-lagre-lenke"
                  disabled={!kanLagre && status !== 'ok'}
                  onClick={() => {
                    if (status === 'ok') return
                    setVisLagreDialog(true)
                  }}
                >
                  <span className="arbeidsplassen-lagre-ikon" aria-hidden="true" />
                  Lagre søk
                </button>
              </div>

              <div className="arbeidsplassen-sokefelt" role="group" aria-label="Valgte søk">
                <span className="arbeidsplassen-sokefelt-label">Sted, yrke eller søkeord</span>
                <div className="arbeidsplassen-chips">
                  {sokkeordTekst ? (
                    <button
                      type="button"
                      className="arbeidsplassen-chip"
                      onClick={() => fjernChip('sokkeord')}
                      disabled={status === 'ok'}
                    >
                      {sokkeordTekst} <span aria-hidden="true">×</span>
                    </button>
                  ) : null}
                  {stedTekst ? (
                    <button
                      type="button"
                      className="arbeidsplassen-chip"
                      onClick={() => fjernChip('sted')}
                      disabled={status === 'ok'}
                    >
                      {stedTekst} <span aria-hidden="true">×</span>
                    </button>
                  ) : null}
                  {stillingTekst ? (
                    <button
                      type="button"
                      className="arbeidsplassen-chip"
                      onClick={() => fjernChip('stilling')}
                      disabled={status === 'ok'}
                    >
                      {stillingTekst} <span aria-hidden="true">×</span>
                    </button>
                  ) : null}
                  {!sokkeordTekst && !stedTekst && !stillingTekst ? (
                    <span className="arbeidsplassen-placeholder">Velg søkeord, sted og stilling til venstre</span>
                  ) : null}
                </div>
              </div>
            </section>

            <div className="arbeidsplassen-innhold">
              <aside className="arbeidsplassen-filtre" aria-label="Filtre">
                <fieldset className="arbeidsplassen-gruppe" disabled={status === 'ok'}>
                  <legend>Søkeord</legend>
                  <p className="arbeidsplassen-hjelp">Velg ett søkeord som passer deg.</p>
                  {oppgave.sokkeord.map((alt) => (
                    <label key={alt.id} className="arbeidsplassen-valg">
                      <input
                        type="radio"
                        name="portal-sokkeord"
                        checked={sokkeordId === alt.id}
                        onChange={() => setSokkeordId(alt.id)}
                      />
                      <span>{alt.tekst}</span>
                    </label>
                  ))}
                </fieldset>

                <fieldset className="arbeidsplassen-gruppe" disabled={status === 'ok'}>
                  <legend>Sted</legend>
                  <div className="arbeidsplassen-toggle" role="presentation">
                    <span className="aktiv">Sted</span>
                    <span>Reisevei</span>
                  </div>
                  <p className="arbeidsplassen-hjelp">Velg kommune.</p>
                  <div className="arbeidsplassen-fylke">
                    <strong>Møre og Romsdal</strong>
                    {oppgave.steder.map((alt) => (
                      <label key={alt.id} className="arbeidsplassen-valg innrykk">
                        <input
                          type="radio"
                          name="portal-sted"
                          checked={stedId === alt.id}
                          onChange={() => setStedId(alt.id)}
                        />
                        <span>{alt.tekst}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="arbeidsplassen-gruppe" disabled={status === 'ok'}>
                  <legend>Omfang</legend>
                  <p className="arbeidsplassen-hjelp">Heltid eller deltid?</p>
                  {oppgave.stillinger.map((alt) => (
                    <label key={alt.id} className="arbeidsplassen-valg">
                      <input
                        type="radio"
                        name="portal-stilling"
                        checked={stillingId === alt.id}
                        onChange={() => setStillingId(alt.id)}
                      />
                      <span>{alt.tekst}</span>
                    </label>
                  ))}
                </fieldset>
              </aside>

              <section className="arbeidsplassen-treff" aria-live="polite">
                <div className="arbeidsplassen-treff-hode">
                  <p>
                    <strong>{treff.length} treff</strong>
                    {sokkeordId && stedId && stillingId
                      ? ` · ${stillingTekst?.toLowerCase()} · ${stedTekst}`
                      : ' · Velg filtre for å se jobber'}
                  </p>
                  <p className="arbeidsplassen-sorter">Sorter etter: Mest relevant</p>
                </div>

                {treff.length === 0 ? (
                  <p className="arbeidsplassen-tom">
                    Ingen treff ennå. Velg søkeord, sted og heltid eller deltid.
                  </p>
                ) : (
                  <ul className="arbeidsplassen-liste">
                    {treff.map((a) => (
                      <li key={a.id} className="arbeidsplassen-kort">
                        <p className="arbeidsplassen-ny">Treff i søket ditt</p>
                        <h3>{a.tittel}</h3>
                        <p className="arbeidsplassen-under">
                          {a.heltid ? 'Heltid' : 'Deltid'} · {a.stillingsprosent}
                        </p>
                        <p className="arbeidsplassen-meta">
                          <span>{a.bedrift}</span>
                          <span>
                            {a.sted} · {KOMMUNE_NAVN[a.kommune] ?? a.kommune}
                          </span>
                        </p>
                        <p className="arbeidsplassen-frist">Søknadsfrist: {a.soknadsfrist}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {visLagreDialog && status !== 'ok' ? (
              <div className="arbeidsplassen-lagre-dialog" role="dialog" aria-labelledby="lagre-sok-tittel">
                <div className="arbeidsplassen-lagre-kort">
                  <h3 id="lagre-sok-tittel">Lagre søk</h3>
                  <p>
                    Du lagrer:{' '}
                    <strong>
                      {[sokkeordTekst, stedTekst, stillingTekst].filter(Boolean).join(' · ')}
                    </strong>
                  </p>
                  <label className="arbeidsplassen-varsel">
                    <input
                      type="checkbox"
                      checked={varsel}
                      onChange={(e) => setVarsel(e.target.checked)}
                    />
                    <span>Slå på varsel når nye jobber kommer</span>
                  </label>
                  {!varsel ? (
                    <p className="arbeidsplassen-varsel-hint">Husk varsel – da får du beskjed om nye stillinger.</p>
                  ) : null}
                  <div className="arbeidsplassen-lagre-handlinger">
                    <button
                      type="button"
                      className="knapp knapp-sekundaer"
                      onClick={() => setVisLagreDialog(false)}
                    >
                      Avbryt
                    </button>
                    <button type="button" className="knapp" onClick={lagre} disabled={!kanLagre}>
                      Lagre søket
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {status === 'ok' ? (
              <div className="arbeidsplassen-suksess" role="status">
                <p>
                  <strong>Søket er lagret.</strong> Varsel er på. Du kan lukke vinduet og gå videre.
                </p>
                <button type="button" className="knapp" onClick={() => setAapen(false)}>
                  Lukk Arbeidsplassen
                </button>
              </div>
            ) : null}

            {status === 'feil' && !visLagreDialog ? (
              <div className="arbeidsplassen-feil">
                <TilbakemeldingBoks
                  status={status}
                  riktig={oppgave.tilbakemeldingRiktig}
                  feil={oppgave.tilbakemeldingFeil}
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {!aapen || status === 'ok' ? (
        <TilbakemeldingBoks
          status={status}
          riktig={oppgave.tilbakemeldingRiktig}
          feil={oppgave.tilbakemeldingFeil}
        />
      ) : null}
    </div>
  )
}
