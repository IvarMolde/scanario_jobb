import { Telefon } from './komponenter/telefon/Telefon'
import { useSpill } from './spill/SpillProvider'
import { EpisodeVelger } from './sider/EpisodeVelger'
import { Oppsummering } from './sider/Oppsummering'
import { ScenePanel } from './sider/ScenePanel'
import { Slutt } from './sider/Slutt'
import { Startskjerm } from './sider/Startskjerm'

function Skjerm() {
  const { fremdrift } = useSpill()

  if (fremdrift.visning === 'start') {
    return <Startskjerm />
  }

  if (fremdrift.visning === 'oppsummering') {
    return <Oppsummering />
  }

  if (fremdrift.visning === 'slutt') {
    return <Slutt />
  }

  return (
    <div className="skjerm">
      <Telefon />
      {fremdrift.visning === 'scene' ? <ScenePanel /> : <EpisodeVelger />}
    </div>
  )
}

export default function App() {
  return <Skjerm />
}
