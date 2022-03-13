// Google Apps Script Base64 encoding functions

// Apps Script doesn't use imports, add the following scripts before this one
// import { checkValue, str } from './utils.js'

const base64 = input => checkValue(input) && Utilities.base64Encode(input)

const bare64 = input =>
  checkValue(input) && unpad(Utilities.base64Encode(input)) // Unpad base64

// URI query safe: replace [/+] with [.-] and strip '=' padding
const base64uri = input =>
  checkValue(input) &&
  base64(input).replace(/\//g, '.').replace(/\+/g, '-').replace(/=/g, '')

const debase64 = text =>
  checkValue(text) &&
  str(Utilities.base64Decode(text.replace(/[._]/g, '/').replace(/-/g, '+')))
