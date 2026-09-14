export const PLAYER_COLORS = [
  '#c44536',
  '#1976d2',
  '#2e7d32',
  '#d4a017',
  '#6a1b9a',
  '#00838f',
  '#e65100',
  '#ad1457',
  '#283593',
  '#558b2f',
  '#00897b',
  '#5d4037',
  '#455a64',
  '#d81b60',
]

export function colorForIndex(index: number): string {
  return PLAYER_COLORS[index % PLAYER_COLORS.length]
}

export function initialOf(name: string): string {
  const trimmed = name.trim()
  return trimmed ? trimmed[0]!.toUpperCase() : '?'
}
