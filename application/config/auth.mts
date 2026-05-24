import {IdentifierPassword} from '@lionrockjs/adapter-auth-password';

export default {
  databasePath: 'database',
  userDatabase : 'admin.sqlite',
  databaseMapName : 'admin',
  databaseMap: new Map([
    ['admin', `database/admin.sqlite`],
  ]),

  identifiers: [IdentifierPassword],
  destination: 'admin',
};