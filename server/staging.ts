import 'dotenv/config';
import {Central, CentralEnv} from '@lionrockjs/central';
import Server from './Server.mjs';

Central.ENV = CentralEnv.STAGING;

(async () => {
  const s = new Server(parseInt(process.env.PORT ?? '8000') + 5);
  await s.setup();
  await s.listen();
})();
