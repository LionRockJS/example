const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

export default {
  saveUninitialized: false,
  resave: false,
  name: '__Host-lionrock-session',
  algorithm: 'HS256',
  expires: ACCESS_TOKEN_TTL_SECONDS,
  cookieMaxAge: ACCESS_TOKEN_TTL_SECONDS,
  accessToken: {
    expires: ACCESS_TOKEN_TTL_SECONDS,
    cookieMaxAge: ACCESS_TOKEN_TTL_SECONDS,
  },
  refreshToken: {
    enabled: true,
    name: '__Host-lionrock-session-refresh',
    expires: REFRESH_TOKEN_TTL_SECONDS,
    cookieMaxAge: REFRESH_TOKEN_TTL_SECONDS,
    rotate: true,
  },
  jti: {
    enabled: true,
    tokenUse: 'refresh',
    require: true,
    async persist({ jti, session, exp, options }: { jti: string; session: any; exp: number; options: any }) {
      const db = options?.state?.get?.('request')?.env?.ADMIN_DB as D1Database | undefined;
      if (!db) return;
      await db.prepare(
        'INSERT INTO refresh_token_jti (sid, jti, exp) VALUES (?1, ?2, ?3) ON CONFLICT (sid) DO UPDATE SET jti = excluded.jti, exp = excluded.exp'
      ).bind(session.sid, jti, exp).run();
    },
    async verify({ jti, session, options }: { jti: string; session: any; options: any }) {
      const db = options?.state?.get?.('request')?.env?.ADMIN_DB as D1Database | undefined;
      if (!db) return true;
      const row = await db.prepare(
        'SELECT jti FROM refresh_token_jti WHERE sid = ?1'
      ).bind(session.sid).first<{ jti: string }>();
      return row?.jti === jti;
    },
  },
  clockTolerance: 60,
  issuer: 'example-admin',
  audience: 'example-admin',
  minimumSecretLength: 32,
  maxTokenLength: 4096,
};
