import {
  randomBytes,
  scrypt,
  timingSafeEqual,
} from 'node:crypto'

const SALT_LENGTH = 16
const KEY_LENGTH = 64

function hashWithSalt(
  password: string,
  salt: Buffer,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      KEY_LENGTH,
      (err, key) => {
        if (err) reject(err)
        else resolve(key)
      },
    )
  })
}

export async function hashPassword(
  password: string,
): Promise<string> {
  const salt = randomBytes(SALT_LENGTH)
  const hash = await hashWithSalt(password, salt)
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) return false

  const salt = Buffer.from(saltHex, 'hex')
  const storedHash = Buffer.from(hashHex, 'hex')
  const hash = await hashWithSalt(password, salt)

  return timingSafeEqual(storedHash, hash)
}
