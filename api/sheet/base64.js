// Google Apps Script Base64 encoding functions

// Apps Script doesn't use imports, add the following scripts before this one
// import { has, str } from './utils.js'

const base64 = input => has(input) && Utilities.base64Encode(input)

const bare64 = input => has(input) && unpad(Utilities.base64Encode(input)) // Unpad base64

// URI query safe: replace [/+] with [.-] and strip '=' padding
const base64uri = input =>
  has(input) &&
  base64(input).replace(/\//g, '.').replace(/\+/g, '-').replace(/=/g, '')

const debase64 = text =>
  has(text) &&
  str(Utilities.base64Decode(text.replace(/[._]/g, '/').replace(/-/g, '+')))
