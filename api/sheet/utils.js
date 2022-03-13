// Google Apps Script utility functions

const Alpha = [...Array(26)].map((_, i) => String.fromCharCode(i + 65)).join('')
const AlphaLow = Alpha.toLowerCase()
const Digits = [...Array(10)].map((_, i) => String(i)).join('')
const UrlQueryUnreserved = '-._~'
const UrlQueryAllowed = Alpha + AlphaLow + Digits + UrlQueryUnreserved

// Provide functions as Google Apps Script doesn't share variables between scripts
const $alpha = () => Alpha
const $alphaLow = () => Alpha
const $digits = () => Digits
const $urlQueryUnreserved = () => UrlQueryUnreserved
const $urlQueryAllowed = () => UrlQueryAllowed

const identity = value => value

const isEmpty = value => value ?? '' === ''

const isValue = value => value ?? '' !== ''

const checkValue = value => (value ?? '' !== '') || null

const isString = value => typeof value === 'string'

const isArray = data => Array.isArray(data)

const isRange = data => isArray(data) && isArray(data[0] ?? [])

const asArray = data => (isArray(data) ? data : [data])

const asRange = data => (isArray(data) ? data : [[data]])

const onRange = (data, fn, args, combine = identity) =>
  isArray(data)
    ? combine(data.map(value => onRange(value, fn, args)))
    : fn(data, ...(args || []))

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

const reverse = data => (isArray(data) ? data.map(reverse).reverse() : data)

const optional = (data, ...methods) =>
  methods.reduce((d, m) => (m ? m(d) : d), data)
