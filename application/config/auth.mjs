import path from 'node:path';
import {Central} from '@lionrockjs/central';
import {IdentifierPassword} from '@lionrockjs/adapter-auth-password';

const databaseMapName = 'admin';
const userDatabase = 'admin.sqlite';

export default {
  databasePath: path.normalize(Central.EXE_PATH + '/../database'),
  userDatabase,
  databaseMapName,
  databaseMap: new Map([
    [databaseMapName, `${Central.EXE_PATH}/../database/${userDatabase}`],
  ]),

  identifiers: [IdentifierPassword],
  destination: 'admin',
};