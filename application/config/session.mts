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
  // JTI validation is handled by the auth worker (ts/admin/workers).
  // This CMS worker only verifies the JWT signature using SESSION_SECRET.
  jti: {
    enabled: false,
  },
  clockTolerance: 60,
  // issuer/audience must match the auth worker's session config.
  // Update these to match the ts/admin/workers deployment name.
  issuer: 'example-admin',
  audience: 'example-admin',
  authorizationHeader: true,
  minimumSecretLength: 32,
  maxTokenLength: 4096,
};
