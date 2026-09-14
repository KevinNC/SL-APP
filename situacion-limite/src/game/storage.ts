import type { GameState } from '../types'

const KEY = 'situacion-limite-v1'

export function saveGame(state: GameState): void {
  if (state.screen === 'home' || state.screen === 'setup') return
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as GameState
  } catch {
    return null
  }
}

export function clearGame(): void {
  localStorage.removeItem(KEY)
}

export function hasSavedGame(): boolean {
  const saved = loadGame()
  return Boolean(saved && saved.screen !== 'home' && saved.screen !== 'setup')
}
