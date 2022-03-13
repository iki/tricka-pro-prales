// Google Apps Script to join texts in a range where values in second range equal to the provided match value
// Solves the need for `arrayformula(join(',', filter()))`, which does not work in Google Sheets
// Instead you can pass a range of match values and get a range of joined texts back

// Apps Script doesn't use imports, add the following scripts before this one
// import { onRange } from './utils.js'

const _joinMatching = (match, values, texts, sep = '\n') => {
  const columns = texts[0]?.length
  if (!columns) return ''
  const row = i => Math.floor(i / columns)
  const col = i => i % columns
  const value = i => values[row(i)][col(i)]
  return (
    // JSON.stringify(match) +
    texts
      .flat()
      // .map((t, i) => `[${row(i)}:${col(i)}] ${t} (${JSON.stringify(value(i))})`)
      .filter((_, i) => value(i) === match)
      .join(sep)
  )
}

const joinMatching = (matches, values, texts, sep) =>
  onRange(matches, _joinMatching, [values, texts, sep])
