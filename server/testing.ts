import 'dotenv/config';
import {Central, CentralEnv} from '@lionrockjs/central';
import Server from './Server.mjs';

Central.ENV = CentralEnv.TEST;

(async () => {
  const s = new Server(parseInt(process.env.PORT ?? '8000') + 4);
  await s.setup();
  await s.listen();
})();
