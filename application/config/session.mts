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
  },
  clockTolerance: 60,
  issuer: 'example-admin',
  audience: 'example-admin',
  minimumSecretLength: 32,
  maxTokenLength: 4096,
};
