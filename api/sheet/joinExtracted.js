// Google Apps Script to join all extracted regexp matches,
// with optional format using $N references, optional unique filter, and optional reverse

// Apps Script doesn't use imports, add the following scripts before this one
// import { optional, uniq, reverse, flat, isString } from './utils.js'

const joinExtracted = (data, regexp, format, sep, unique, reversed) => {
  re = new RegExp(regexp, 'g')
  return optional(
    flat(data)
      .filter(isString)
      .map(s => [...s.matchAll(re)])
      .flat() // Flatten multiple extracted matches for single text value
      .map(formatter(format)),
    unique && uniq,
    reversed && reverse,
  ).join(sep ?? '\n')
}
