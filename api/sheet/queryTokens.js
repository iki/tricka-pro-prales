// Google Apps Script query tokens encoding functions

// Apps Script doesn't use imports, add the following scripts before this one
// import { checkValue, onRange } from './utils.js'
// import { base32, base32low, bare32, bare32low } from './base32.js'
// import { base64, base64uri, bare64 } from './base64.js'

const Encoding = {
  base32,
  base32low,
  bare32,
  bare32low,
  base64,
  base64uri,
  bare64,
}

const DigestAlgorithm = {
  md2: Utilities.DigestAlgorithm.MD2, // 128, weaker, slower
  md5: Utilities.DigestAlgorithm.MD5, // 128, broken
  sha1: Utilities.DigestAlgorithm.SHA_1, // 160, broken
  sha256: Utilities.DigestAlgorithm.SHA_256,
  sha384: Utilities.DigestAlgorithm.SHA_384,
  sha512: Utilities.DigestAlgorithm.SHA_512,
}

const digest = (data, salt = '', method = 'sha256') =>
  checkValue(data) &&
  Utilities.computeDigest(DigestAlgorithm[method], salt + data)

const encodeDigest = (data, salt, method = 'md2', encoding = 'bare32low') =>
  checkValue(data) && Encoding[encoding](digest(data, salt, method))

const encodeDigests = (range, salt, method, encoding) =>
  onRange(range, encodeDigest, [salt, method, encoding])

// Apps Script doesn't export functions that are just assigned
const queryToken = (...args) => encodeDigest(...args)
const queryTokens = (...args) => encodeDigests(...args)
