import type { Scene } from '../modell/typer'

/** true når eleven må se på eller bruke øvingstelefonen i denne scenen */
export function sceneKreverTelefon(scene: Scene): boolean {
  if (scene.app !== 'hjem') return true
  if (scene.varsel || scene.smsTraad || scene.kalenderhendelse || scene.epost) return true
  if (scene.annonseId) return true
  return false
}
