import type { Player } from '../types'
import { initialOf } from '../game/colors'

const COLS = 6

type Props = {
  players: Player[]
  boardSize: number
}

export function Board({ players, boardSize }: Props) {
  const cells = Array.from({ length: boardSize }, (_, i) => i + 1)
  const startPlayers = players.filter((player) => player.position <= 0)

  return (
    <div className="board-wrap">
      <div className="board-start">
        <span className="board-label">Salida</span>
        <div className="token-stack">
          {startPlayers.map((player, index) => (
            <span
              key={player.id}
              className="token"
              style={{ background: player.color, marginLeft: index ? -8 : 0 }}
              title={player.name}
            >
              {initialOf(player.name)}
            </span>
          ))}
        </div>
      </div>
      <div className="board" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
        {cells.map((n) => {
          const row = Math.floor((n - 1) / COLS)
          const colInRow = (n - 1) % COLS
          const col = row % 2 === 0 ? colInRow : COLS - 1 - colInRow
          const here = players.filter((player) => player.position === n)
          const isMeta = n === boardSize
          return (
            <div
              key={n}
              className={`cell ${isMeta ? 'is-meta' : ''}`}
              style={{ gridRow: row + 1, gridColumn: col + 1 }}
            >
              <span className="cell-num">{isMeta ? 'Meta' : n}</span>
              <div className="token-stack">
                {here.map((player, index) => (
                  <span
                    key={player.id}
                    className="token token-sm"
                    style={{ background: player.color, marginLeft: index ? -6 : 0 }}
                    title={player.name}
                  >
                    {initialOf(player.name)}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
