import path from 'node:path';
import {Central} from '@lionrockjs/central';
import {IdentifierPassword} from '@lionrockjs/adapter-auth-password';

export default {
  databasePath: "",
  databaseMap: new Map([
    ['admin', 'postgres://postgres:postgres@localhost:5432/lionrock_test'],
  ]),
  userDatabase: 'public',
  databaseMapName : "admin",
  identifiers: [IdentifierPassword],
  destination: 'admin',
};
