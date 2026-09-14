import { LetterButtons } from '../components/LetterButtons'
import { Board } from '../components/Board'
import { PlayerList } from '../components/PlayerList'
import { currentCardId, getCard } from '../game/cards'
import { useGame } from '../game/GameContext'

export function DigitalRound() {
  const { state, dispatch } = useGame()
  const reader = state.players[state.readerIndex]
  const card = getCard(currentCardId(state.deck, state.deckIndex))
  if (!reader || !card) return null

  if (state.roundPhase === 'reader') {
    return (
      <main className="page">
        <header className="topbar">
          <button type="button" className="btn-text" onClick={() => dispatch({ type: 'HOME' })}>
            Salir
          </button>
          <h1>Lee {reader.name}</h1>
        </header>
        <p className="banner">Que el resto no mire la pantalla.</p>
        <article className="card card-situation">
          <p>{card.text}</p>
          <ul className="options">
            {(['A', 'B', 'C', 'D'] as const).map((letter) => (
              <li key={letter}>
                <strong>{letter}.</strong> {card.options[letter]}
              </li>
            ))}
          </ul>
        </article>
        <p className="hint">Tu respuesta secreta</p>
        <LetterButtons
          value={state.readerAnswer}
          onChange={(letter) => dispatch({ type: 'SET_READER_ANSWER', letter })}
        />
        <button
          type="button"
          className="btn btn-primary sticky-cta"
          disabled={!state.readerAnswer}
          onClick={() => dispatch({ type: 'CONFIRM_READER' })}
        >
          Confirmar y pasar el celular
        </button>
      </main>
    )
  }

  const guesser = state.players.find((player) => player.id === state.passPlayerId)
  if (!guesser) return null

  return (
    <main className="page">
      <header className="topbar">
        <span className="eyebrow">Adivina {guesser.name}</span>
        <h1>¿Qué eligió {reader.name}?</h1>
      </header>
      <article className="card card-situation">
        <p>{card.text}</p>
        <ul className="options">
          {(['A', 'B', 'C', 'D'] as const).map((letter) => (
            <li key={letter}>
              <strong>{letter}.</strong> {card.options[letter]}
            </li>
          ))}
        </ul>
      </article>
      <LetterButtons
        value={state.guesses[guesser.id] ?? null}
        onChange={(letter) => dispatch({ type: 'SET_GUESS', playerId: guesser.id, letter })}
      />
      <PlayerList
        players={state.players}
        readerId={reader.id}
        boardSize={state.boardSize}
        compact
      />
      <Board players={state.players} boardSize={state.boardSize} />
      <button
        type="button"
        className="btn btn-primary sticky-cta"
        disabled={!state.guesses[guesser.id]}
        onClick={() => dispatch({ type: 'CONFIRM_GUESS' })}
      >
        Listo
      </button>
    </main>
  )
}

export function PassDevice() {
  const { state, dispatch } = useGame()
  const player = state.players.find((item) => item.id === state.passPlayerId)
  if (!player) return null

  return (
    <main className="page pass">
      <p className="eyebrow">Pasá el celular</p>
      <h1>{player.name}</h1>
      <p className="lead">Cuando lo tengas, tocá el botón. No mires si no te toca.</p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => dispatch({ type: 'CONFIRM_PASS' })}
      >
        Soy {player.name}
      </button>
    </main>
  )
}
