import type { Letter, Player } from '../types'
import { initialOf } from '../game/colors'
import { LetterButtons } from './LetterButtons'

type Props = {
  players: Player[]
  readerId: string
  readerAnswer: Letter | null
  guesses: Record<string, Letter | null>
  onReaderAnswer: (letter: Letter) => void
  onGuess: (playerId: string, letter: Letter) => void
  locked?: boolean
}

export function ScoreMatrix({
  players,
  readerId,
  readerAnswer,
  guesses,
  onReaderAnswer,
  onGuess,
  locked,
}: Props) {
  return (
    <div className="matrix">
      {players.map((player) => {
        const isReader = player.id === readerId
        const value = isReader ? readerAnswer : guesses[player.id] ?? null
        let correct: boolean | null = null
        if (locked && readerAnswer && !isReader && value) {
          correct = value === readerAnswer
        }
        return (
          <article key={player.id} className={`matrix-card ${isReader ? 'is-reader' : ''}`}>
            <header>
              <span className="token" style={{ background: player.color }}>
                {initialOf(player.name)}
              </span>
              <div>
                <strong>{player.name}</strong>
                <small>{isReader ? 'Eligió (respuesta real)' : 'Apuesta'}</small>
              </div>
            </header>
            <LetterButtons
              value={value}
              onChange={(letter) =>
                isReader ? onReaderAnswer(letter) : onGuess(player.id, letter)
              }
              disabled={locked}
              highlight={locked && isReader ? readerAnswer : null}
              correct={correct}
            />
          </article>
        )
      })}
    </div>
  )
}
