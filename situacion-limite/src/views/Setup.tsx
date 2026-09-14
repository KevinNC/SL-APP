import { useGame } from '../game/GameContext'

export function Setup() {
  const { state, dispatch } = useGame()
  const { players, mode, boardSize, readerIndex } = state
  const canStart = players.length >= 2

  return (
    <main className="page">
      <header className="topbar">
        <button type="button" className="btn-text" onClick={() => dispatch({ type: 'HOME' })}>
          Inicio
        </button>
        <h1>{mode === 'physical' ? 'Partida física' : 'Partida digital'}</h1>
      </header>

      <p className="hint">2 a 14 jugadores. Tocá el número de la izquierda para marcar quién empieza.</p>

      <ul className="setup-list">
        {players.map((player, index) => (
          <li key={player.id} className="setup-row">
            <button
              type="button"
              className={`starter ${index === readerIndex ? 'is-on' : ''}`}
              onClick={() => dispatch({ type: 'SET_STARTER', index })}
              title="Quién empieza"
            >
              {index === readerIndex ? '1º' : index + 1}
            </button>
            <span className="token" style={{ background: player.color }} />
            <input
              value={player.name}
              placeholder={`Jugador ${index + 1}`}
              onChange={(event) =>
                dispatch({ type: 'SET_PLAYER_NAME', id: player.id, name: event.target.value })
              }
            />
            <button
              type="button"
              className="btn-icon"
              disabled={players.length <= 2}
              onClick={() => dispatch({ type: 'REMOVE_PLAYER', id: player.id })}
              aria-label="Quitar"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="btn btn-ghost"
        disabled={players.length >= 14}
        onClick={() => dispatch({ type: 'ADD_PLAYER' })}
      >
        Agregar jugador
      </button>

      {mode === 'digital' ? (
        <section className="board-size">
          <p>Casillas del tablero</p>
          <div className="letter-row">
            {[20, 30, 40].map((size) => (
              <button
                key={size}
                type="button"
                className={`letter-btn ${boardSize === size ? 'is-selected' : ''}`}
                onClick={() => dispatch({ type: 'SET_BOARD_SIZE', size })}
              >
                {size}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <button
        type="button"
        className="btn btn-primary sticky-cta"
        disabled={!canStart}
        onClick={() => dispatch({ type: 'START' })}
      >
        Empezar
      </button>
    </main>
  )
}
