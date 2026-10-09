import { AKTIVITET_STATUS_NAVN } from '../modell/typer'
import { useSpill } from '../spill/SpillProvider'

const TYPE_NAVN: Record<string, string> = {
  flervalg: 'Flervalg',
  sant_usant: 'Sant eller usant',
  ordbank: 'Ordbank',
  sorter_setning: 'Sorter setning',
  matching: 'Matching',
  finn_og_rett: 'Finn og rett',
  lytt_og_velg: 'Lytt og velg',
  bygg_melding: 'Bygg en melding',
  sorter_kategori: 'Sorter i kategori',
  egenskap_kobling: 'Egenskaper',
  cv_valg: 'CV-setninger',
  portal_sok: 'Søk i portalen',
  match_sjekkliste: 'Matchvurdering',
  velg_jobber: 'Velg jobber',
  registrer_aktiviteter: 'Registrer aktiviteter',
  bygg_soknad: 'Bygg søknad',
  intervju_svar: 'Intervjusvar',
  reiseplan: 'Reiseplan',
  fyll_tall: 'Fyll inn tall',
  skriv_svar: 'Skriv svar',
  finn_i_dokument: 'Finn i dokumentet',
}

export function Oppsummering() {
  const { episode, person, fremdrift, innhold, tilbakeTilEpisoder, startEpisode } = useSpill()
  const ep =
    episode ??
    innhold.episoder.find((e) => e.id === fremdrift.aktivEpisodeId) ??
    innhold.episoder[0]
  if (!ep) return null

  const resultat = fremdrift.oppgaver.filter((o) => o.oppgaveId.startsWith(`${ep.id}-`))
  const perType = new Map<string, { ok: number; totalt: number }>()
  for (const r of resultat) {
    const naa = perType.get(r.type) ?? { ok: 0, totalt: 0 }
    naa.totalt += 1
    if (r.riktig) naa.ok += 1
    perType.set(r.type, naa)
  }

  const punkter = (ep.oppsummering ?? []).filter((p) => {
    if (p.visHvisFlagg && !fremdrift.flagg.includes(p.visHvisFlagg)) return false
    if (p.visHvisIkkeFlagg && fremdrift.flagg.includes(p.visHvisIkkeFlagg)) return false
    return true
  })

  const ord = ep.ordIds
    ? innhold.ordliste.filter((o) => ep.ordIds?.includes(o.id))
    : innhold.ordliste

  return (
    <div className="oppsummering panel" id="oppgave-innhold" tabIndex={-1}>
      <p className="ingress">Oppsummering · vis denne siden til læreren</p>
      <h1>{ep.tittel}</h1>
      {person ? (
        <p>
          {person.fornavn} {person.etternavn} øvde som {person.yrkesmal.toLocaleLowerCase('nb-NO')}.
        </p>
      ) : null}
      <h2>Hva personen gjorde</h2>
      <ul>
        {punkter.map((p) => (
          <li key={p.tekst}>{p.tekst}</li>
        ))}
      </ul>
      {fremdrift.valgteJobber.length > 0 ? (
        <>
          <h2>Valgte jobber</h2>
          <ul>
            {fremdrift.valgteJobber.map((id) => {
              const a = innhold.annonser.find((x) => x.id === id)
              return <li key={id}>{a ? `${a.tittel} · ${a.bedrift}` : id}</li>
            })}
          </ul>
        </>
      ) : null}
      {fremdrift.aktiviteter.length > 0 ? (
        <>
          <h2>Aktivitetsplanen</h2>
          <ul>
            {fremdrift.aktiviteter.map((a) => (
              <li key={a.id}>
                {a.tittel} · {AKTIVITET_STATUS_NAVN[a.status]} · frist {a.frist}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {fremdrift.soknadTekst ? (
        <>
          <h2>Søknadstekst</h2>
          <p>{fremdrift.soknadTekst}</p>
        </>
      ) : null}
      <h2>Viktige ord og uttrykk</h2>
      <ul>
        {ord.map((o) => (
          <li key={o.id}>
            <strong>{o.ord}</strong> — {o.forklaring}
          </li>
        ))}
      </ul>
      <h2>Resultat per oppgavetype</h2>
      <div className="statistikk">
        {[...perType.entries()].map(([type, tall]) => (
          <div className="stat-kort" key={type}>
            <span>{TYPE_NAVN[type] ?? type}</span>
            <strong>
              {tall.ok} / {tall.totalt}
            </strong>
          </div>
        ))}
      </div>
      <div className="handlinger">
        <button type="button" className="knapp" onClick={() => window.print()}>
          Skriv ut
        </button>
        <button type="button" className="knapp knapp-sekundaer" onClick={tilbakeTilEpisoder}>
          Til episodene
        </button>
        <button type="button" className="knapp knapp-amber" onClick={() => startEpisode(ep.id)}>
          Spill episoden på nytt
        </button>
      </div>
    </div>
  )
}
