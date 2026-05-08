import 'dotenv/config';
import {Central, CentralEnv} from '@lionrockjs/central';

Central.ENV = CentralEnv.DEVELOPMENT;

import worker from './production.ts';

(async () => {
  const result = await worker.fetch(new Request('http://localhost/pages/hello'));
  console.log(result);
})();
