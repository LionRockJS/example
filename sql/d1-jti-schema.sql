CREATE TABLE IF NOT EXISTS refresh_token_jti (
  sid  TEXT    PRIMARY KEY,
  jti  TEXT    NOT NULL,
  exp  INTEGER NOT NULL
);
