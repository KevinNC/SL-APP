import { Board } from '../components/Board'
import { PlayerList } from '../components/PlayerList'
import { currentCardId, getCard } from '../game/cards'
import { useGame } from '../game/GameContext'
import { formatMoves } from '../game/rules'

export function Reveal() {
  const { state, dispatch } = useGame()
  const reader = state.players[state.readerIndex]
  const card = getCard(currentCardId(state.deck, state.deckIndex))
  if (!reader) return null

  const hits = state.players.filter(
    (player) =>
      player.id !== reader.id && state.guesses[player.id] === state.readerAnswer,
  )

  return (
    <main className="page">
      <header className="topbar">
        <span className="eyebrow">Revelación</span>
        <h1>{reader.name} eligió {state.readerAnswer}</h1>
      </header>

      {state.mode === 'digital' && card && state.readerAnswer ? (
        <article className="card">
          <p>{card.text}</p>
          <p className="answer-line">
            <strong>{state.readerAnswer}.</strong> {card.options[state.readerAnswer]}
          </p>
        </article>
      ) : null}

      <section className="card">
        <p className="moves">{formatMoves(state.players, state.lastMoves)}</p>
        {hits.length === 0 ? (
          <p className="hint">Nadie acertó: nadie avanza.</p>
        ) : (
          <p className="hint">
            Aciertos: {hits.map((player) => player.name).join(', ')}. Lector:{' '}
            +{state.lastMoves[reader.id]}
          </p>
        )}
      </section>

      <PlayerList
        players={state.players}
        readerId={reader.id}
        boardSize={state.mode === 'digital' ? state.boardSize : undefined}
      />

      {state.mode === 'digital' ? (
        <Board players={state.players} boardSize={state.boardSize} />
      ) : null}

      <button
        type="button"
        className="btn btn-primary sticky-cta"
        onClick={() => dispatch({ type: 'NEXT_ROUND' })}
      >
        {state.winnerId ? 'Ver ganador' : 'Siguiente turno'}
      </button>
    </main>
  )
}
