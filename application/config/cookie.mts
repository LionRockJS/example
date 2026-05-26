const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;

export default {
  options: {
    secure: true,
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
    httpOnly: true,
    sameSite: 'Strict',
    path: '/',
    priority: 'High',
  },
};
