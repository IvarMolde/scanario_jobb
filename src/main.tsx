import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SpillProvider } from './spill/SpillProvider.tsx'
import { Laereroversikt } from './sider/Laereroversikt.tsx'

const rot = document.getElementById('root')
if (!rot) throw new Error('Mangler #root')

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)
  })
}

const laerer = new URLSearchParams(window.location.search).get('laerer') === '1'

createRoot(rot).render(
  <StrictMode>
    <a className="hopp-til-innhold knapp" href="#hovedinnhold">
      Hopp til innhold
    </a>
    <a className="hopp-til-innhold hopp-til-oppgave knapp" href="#oppgave-innhold">
      Hopp til oppgaven
    </a>
    <div className="ovingsbanner">
      <span>Øvingsversjon</span>
      Jobbreisen · Molde voksenopplæringssenter · MBO
    </div>
    <main id="hovedinnhold">
      {laerer ? (
        <Laereroversikt />
      ) : (
        <SpillProvider>
          <App />
        </SpillProvider>
      )}
    </main>
  </StrictMode>,
)
