import path from 'node:path';
import { Central } from '@lionrockjs/central';

export default {
  databaseMap: new Map([
    ['admin', `${Central.APP_PATH}/../database/admin.sqlite`],
  ])
};
