import {IdentifierPassword} from '@lionrockjs/adapter-auth-password';

const databaseMapName = 'admin';
const databasePath = `database`;
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