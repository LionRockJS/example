import { Central } from '@lionrockjs/central';

await Central.addConfig(new Map([
  ['system', await import('./config/system.mts')]
]));