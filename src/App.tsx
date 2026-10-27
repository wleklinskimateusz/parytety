import { useMemo, useState } from 'react'
import './App.css'

type CurrentSeats = {
  men: string
  women: string
  other: string
}

type Combination = {
  men: number
  women: number
  other: number
}

function parseInteger(value: string): number | undefined {
  if (!/^\d+$/.test(value.trim())) return undefined

  const parsed = Number(value)
  return Number.isSafeInteger(parsed) ? parsed : undefined
}

function getCombinationLabel(count: number): string {
  const lastTwoDigits = count % 100
  const lastDigit = count % 10
  if (count === 1) return 'wariant'
  if (lastTwoDigits < 12 || lastTwoDigits > 14) {
    if (lastDigit >= 2 && lastDigit <= 4) return 'warianty'
  }
  return 'wariantów'
}

function App() {
  const [size, setSize] = useState('9')
  const [isMidTerm, setIsMidTerm] = useState(true)
  const [currentSeats, setCurrentSeats] = useState<CurrentSeats>({
    men: '3',
    women: '2',
    other: '1',
  })

  const result = useMemo(() => {
    const totalSeats = parseInteger(size)
    if (totalSeats === undefined || totalSeats < 1) {
      return { error: 'Podaj liczbę całkowitą większą od zera.', combinations: [] }
    }

    const minimum = Math.floor(totalSeats * 0.4)
    const maximum = Math.ceil(totalSeats * 0.5)

    if (totalSeats < 2 || 2 * minimum > totalSeats) {
      return {
        error: 'Skład jest zbyt mały, aby spełnić wymagania parytetu. Organ musi liczyć co najmniej 2 osoby.',
        combinations: [],
        minimum,
        maximum,
      }
    }

    let existing: Combination = { men: 0, women: 0, other: 0 }
    if (isMidTerm) {
      const men = parseInteger(currentSeats.men)
      const women = parseInteger(currentSeats.women)
      const other = parseInteger(currentSeats.other)

      if (men === undefined || women === undefined || other === undefined) {
        return {
          error: 'Podaj nieujemną liczbę całkowitą obsadzonych miejsc dla każdej grupy.',
          combinations: [],
          minimum,
          maximum,
        }
      }

      existing = { men, women, other }
      if (men + women + other > totalSeats) {
        return {
          error: 'Liczba obsadzonych miejsc nie może przekraczać wielkości organu.',
          combinations: [],
          minimum,
          maximum,
        }
      }
    }

    const combinations: Combination[] = []
    for (let men = minimum; men <= maximum; men += 1) {
      for (let women = minimum; women <= maximum; women += 1) {
        const other = totalSeats - men - women
        if (other < 0) continue
        if (
          isMidTerm &&
          (men < existing.men || women < existing.women || other < existing.other)
        ) {
          continue
        }
        combinations.push({ men, women, other })
      }
    }

    return {
      combinations,
      minimum,
      maximum,
      existing,
      remaining: totalSeats - existing.men - existing.women - existing.other,
    }
  }, [currentSeats, isMidTerm, size])

  function updateCurrentSeats(field: keyof CurrentSeats, value: string) {
    setCurrentSeats((seats) => ({ ...seats, [field]: value }))
  }

  const hasError = 'error' in result

  return (
    <main className="app-shell">
      <h1>Kalkulator parytetów</h1>
      <p className="description">
        Możliwe składy organu spełniające wymagania parytetowe.
      </p>

      <section className="planner" aria-label="Ustawienia wyborów">
        <fieldset className="election-mode">
          <legend>Rodzaj wyborów</legend>
          <div className="mode-switch">
            <button
              type="button"
              aria-pressed={!isMidTerm}
              className={!isMidTerm ? 'selected' : ''}
              onClick={() => setIsMidTerm(false)}
            >
              Pełne
            </button>
            <button
              type="button"
              aria-pressed={isMidTerm}
              className={isMidTerm ? 'selected' : ''}
              onClick={() => setIsMidTerm(true)}
            >
              W trakcie kadencji
            </button>
          </div>
        </fieldset>

        <div className="planner-fields">
          <label className="field size-field" htmlFor="body-size">
            <span className="field-label">Liczba miejsc w organie</span>
            <span className="input-wrap">
              <input
                id="body-size"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                value={size}
                onChange={(event) => setSize(event.target.value)}
                aria-describedby="body-size-hint"
              />
              <span className="input-suffix">miejsc</span>
            </span>
            <span className="field-hint" id="body-size-hint">
              Uwzględnij także nieobsadzone miejsca.
            </span>
          </label>

          {isMidTerm && (
            <fieldset className="current-seats">
              <legend>Obecnie obsadzone miejsca</legend>
              <div className="current-grid">
                <label className="field" htmlFor="current-men">
                  <span className="field-label">Parytet M</span>
                  <input
                    id="current-men"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={currentSeats.men}
                    onChange={(event) => updateCurrentSeats('men', event.target.value)}
                  />
                </label>
                <label className="field" htmlFor="current-women">
                  <span className="field-label">Parytet K</span>
                  <input
                    id="current-women"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={currentSeats.women}
                    onChange={(event) => updateCurrentSeats('women', event.target.value)}
                  />
                </label>
                <label className="field" htmlFor="current-other">
                  <span className="field-label">Parytet X</span>
                  <input
                    id="current-other"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={currentSeats.other}
                    onChange={(event) => updateCurrentSeats('other', event.target.value)}
                  />
                </label>
              </div>
              <p className="field-hint remaining-hint">
                Pozostało do obsadzenia:{' '}
                {!hasError && 'remaining' in result ? (
                  <strong>{result.remaining}</strong>
                ) : (
                  <strong>—</strong>
                )}
              </p>
            </fieldset>
          )}
        </div>

        <div className="rule-note">
          <p>
            M i K muszą stanowić od 40% (zaokrąglone w dół) do
            50% (zaokrąglone w górę) składu. Pozostałe miejsca przypadają
            osobom X.
          </p>
        </div>
      </section>

      <section className="results" aria-labelledby="results-title" aria-live="polite">
        <div className="results-heading">
          <h2 id="results-title">Możliwe składy</h2>
          {!hasError && (
            <span className="result-count">
              {result.combinations.length} {getCombinationLabel(result.combinations.length)}
            </span>
          )}
        </div>

        {hasError ? (
          <p className="message error-state" role="alert">{result.error}</p>
        ) : result.combinations.length === 0 ? (
          <p className="message">
            Brak składu spełniającego wymagania przy podanej liczbie obsadzonych miejsc.
            Zmień podane wartości i spróbuj ponownie.
          </p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th scope="col">Parytet M</th>
                  <th scope="col">Parytet K</th>
                  <th scope="col">Parytet X</th>
                  <th scope="col">Do uzupełnienia</th>
                </tr>
              </thead>
              <tbody>
                {result.combinations.map(({ men, women, other }) => (
                  <tr key={`${men}-${women}-${other}`}>
                    <td>{men}</td>
                    <td>{women}</td>
                    <td>{other}</td>
                    <td>
                      {`${men - result.existing.men}M ${women - result.existing.women}K ${other - result.existing.other}X`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!hasError && 'minimum' in result && (
          <details className="calculation">
            <summary>Jak obliczane są limity</summary>
            <p>
              Dla N = {parseInteger(size)} liczba miejsc dla M i K
              musi wynosić od {result.minimum} do {result.maximum}.
            </p>
          </details>
        )}
      </section>
    </main>
  )
}

export default App
