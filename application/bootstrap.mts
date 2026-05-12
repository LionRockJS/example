import { Central } from '@lionrockjs/central';

await Central.initConfig(new Map([
  ['system', await import('./config/system.mts')],
]));