import 'dotenv/config';
import {Central, CentralEnv} from '@lionrockjs/central';
import Server from './Server.ts';

Central.ENV = CentralEnv.PRODUCTION;

(async () => {
  const s = new Server(parseInt(process.env.PORT ?? '8000') + 6);
  await s.setup();
  await s.listen();
})();
