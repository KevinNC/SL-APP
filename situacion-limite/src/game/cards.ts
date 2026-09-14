import type { Card } from '../types'
import cardsJson from '../data/cards.json'

export const CARDS: Card[] = cardsJson as Card[]

export function getCard(id: string | undefined): Card | undefined {
  if (!id) return undefined
  return CARDS.find((card) => card.id === id)
}

export function currentCardId(deck: string[], deckIndex: number): string | undefined {
  if (deck.length === 0) return undefined
  return deck[deckIndex % deck.length]
}
