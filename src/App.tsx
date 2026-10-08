import { Telefon } from './komponenter/telefon/Telefon'
import { useSpill } from './spill/SpillProvider'
import { EpisodeVelger } from './sider/EpisodeVelger'
import { Oppsummering } from './sider/Oppsummering'
import { ScenePanel } from './sider/ScenePanel'
import { Slutt } from './sider/Slutt'
import { SpillMeny } from './sider/SpillMeny'
import { Startskjerm } from './sider/Startskjerm'

function Skjerm() {
  const { fremdrift } = useSpill()

  if (fremdrift.visning === 'start') {
    return <Startskjerm />
  }

  if (fremdrift.visning === 'oppsummering') {
    return (
      <div className="startside">
        <SpillMeny />
        <Oppsummering />
      </div>
    )
  }

  if (fremdrift.visning === 'slutt') {
    return (
      <div className="startside">
        <SpillMeny />
        <Slutt />
      </div>
    )
  }

  return (
    <div className="skjerm">
      <SpillMeny />
      <Telefon />
      {fremdrift.visning === 'scene' ? <ScenePanel /> : <EpisodeVelger />}
    </div>
  )
}

export default function App() {
  return <Skjerm />
}
