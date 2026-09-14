import type { Player } from '../types'
import { initialOf } from '../game/colors'

type Props = {
  players: Player[]
  readerId?: string
  boardSize?: number
  compact?: boolean
}

export function PlayerList({ players, readerId, boardSize, compact }: Props) {
  const ranked = [...players].sort((a, b) => b.position - a.position)
  return (
    <ol className={`ranking ${compact ? 'is-compact' : ''}`}>
      {ranked.map((player) => (
        <li key={player.id} className="ranking-row">
          <span className="token" style={{ background: player.color }} aria-hidden>
            {initialOf(player.name)}
          </span>
          <span className="ranking-name">
            {player.name}
            {player.id === readerId ? <em> · lee</em> : null}
          </span>
          <span className="ranking-pos">
            {boardSize
              ? `${player.position}/${boardSize}`
              : `${player.position} ${player.position === 1 ? 'casilla' : 'casillas'}`}
          </span>
        </li>
      ))}
    </ol>
  )
}
