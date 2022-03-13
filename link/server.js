// Survey Link - Link survey steps with redirects

const { stringify: qs } = require('qs')
const createError = require('http-errors')
const express = require('express')
const { mapValues, pick, isInteger, isString } = require('lodash')

const { name, version } = require('./package.json')
const port = parseInt(process.env.PORT) || 3000
const isDev = process.env.NODE_ENV === 'development'

const { passCodes = {}, testCodesRegexp } = require('./.permissions.json')
const passCount = Object.keys(passCodes).length
const testCount = testCodesRegexp ? 1 : 0

const json = value => JSON.stringify(value)
const show = value =>
  json(value)
    .replace(/\{"([^"]+)":/g, '{$1=')
    .replace(/,"([^"]+)":/g, ' $1=')
    .replace(/^[{"]|[}"]$/g, '')
const log = data => console.log(show(data)) || data
const fail = (status, message, options) => {
  log(`${status}: ${message}`)
  throw createError(status, message, { expose: isDev, ...options })
}
const invalid = (item, type = 'data', options) =>
  fail(400, `Invalid ${type}: ${json(item)}`, options)
const unknown = (item, type = 'data', options) =>
  fail(404, `Unknown ${type}: ${json(item)}`, options)

const sliceAfter = (array, item) =>
  item ? array.slice(indexOf(array, item) + 1) : array
const indexOf = (array, item) => {
  const index = array.indexOf(item)
  return index >= 0 ? index : unknown(item)
}

const webUrl =
  'https://zivotpostaru.cz/o-projektu/zalozeni-pralesni-skolky-a-skoly/'
const baseFormUrl = 'https://form.jotform.com/'

const codePattern = /^[a-z0-9]{26}$/
const stepPattern = /([smpt])(\d+)/g
const stepsPattern = /^([smpt]\d+)+$/
const steps = 'smpt'.split('')
const stepFormIds = {
  s: '221061625727351',
  m: '221061025516341',
  p: '221061157534347',
  t: '221062221864346',
}
const stepFormIdsTest = {
  s: '221051500727342',
  m: '221050644688356',
  p: '221051412464342',
  t: '221050609954353',
}

const maybe = (check, none) => x => x == null ? none : check(x)
const asInt = x => checkInt(isString(x) ? parseInt(x) : x)
const checkInt = x => (isInteger(x) ? x : invalid(x))
const checkString = x => (isString(x) ? x : invalid(x))
const checkPattern = re => x => re.test(checkString(x)) ? x : invalid(x)
const checkAll = checks => x => checks.reduce((y, c) => c(y), x)
const checkCode = checkPattern(codePattern)
const checkSteps = checkPattern(stepsPattern)

const getFormLink = (step, query) =>
  stepFormIds[step]
    ? `${baseFormUrl}${stepFormIds[step]}?${qs(query)}`
    : unknown(step, 'step form')

const getSteps = data => mapValues(pick(data, steps), maybe(asInt, 0))

const parseSteps = maybe(
  s =>
    Object.fromEntries(
      [...checkSteps(s).matchAll(stepPattern)].map(([_, s, v]) => [s, v]),
    ),
  {},
)

const getNextStep = (stepValues, currentStep) =>
  sliceAfter(steps, currentStep).find(s => stepValues[s])

const getNextLink = data => {
  const code = checkCode(data.c)
  const stepValues = { ...parseSteps(data.steps), ...getSteps(data) }
  const currentStep = maybe(checkString)(data.step)
  log({ code, stepValues, currentStep })
  const nextStep = getNextStep(stepValues, currentStep)
  log({ code, stepValues, currentStep, nextStep })
  const link = getFormLink(nextStep, { ...stepValues, c: code })
  return link
}

const redirectToNext = ({ params, query, body }, res) =>
  res.redirect(getNextLink({ ...params, ...query, ...body }))

const redirectToWeb = (_req, res) => res.redirect(webUrl)

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', redirectToWeb)

app.get('/v', (_req, res) => res.json({ version }))

app.get('/:steps-:c', redirectToNext)

app.get('/next', redirectToNext)
app.post('/next', redirectToNext)

app.get('/next/:step', redirectToNext)
app.post('/next/:step', redirectToNext)

app.get('*', redirectToWeb)

app.listen(port, () =>
  log(`Running ${name}@${version} :${port} [${passCount}|${testCount}]`),
)
