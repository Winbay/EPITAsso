import CryptoJS from 'crypto-js'

const keyValue = import.meta.env.VITE_CRYPTO_SECRET_KEY
const ivKey = import.meta.env.VITE_CRYPTO_IV_KEY

export const encryptMessage = (message: string): string => {
  try {
    if (message) {
      const key = CryptoJS.PBKDF2(keyValue, 'salt', { keySize: 256 / 32, iterations: 100 })
      const iv = CryptoJS.enc.Base64.parse(ivKey)
      const encrypted = CryptoJS.AES.encrypt(message, key, { iv: iv, mode: CryptoJS.mode.CBC })
      return encrypted.ciphertext.toString(CryptoJS.enc.Hex)
    } else {
      throw new Error('Message is empty')
    }
  } catch (error) {
    console.error('Encryption error:', error)
    return ''
  }
}

export const decryptMessage = (encryptedMessage: string): string => {
  try {
    if (encryptedMessage) {
      const key = CryptoJS.PBKDF2(keyValue, 'salt', { keySize: 256 / 32, iterations: 100 })
      const iv = CryptoJS.enc.Base64.parse(ivKey)
      const decrypted = CryptoJS.AES.decrypt(
        CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Hex.parse(encryptedMessage) }),
        key,
        { iv: iv, mode: CryptoJS.mode.CBC }
      )
      return decrypted.toString(CryptoJS.enc.Utf8)
    } else {
      throw new Error('Encrypted message is empty')
    }
  } catch (error) {
    console.error('Decryption error:', error)
    return ''
  }
}
