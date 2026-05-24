import {IdentifierPassword} from '@lionrockjs/adapter-auth-password';

export default {
  databasePath: 'ADMIN_DB',
  userDatabase : 'ADMIN_DB',
  databaseMapName : 'admin',
  databaseMap: new Map([
    ['admin', 'ADMIN_DB'],
  ]),

  identifiers: [IdentifierPassword],
  destination: 'admin',
};
