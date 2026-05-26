const DEFAULT_PBKDF2_ITERATIONS = 20000;
const PBKDF2_DIGEST_LENGTH_BITS = 256;
const PBKDF2_VERSION = 1;
const projectRoot = new URL('..', import.meta.url);

const { existsSync } = await import('node:fs');
const { fileURLToPath } = await import('node:url');
const dotenv = await import('dotenv');

for (const envFile of ['.dev.vars', '.env']) {
  const envUrl = new URL(envFile, projectRoot);
  if (existsSync(envUrl)) dotenv.config({ path: fileURLToPath(envUrl), override: false, quiet: true });
}

function usage() {
  console.error('Usage: node scripts/reset-d1-password.mjs [--remote|--local] <username> <new-password>');
  process.exit(1);
}

function sqlQuote(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function bytesToBase64(bytes) {
  return Buffer.from(bytes).toString('base64').replace(/=+$/g, '');
}

function getPbkdf2Iterations() {
  const iterations = Number(process.env.PASSWORD_PBKDF2_ITERATIONS ?? DEFAULT_PBKDF2_ITERATIONS);
  return Number.isInteger(iterations) && iterations > 0 ? iterations : DEFAULT_PBKDF2_ITERATIONS;
}

async function derivePbkdf2(text, salt, iterations) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(text),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt,
      iterations,
    },
    key,
    PBKDF2_DIGEST_LENGTH_BITS
  );

  return new Uint8Array(bits);
}

async function hashPassword(userId, identifierName, plainTextPassword, iterations) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const digest = await derivePbkdf2(`${userId}${identifierName}${plainTextPassword}${process.env.AUTH_SALT ?? ''}`, salt, iterations);
  return `$pbkdf2-sha256$v=${PBKDF2_VERSION}$i=${iterations}$${bytesToBase64(salt)}$${bytesToBase64(digest)}`;
}

function parseArgs(argv) {
  const args = [...argv];
  const remote = args.includes('--remote');
  const local = args.includes('--local');
  const filtered = args.filter(arg => arg !== '--remote' && arg !== '--local');
  if (remote && local) usage();
  if (filtered.length !== 2) usage();

  return {
    mode: remote ? '--remote' : '--local',
    username: filtered[0],
    password: filtered[1],
  };
}

async function runWrangler(args) {
  const { spawnSync } = await import('node:child_process');
  const result = spawnSync('wrangler', args, {
    cwd: projectRoot,
    encoding: 'utf8',
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `wrangler exited with ${result.status}`);
  }

  return result.stdout;
}

function parseUserId(output) {
  try {
    const userId = findUserId(JSON.parse(output));
    if (userId) return userId;
  } catch (error) {
    // Fall back to parsing Wrangler's table output for older CLIs.
  }

  const userIdIndex = output.toLowerCase().indexOf('user_id');
  const fallbackOutput = userIdIndex >= 0 ? output.slice(userIdIndex) : output;
  const match = fallbackOutput.match(/\b(\d{4,})\b/);

  return match?.[1] ?? null;
}

function findUserId(value) {
  if (value === null || value === undefined) return null;

  if (Array.isArray(value)) {
    for (const item of value) {
      const userId = findUserId(item);
      if (userId) return userId;
    }
    return null;
  }

  if (typeof value === 'object') {
    if (value.user_id !== undefined && value.user_id !== null) return `${value.user_id}`;

    for (const item of Object.values(value)) {
      const userId = findUserId(item);
      if (userId) return userId;
    }
  }

  return null;
}

const { mode, username, password } = parseArgs(process.argv.slice(2));
const userIdSql = `SELECT user_id FROM identifier_passwords WHERE name = ${sqlQuote(username)} LIMIT 1`;
const userIdOutput = await runWrangler(['d1', 'execute', 'ADMIN_DB', mode, '--json', '--command', userIdSql]);
const userId = parseUserId(userIdOutput);

if (!userId) {
  console.error(userIdOutput);
  throw new Error(`Cannot find identifier_passwords row for username: ${username}`);
}

const iterations = getPbkdf2Iterations();
const hash = await hashPassword(userId, username, password, iterations);
const updateSql = `UPDATE identifier_passwords SET hash = ${sqlQuote(hash)} WHERE name = ${sqlQuote(username)}`;
await runWrangler(['d1', 'execute', 'ADMIN_DB', mode, '--json', '--command', updateSql]);

console.log(`Updated password hash for ${username} in ${mode === '--remote' ? 'remote' : 'local'} ADMIN_DB.`);
console.log(`PBKDF2 iterations: ${iterations}. AUTH_SALT: ${process.env.AUTH_SALT === undefined ? 'not set' : 'set'}.`);
