import type { GameMode, GameState, Letter, Player } from '../types'
import { colorForIndex } from './colors'
import { CARDS } from './cards'
import {
  applyMoves,
  findWinner,
  guesserIds,
  nextReaderIndex,
  resolveMoves,
  shuffle,
} from './rules'

function newPlayer(index: number, name = ''): Player {
  return {
    id: `p-${Date.now()}-${index}-${Math.random().toString(16).slice(2, 6)}`,
    name,
    color: colorForIndex(index),
    position: 0,
  }
}

export function emptyState(): GameState {
  return {
    screen: 'home',
    mode: 'physical',
    players: [newPlayer(0, ''), newPlayer(1, '')],
    readerIndex: 0,
    boardSize: 30,
    deck: [],
    deckIndex: 0,
    readerAnswer: null,
    guesses: {},
    roundPhase: 'input',
    passPlayerId: null,
    lastMoves: {},
    winnerId: null,
  }
}

function emptyGuesses(players: Player[]): Record<string, Letter | null> {
  const guesses: Record<string, Letter | null> = {}
  for (const player of players) guesses[player.id] = null
  return guesses
}

function nextDeck(fromIndex: number, deck: string[]): { deck: string[]; deckIndex: number } {
  const nextIndex = fromIndex + 1
  if (nextIndex < deck.length) return { deck, deckIndex: nextIndex }
  return { deck: shuffle(CARDS.map((card) => card.id)), deckIndex: 0 }
}

export type Action =
  | { type: 'NEW_GAME'; mode: GameMode }
  | { type: 'RESUME'; state: GameState }
  | { type: 'SET_BOARD_SIZE'; size: number }
  | { type: 'SET_PLAYER_NAME'; id: string; name: string }
  | { type: 'ADD_PLAYER' }
  | { type: 'REMOVE_PLAYER'; id: string }
  | { type: 'SET_STARTER'; index: number }
  | { type: 'START' }
  | { type: 'SET_READER_ANSWER'; letter: Letter }
  | { type: 'SET_GUESS'; playerId: string; letter: Letter }
  | { type: 'CONFIRM_READER' }
  | { type: 'CONFIRM_PASS' }
  | { type: 'CONFIRM_GUESS' }
  | { type: 'RESOLVE' }
  | { type: 'NEXT_ROUND' }
  | { type: 'SET_WINNER'; playerId: string }
  | { type: 'HOME' }

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'NEW_GAME':
      return {
        ...emptyState(),
        screen: 'setup',
        mode: action.mode,
        roundPhase: action.mode === 'digital' ? 'reader' : 'input',
      }
    case 'RESUME':
      return action.state
    case 'SET_BOARD_SIZE':
      return { ...state, boardSize: action.size }
    case 'SET_PLAYER_NAME':
      return {
        ...state,
        players: state.players.map((player) =>
          player.id === action.id ? { ...player, name: action.name } : player,
        ),
      }
    case 'ADD_PLAYER': {
      if (state.players.length >= 14) return state
      return { ...state, players: [...state.players, newPlayer(state.players.length)] }
    }
    case 'REMOVE_PLAYER': {
      if (state.players.length <= 2) return state
      const players = state.players.filter((player) => player.id !== action.id)
      return {
        ...state,
        players,
        readerIndex: Math.min(state.readerIndex, players.length - 1),
      }
    }
    case 'SET_STARTER':
      return { ...state, readerIndex: action.index }
    case 'START': {
      const players = state.players.map((player, index) => ({
        ...player,
        name: player.name.trim() || `Jugador ${index + 1}`,
        position: 0,
        color: colorForIndex(index),
      }))
      return {
        ...state,
        screen: 'play',
        players,
        guesses: emptyGuesses(players),
        readerAnswer: null,
        lastMoves: {},
        winnerId: null,
        deck: shuffle(CARDS.map((card) => card.id)),
        deckIndex: 0,
        roundPhase: state.mode === 'digital' ? 'reader' : 'input',
        passPlayerId: null,
      }
    }
    case 'SET_READER_ANSWER':
      return { ...state, readerAnswer: action.letter }
    case 'SET_GUESS':
      return {
        ...state,
        guesses: { ...state.guesses, [action.playerId]: action.letter },
      }
    case 'CONFIRM_READER': {
      if (!state.readerAnswer) return state
      const reader = state.players[state.readerIndex]
      if (!reader) return state
      const firstGuesser = guesserIds(state.players, reader.id)[0]
      return {
        ...state,
        screen: 'pass',
        roundPhase: 'guesses',
        passPlayerId: firstGuesser ?? null,
      }
    }
    case 'CONFIRM_PASS':
      return { ...state, screen: 'play' }
    case 'CONFIRM_GUESS': {
      const reader = state.players[state.readerIndex]
      if (!reader) return state
      const ids = guesserIds(state.players, reader.id)
      const current = state.passPlayerId
      if (!current || !state.guesses[current]) return state
      const currentPos = ids.indexOf(current)
      const nextId = ids[currentPos + 1]
      if (!nextId) return resolveRound(state)
      return {
        ...state,
        screen: 'pass',
        passPlayerId: nextId,
      }
    }
    case 'RESOLVE':
      return resolveRound(state)
    case 'NEXT_ROUND': {
      if (state.winnerId) return { ...state, screen: 'winner' }
      const reader = nextReaderIndex(state.readerIndex, state.players.length)
      const deckState =
        state.mode === 'digital' ? nextDeck(state.deckIndex, state.deck) : { deck: state.deck, deckIndex: state.deckIndex }
      return {
        ...state,
        screen: 'play',
        readerIndex: reader,
        readerAnswer: null,
        guesses: emptyGuesses(state.players),
        lastMoves: {},
        passPlayerId: null,
        roundPhase: state.mode === 'digital' ? 'reader' : 'input',
        ...deckState,
      }
    }
    case 'SET_WINNER':
      return { ...state, winnerId: action.playerId, screen: 'winner' }
    case 'HOME':
      return emptyState()
    default:
      return state
  }
}

function resolveRound(state: GameState): GameState {
  const reader = state.players[state.readerIndex]
  if (!reader || !state.readerAnswer) return state
  const lastMoves = resolveMoves(state.players, reader.id, state.readerAnswer, state.guesses)
  const players =
    state.mode === 'digital'
      ? applyMoves(state.players, lastMoves, state.boardSize)
      : state.players.map((player) => ({
          ...player,
          position: player.position + (lastMoves[player.id] ?? 0),
        }))
  const winnerId =
    state.mode === 'digital' ? findWinner(players, state.boardSize, reader.id) : null
  return {
    ...state,
    players,
    lastMoves,
    winnerId,
    screen: 'reveal',
    passPlayerId: null,
  }
}
