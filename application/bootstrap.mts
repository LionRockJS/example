import { Central } from '@lionrockjs/central';

await Central.initConfig(new Map([
  ['site', await import('./config/system.mts')],
]));