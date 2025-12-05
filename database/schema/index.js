const { build } = require('kohanajs-start');

build(
  `${__dirname}/auth.graphql`,
  `${__dirname}/auth.js`,
  `${__dirname}/exports/auth.sql`,
  `${__dirname}/default/user.sqlite`,
  `${__dirname}/../classes/model/`,
  true,
);
