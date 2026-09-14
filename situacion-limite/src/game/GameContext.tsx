import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from 'react'
import type { GameState } from '../types'
import { emptyState, reducer, type Action } from './reducer'
import { clearGame, saveGame } from './storage'

type GameContextValue = {
  state: GameState
  dispatch: Dispatch<Action>
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatchRaw] = useReducer(reducer, undefined, emptyState)
  const stateRef = useRef(state)
  stateRef.current = state

  const dispatch = useCallback<Dispatch<Action>>((action) => {
    if (action.type === 'HOME') {
      const screen = stateRef.current.screen
      if (screen !== 'home' && screen !== 'setup') clearGame()
    }
    dispatchRaw(action)
  }, [])

  useEffect(() => {
    if (state.screen === 'home' || state.screen === 'setup') return
    saveGame(state)
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame debe usarse dentro de GameProvider')
  return ctx
}
