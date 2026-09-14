export type Letter = 'A' | 'B' | 'C' | 'D'
export type GameMode = 'physical' | 'digital'
export type Screen = 'home' | 'setup' | 'play' | 'pass' | 'reveal' | 'winner'
export type RoundPhase = 'reader' | 'guesses' | 'input'

export const LETTERS: Letter[] = ['A', 'B', 'C', 'D']

export type Card = {
  id: string
  text: string
  options: Record<Letter, string>
}

export type Player = {
  id: string
  name: string
  color: string
  position: number
}

export type GameState = {
  screen: Screen
  mode: GameMode
  players: Player[]
  readerIndex: number
  boardSize: number
  deck: string[]
  deckIndex: number
  readerAnswer: Letter | null
  guesses: Record<string, Letter | null>
  roundPhase: RoundPhase
  passPlayerId: string | null
  lastMoves: Record<string, number>
  winnerId: string | null
}
