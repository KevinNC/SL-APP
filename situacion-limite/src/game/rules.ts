import type { Letter, Player } from '../types'

export function shuffle<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

export function resolveMoves(
  players: Player[],
  readerId: string,
  readerAnswer: Letter,
  guesses: Record<string, Letter | null>,
): Record<string, number> {
  const moves: Record<string, number> = {}
  for (const player of players) moves[player.id] = 0

  const correct = players.filter(
    (player) => player.id !== readerId && guesses[player.id] === readerAnswer,
  )
  if (correct.length === 0) return moves

  moves[readerId] = 1 + correct.length
  for (const player of correct) moves[player.id] = 1
  return moves
}

export function applyMoves(
  players: Player[],
  moves: Record<string, number>,
  boardSize: number,
): Player[] {
  return players.map((player) => ({
    ...player,
    position: Math.min(boardSize, player.position + (moves[player.id] ?? 0)),
  }))
}

export function findWinner(
  players: Player[],
  boardSize: number,
  readerId: string,
): string | null {
  const finished = players.filter((player) => player.position >= boardSize)
  if (finished.length === 0) return null
  const topScore = Math.max(...finished.map((player) => player.position))
  const tied = finished.filter((player) => player.position === topScore)
  if (tied.some((player) => player.id === readerId)) return readerId
  return tied[0].id
}

export function nextReaderIndex(current: number, total: number): number {
  return (current + 1) % total
}

export function guesserIds(players: Player[], readerId: string): string[] {
  return players.filter((player) => player.id !== readerId).map((player) => player.id)
}

export function formatMoves(
  players: Player[],
  moves: Record<string, number>,
): string {
  const parts = players
    .filter((player) => (moves[player.id] ?? 0) > 0)
    .map((player) => `${player.name} +${moves[player.id]}`)
  return parts.length > 0 ? parts.join(' · ') : 'Nadie avanza'
}
