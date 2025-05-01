import 'dotenv/config';
import {Central} from '@lionrockjs/central';
import Server from './Server.mjs';

Central.ENV = Central.ENV_DEV;

(async () => {
  const s = new Server(process.env.PORT ?? 8000);
  await s.setup();
  await s.listen();
})();
