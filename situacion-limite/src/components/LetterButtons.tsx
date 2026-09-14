import { LETTERS, type Letter } from '../types'

type Props = {
  value: Letter | null
  onChange: (letter: Letter) => void
  disabled?: boolean
  highlight?: Letter | null
  correct?: boolean | null
}

export function LetterButtons({ value, onChange, disabled, highlight, correct }: Props) {
  return (
    <div className="letter-row">
      {LETTERS.map((letter) => {
        const selected = value === letter
        let className = 'letter-btn'
        if (selected) className += ' is-selected'
        if (highlight && letter === highlight) className += ' is-answer'
        if (selected && correct === true) className += ' is-correct'
        if (selected && correct === false) className += ' is-wrong'
        return (
          <button
            key={letter}
            type="button"
            className={className}
            disabled={disabled}
            onClick={() => onChange(letter)}
          >
            {letter}
          </button>
        )
      })}
    </div>
  )
}
