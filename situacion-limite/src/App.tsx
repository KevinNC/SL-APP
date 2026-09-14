import { GameProvider, useGame } from './game/GameContext'
import { Home } from './views/Home'
import { Setup } from './views/Setup'
import { PhysicalRound } from './views/PhysicalRound'
import { DigitalRound, PassDevice } from './views/DigitalRound'
import { Reveal } from './views/Reveal'
import { Winner } from './views/Winner'

function Screen() {
  const { state } = useGame()
  switch (state.screen) {
    case 'setup':
      return <Setup />
    case 'play':
      return state.mode === 'physical' ? <PhysicalRound /> : <DigitalRound />
    case 'pass':
      return <PassDevice />
    case 'reveal':
      return <Reveal />
    case 'winner':
      return <Winner />
    default:
      return <Home />
  }
}

export default function App() {
  return (
    <GameProvider>
      <Screen />
    </GameProvider>
  )
}
