import { APP_ETIKETTER, FASE1_APPER, type AppId } from '../../modell/typer'
import { AppIkon } from '../Ikoner'

const HJEM_APPER: AppId[] = [
  'meldinger',
  'epost',
  'kalender',
  'jobbportal',
  'aktivitetsplan',
  'cv',
  'reise',
  'jobbmagasin',
  'skatt',
  'lonn',
  'innstillinger',
]

interface Props {
  onAapne: (app: AppId) => void
  ulesteSms: number
  ulestEpost: number
}

export function Hjem({ onAapne, ulesteSms, ulestEpost }: Props) {
  return (
    <div>
      <header className="hjem-hode">
        <h1>Hjem</h1>
        <p>Åpne en app. Dette er en øvingsversjon.</p>
      </header>
      <div className="app-rutenett">
        {HJEM_APPER.map((app) => {
          const laast = !FASE1_APPER.includes(app)
          const badge = app === 'meldinger' ? ulesteSms : app === 'epost' ? ulestEpost : 0
          return (
            <button
              key={app}
              type="button"
              className="app-ikon"
              disabled={laast}
              aria-label={
                laast
                  ? `${APP_ETIKETTER[app]}, kommer senere`
                  : badge > 0
                    ? `${APP_ETIKETTER[app]}, ${badge} uleste`
                    : APP_ETIKETTER[app]
              }
              onClick={() => {
                if (!laast) onAapne(app)
              }}
            >
              <AppIkon app={app} />
              <span>
                {APP_ETIKETTER[app]}
                {badge > 0 ? (
                  <span className="badge" aria-hidden="true">
                    {badge}
                  </span>
                ) : null}
              </span>
              {laast ? <span className="laas">Kommer senere</span> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
