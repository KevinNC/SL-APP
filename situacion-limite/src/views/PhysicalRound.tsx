import { useState } from 'react'
import { ScoreMatrix } from '../components/ScoreMatrix'
import { PlayerList } from '../components/PlayerList'
import { useGame } from '../game/GameContext'
import { guesserIds } from '../game/rules'

export function PhysicalRound() {
  const { state, dispatch } = useGame()
  const reader = state.players[state.readerIndex]
  const [pickingWinner, setPickingWinner] = useState(false)
  if (!reader) return null

  const guessers = guesserIds(state.players, reader.id)
  const ready =
    Boolean(state.readerAnswer) && guessers.every((id) => Boolean(state.guesses[id]))

  return (
    <main className="page">
      <header className="topbar">
        <button type="button" className="btn-text" onClick={() => dispatch({ type: 'HOME' })}>
          Salir
        </button>
        <h1>Turno de {reader.name}</h1>
        <button type="button" className="btn-text" onClick={() => setPickingWinner((v) => !v)}>
          Ganó
        </button>
      </header>

      {pickingWinner ? (
        <section className="card">
          <p>¿Quién llegó al final?</p>
          <div className="stack">
            {state.players.map((player) => (
              <button
                key={player.id}
                type="button"
                className="btn btn-ghost"
                onClick={() => dispatch({ type: 'SET_WINNER', playerId: player.id })}
              >
                {player.name}
              </button>
            ))}
            <button type="button" className="btn-text" onClick={() => setPickingWinner(false)}>
              Cancelar
            </button>
          </div>
        </section>
      ) : null}

      <p className="hint">Marcá la letra real del lector y la apuesta de cada uno.</p>

      <ScoreMatrix
        players={state.players}
        readerId={reader.id}
        readerAnswer={state.readerAnswer}
        guesses={state.guesses}
        onReaderAnswer={(letter) => dispatch({ type: 'SET_READER_ANSWER', letter })}
        onGuess={(playerId, letter) => dispatch({ type: 'SET_GUESS', playerId, letter })}
      />

      <PlayerList players={state.players} readerId={reader.id} compact />

      <button
        type="button"
        className="btn btn-primary sticky-cta"
        disabled={!ready}
        onClick={() => dispatch({ type: 'RESOLVE' })}
      >
        Resolver
        {ready ? '' : ' · faltan letras'}
      </button>
    </main>
  )
}
