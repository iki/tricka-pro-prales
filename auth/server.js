// Hasura GraphQL Engine Auth Webhook passing allowed X-Hasura- headers
// See https://hasura.io/docs/latest/graphql/core/auth/authentication/webhook/

const express = require('express')
const { mapKeys, mapValues, snakeCase, isArray } = require('lodash')

const { name, version } = require('./package.json')
const port = parseInt(process.env.PORT) || 7000

const roles = new Set(['backer', 'organizer'])

const oneOf = (value, referenceSet, defaultValue = null) =>
  referenceSet.has(value) ? value : defaultValue

const keyPrefix = 'x-hasura-'
const reservedKeys = new Set(['cache-control', 'expires'])

const dashCase = str => snakeCase(str).replaceAll('_', '-')
const prefixKey = key =>
  reservedKeys.has(key) || key.startsWith(keyPrefix) ? key : keyPrefix + key
const SessionKey = (_, key) => prefixKey(dashCase(key))
const SessionValue = value => value ?? ''
const Session = data => mapValues(mapKeys(data, SessionKey), SessionValue)

const isObject = data => !!data && typeof data === 'object'
const isMap = data => isObject(data) && !isArray(data)
const map = (data, fn) => (isMap(data) ? Object.entries(data).map(fn) : [])
const show = data => map(data, ([k, v]) => `${k} = ${v}`).join(', ') || data
const log = data => console.log(show(data)) || data

const app = express()

app.get('/', (_request, response) => response.json({ version }))

app.get('/webhook/auth', (request, response) => {
  const userToken = request.get('sid')
  const role = userToken
    ? oneOf(request.get('role'), roles, 'backer')
    : 'public'
  const session = Session({ role, userToken })
  response.json(log(session))
})

app.listen(port, () => log(`Running ${name}@${version} :${port}`))
