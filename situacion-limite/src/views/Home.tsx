import { useGame } from '../game/GameContext'
import { hasSavedGame, loadGame } from '../game/storage'

export function Home() {
  const { dispatch } = useGame()
  const saved = hasSavedGame()

  return (
    <main className="page home">
      <p className="eyebrow">Juego de mesa</p>
      <h1>Situación Límite</h1>
      <p className="lead">
        Anotá aciertos en la partida física o jugá una ronda completa en un solo dispositivo.
      </p>
      <div className="stack">
        {saved ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              const state = loadGame()
              if (state) dispatch({ type: 'RESUME', state })
            }}
          >
            Continuar partida
          </button>
        ) : null}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => dispatch({ type: 'NEW_GAME', mode: 'physical' })}
        >
          Anotar partida física
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => dispatch({ type: 'NEW_GAME', mode: 'digital' })}
        >
          Jugar en la app
        </button>
      </div>
    </main>
  )
}
