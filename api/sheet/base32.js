// Google Apps Script Base32 encoding functions

// Apps Script doesn't use imports, add the following scripts before this one
// import { checkValue, $alpha, $digits } from './utils.js'

const Base32 = $alpha() + $digits().slice(2, 8) // RFC 4648

const unpad = text => checkValue(text) && text.replace(/=+$/, '') // Strip base32/64 '=' padding

const pad32 = text =>
  checkValue(text) &&
  (text.length % 8 ? text + '======='.slice((text.length % 8) - 1) : text)

const quartet32 = quartet =>
  [3, 2, 1, 0].map(n => Base32[(quartet >>> (n * 5)) & 31]).join('')

const bare32 = input => {
  // Unpad base32, adapted from https://github.com/vincentcorbee/Base32Js/blob/main/lib/helpers/encode.js
  if (!input) return null
  let i = 0
  let output = ''
  const c =
    typeof input === 'string'
      ? i => input.charCodeAt(i) & 0xff || 0
      : i => input[i] & 0xff || 0
  while (i < input.length)
    output +=
      quartet32((c(i++) << 12) | (c(i++) << 4) | (c(i) >> 4)) + // First 4*5 bits from bytes 1, 2, 3 (higher 4 bits)
      quartet32(((c(i++) & 0xf) << 16) | (c(i++) << 8) | c(i++)) // Second 4*5 bits from bytes 3 (lower 4 bits), 4, 5
  return output.slice(0, Math.ceil((input.length * 8) / 5))
}

const bare32low = input => bare32(input)?.toLowerCase()

const base32 = input => checkValue(input) && pad32(bare32(input))

const base32low = input => base32(input)?.toLowerCase()
