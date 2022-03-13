// Google Apps Script utility functions

const Alpha = [...Array(26)].map((_, i) => String.fromCharCode(i + 65)).join('')
const AlphaLow = Alpha.toLowerCase()
const Digits = [...Array(10)].map((_, i) => String(i)).join('')
const UrlQueryUnreserved = '-._~'
const UrlQueryAllowed = Alpha + AlphaLow + Digits + UrlQueryUnreserved
const ReDate = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?Z?$/

// Provide functions as Google Apps Script doesn't share variables between scripts
const $alpha = () => Alpha
const $alphaLow = () => Alpha
const $digits = () => Digits
const $urlQueryUnreserved = () => UrlQueryUnreserved
const $urlQueryAllowed = () => UrlQueryAllowed

const identity = value => value

const isEmpty = value => (value ?? '') === ''

const isValue = value => (value ?? '') !== ''

const checkValue = value => (isValue(value) ? value : null)

const isNumber = value => typeof value === 'number'

const isString = value => typeof value === 'string'

const isDate = value =>
  value instanceof Date || (typeof value === 'string' && value.match(ReDate))

const getDate = value => (value instanceof Date ? value : new Date(value))

const isArray = (data, minLength = 0) =>
  Array.isArray(data) && data.length >= minLength

const isRange = (data, minColumns = 0, minRows = 0) =>
  isArray(data, minRows) && (!data.length || isArray(data[0], minColumns))

const isRow = data => isRange(data) && data.length === 1

const isColumn = data =>
  isRange(data) && (!data.length || data[0]?.length === 1)

const asArray = data => (isArray(data) ? data : [data])

const asRange = data => (isArray(data) ? data : [[data]])

const onRange = (data, fn, args, combine = identity) =>
  isArray(data)
    ? combine(data.map(value => onRange(value, fn, args)))
    : fn(data, ...(args || []))

const createArray = (length, init = 0) =>
  typeof init === 'function'
    ? Array.from(Array(length), (_, i) => init(i))
    : Array(length).fill(init)

const createRange = (columns, rows, init = 0) =>
  createArray(rows, ri =>
    createArray(
      columns,
      typeof init === 'function' ? rc => init(ri, rc) : init,
    ),
  )

const createMap = (values, filter = isValue) => {
  const map = Object.fromEntries(values.map((v, i) => [v, i]))
  if (filter) for (const k in map) if (!filter(k)) delete map[k]
  return map
}

const flat = (data, depth = Infinity) =>
  isArray(data) ? data.flat(depth) : [data]

const flatValues = (data, depth) => flat(data, depth).filter(isValue)

const str = bytes =>
  checkValue(bytes) && bytes.map(b => String.fromCharCode(b)).join('')

const formatter = format =>
  format ? m => format.replace(/\$(\d+)/g, (_, i) => m[i]) : m => m[1] ?? m[0]

const regex = (text, regexp, format, noMatch = null, noInput = null) =>
  isString(text)
    ? formatter(format)([...text.matchAll(new RegExp(regexp, 'g'))]) ?? noMatch
    : noInput

const json = data => JSON.stringify(data, null, 2)

const uniq = data => [...new Set(flatValues(data))]

const any = (...data) => flatValues(data).find(isValue) ?? null

const first = (...data) => flatValues(data).find(isValue) ?? null

const last = (...data) => flatValues(data).findLast(isValue) ?? null

const fail = error => {
  throw typeof error === 'string' ? new Error(error) : error
}

const countInstances = (value, data) =>
  isArray(value)
    ? value.map(v => countInstances(v, data))
    : isEmpty(value)
    ? null
    : data && isString(data)
    ? (data.match(new RegExp(value, 'g')) || []).length
    : isArray(data) && data.length
    ? flatValues(data).reduce((c, v) => (v === value ? c + 1 : c), 0)
    : 0

const clamp = (number, min, max) => Math.min(Math.max(number || 0, min), max)

const incNonZero = (number, inc = 1) => (number ? number + inc : 0)

const decNonZero = (number, inc = 1) => (number ? number - inc : 0)

const prefix = (prefix, text) => (text ? prefix + text : text)

const suffix = (suffix, text) => (text ? text + suffix : text)

const reverse = data => (isArray(data) ? data.map(reverse).reverse() : data)

const rounded = (data, places = 0) => {
  const run = v =>
    // Simplified rounding: https://ricardometring.com/round-numbers-in-javascript
    isArray(v) ? v.map(run) : isNumber(v) ? Number(v.toFixed(places)) : v
  return run(data)
}

const getSum = (data, sum = 0) => {
  const run = v =>
    isArray(v) ? v.foreach(run) && sum : isNumber(v) ? (sum += v) : sum
  return run(data)
}

const runningSum = (data, sum = 0, fill = false) => {
  const run = v =>
    isArray(v) ? v.map(run) : isNumber(v) ? (sum += v) : fill ? sum : v
  return run(data)
}

const reverseSum = (data, start = 0) =>
  reverse(runningSum(reverse(data), start))

const optional = (data, ...methods) =>
  methods.reduce((d, m) => (m ? m(d) : d), data)

const monthIndex = date => date.getFullYear() * 12 + date.getMonth()

const sumByMonthsAndCategories = (
  data,
  monthsRow,
  categoriesColumn,
  dateColumnIndex = 0,
  matchColumnIndex = 1,
  valueColumnIndex = 2,
  factor = 1,
  debug = false,
) => {
  const dataColumns =
    Math.max(dateColumnIndex, matchColumnIndex, valueColumnIndex) + 1
  if (!isRow(monthsRow)) fail('Use months row')
  if (!isColumn(categoriesColumn)) fail('Use categories column')
  if (!isRange(data, dataColumns))
    fail(`Use data range with at least ${dataColumns} columns`)

  const months = monthsRow.flat().map(m => monthIndex(getDate(m)))
  const cats = categoriesColumn.flat()
  const monthMap = createMap(months)
  const catMap = createMap(cats)
  const result = debug
    ? [[json(catMap)], [json(monthMap)]]
    : createRange(months.length, cats.length)

  for (const row of data) {
    const m = monthIndex(getDate(row[dateColumnIndex]))
    const c = row[matchColumnIndex]
    const v = row[valueColumnIndex]
    if (debug) result.push([json({ m, c, v, mi: monthMap[m], ci: catMap[c] })])
    else if (m in monthMap && c in catMap && isNumber(v))
      result[catMap[c]][monthMap[m]] += v * factor
  }

  return result
}
