import { Board } from '../components/Board'
import { PlayerList } from '../components/PlayerList'
import { useGame } from '../game/GameContext'

export function Winner() {
  const { state, dispatch } = useGame()
  const winner = state.players.find((player) => player.id === state.winnerId)

  return (
    <main className="page winner">
      <p className="eyebrow">Fin de la partida</p>
      <h1>{winner ? `Ganó ${winner.name}` : 'Hay un ganador'}</h1>
      <PlayerList
        players={state.players}
        boardSize={state.mode === 'digital' ? state.boardSize : undefined}
      />
      {state.mode === 'digital' ? (
        <Board players={state.players} boardSize={state.boardSize} />
      ) : null}
      <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: 'HOME' })}>
        Volver al inicio
      </button>
    </main>
  )
}
