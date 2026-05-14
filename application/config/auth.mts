import * as url from 'node:url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');

import {IdentifierPassword} from '@lionrockjs/adapter-auth-password';

const databaseMapName = 'admin';
const databasePath = `${__dirname}/../../database`;
const userDatabase = 'admin.sqlite';

export default {
  databasePath,
  userDatabase,
  databaseMapName,
  databaseMap: new Map([
    [databaseMapName, `${databasePath}/${userDatabase}`],
  ]),

  identifiers: [IdentifierPassword],
  destination: 'admin',
};