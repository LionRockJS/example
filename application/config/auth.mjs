import path from 'node:path';
import {Central} from '@lionrockjs/central';
import {IdentifierPassword} from '@lionrockjs/adapter-auth-password';

export default {
  databasePath: "",
  databaseMap: new Map([
    ['admin', 'postgres://postgres:postgres@localhost:5432/lionrockjs?options=-c%20search_path%3Dadmin'],
  ]),
  userDatabase: 'public',
  databaseMapName : "admin",
  identifiers: [IdentifierPassword],
  destination: 'admin',
};
