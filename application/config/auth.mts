import * as url from 'node:url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');

import {IdentifierPassword} from '@lionrockjs/adapter-auth-password';

const databaseMapName = 'admin';
const userDatabase = 'admin.sqlite';

export default {
  databasePath: `${__dirname}/../../database`,
  userDatabase,
  databaseMapName,
  databaseMap: new Map([
    [databaseMapName, userDatabase],
  ]),

  identifiers: [IdentifierPassword],
  destination: 'admin',
};