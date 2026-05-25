import { Central } from '@lionrockjs/central';

const DEFAULT_PBKDF2_ITERATIONS = 20000;
const PBKDF2_DIGEST_LENGTH_BITS = 256;
const PBKDF2_VERSION = 1;

function getAuthSalt(state?: Map<string, any>) {
  const request = state?.get?.('request');
  const requestSalt = request?.env?.AUTH_SALT;
  if (requestSalt !== undefined) return `${requestSalt}`;

  const processEnv = Central.runtime?.process?.()?.env;
  if (processEnv?.AUTH_SALT !== undefined) return `${processEnv.AUTH_SALT}`;

  return '';
}

function passwordText(userId: string, identifierName: string, plainTextPassword: string, state?: Map<string, any>) {
  return `${userId}${identifierName}${plainTextPassword}${getAuthSalt(state)}`;
}

function getPbkdf2Iterations(state?: Map<string, any>) {
  const request = state?.get?.('request');
  const requestIterations = request?.env?.PASSWORD_PBKDF2_ITERATIONS;
  const processIterations = Central.runtime?.process?.()?.env?.PASSWORD_PBKDF2_ITERATIONS;
  const value = Number(requestIterations ?? processIterations ?? DEFAULT_PBKDF2_ITERATIONS);

  return Number.isInteger(value) && value > 0 ? value : DEFAULT_PBKDF2_ITERATIONS;
}

function randomSalt(length = 16) {
  const salt = new Uint8Array(length);
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error('Password hashing requires crypto.getRandomValues');
  }
  globalThis.crypto.getRandomValues(salt);
  return salt;
}

function bytesToBase64(bytes: Uint8Array) {
  const buffer = (globalThis as any).Buffer;
  if (buffer) return buffer.from(bytes).toString('base64').replace(/=+$/g, '');

  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  if (typeof btoa !== 'function') throw new Error('Base64 encoding is unavailable');
  return btoa(binary).replace(/=+$/g, '');
}

function base64ToBytes(value: string) {
  const padded = value.padEnd(Math.ceil(value.length / 4) * 4, '=');
  const buffer = (globalThis as any).Buffer;
  if (buffer) return new Uint8Array(buffer.from(padded, 'base64'));

  if (typeof atob !== 'function') throw new Error('Base64 decoding is unavailable');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function derivePbkdf2(text: string, salt: Uint8Array, iterations = DEFAULT_PBKDF2_ITERATIONS) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Password hashing requires crypto.subtle');
  }
  const saltBuffer = salt.buffer.slice(salt.byteOffset, salt.byteOffset + salt.byteLength) as ArrayBuffer;

  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(text),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await globalThis.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: saltBuffer,
      iterations,
    },
    key,
    PBKDF2_DIGEST_LENGTH_BITS
  );

  return new Uint8Array(bits);
}

function encodePbkdf2Hash(salt: Uint8Array, digest: Uint8Array, iterations = DEFAULT_PBKDF2_ITERATIONS) {
  return `$pbkdf2-sha256$v=${PBKDF2_VERSION}$i=${iterations}$${bytesToBase64(salt)}$${bytesToBase64(digest)}`;
}

function parsePbkdf2Hash(hash: string) {
  const parts = hash.split('$');
  if (parts.length !== 6 || parts[0] !== '' || parts[1] !== 'pbkdf2-sha256') {
    throw new Error('Invalid PBKDF2 hash format');
  }

  const version = Number(parts[2].replace(/^v=/, ''));
  if (version !== PBKDF2_VERSION) throw new Error('Unsupported PBKDF2 hash version');

  const iterations = Number(parts[3].replace(/^i=/, ''));
  if (!Number.isInteger(iterations) || iterations < 1) throw new Error('Invalid PBKDF2 iterations');

  return {
    iterations,
    salt: base64ToBytes(parts[4]),
    digest: base64ToBytes(parts[5]),
  };
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

export async function hashPassword(userId: string, identifierName: string, plainTextPassword: string, state?: Map<string, any>) {
  const salt = randomSalt();
  const iterations = getPbkdf2Iterations(state);
  const digest = await derivePbkdf2(passwordText(userId, identifierName, plainTextPassword, state), salt, iterations);
  return encodePbkdf2Hash(salt, digest, iterations);
}

export async function verifyPassword(hash: string, userId: string, identifierName: string, plainTextPassword: string, state?: Map<string, any>) {
  if (hash.startsWith('$argon2id$')) {
    throw new Error('Legacy Argon2id password hash exceeds Cloudflare Worker resource limits. Reset this password with npm run d1:password:remote -- <username> <new-password>.');
  }

  try {
    const parsed = parsePbkdf2Hash(hash);
    const digest = await derivePbkdf2(passwordText(userId, identifierName, plainTextPassword, state), parsed.salt, parsed.iterations);
    return constantTimeEqual(parsed.digest, digest);
  } catch (error) {
    if (/Legacy Argon2id/.test((error as Error).message)) throw error;
    return false;
  }
}
