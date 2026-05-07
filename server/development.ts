import 'dotenv/config';
import {Central, CentralEnv} from '@lionrockjs/central';

Central.ENV = CentralEnv.DEVELOPMENT;

import worker from './production.ts';

(async () => {
  worker.fetch(new Request('http://localhost/'))
})();
