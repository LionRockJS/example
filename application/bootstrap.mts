import { Central } from '@lionrockjs/central';

await Central.addConfig(new Map<string, any>([
  ['system', await import('./config/system.mts')],
  ['cookie', await import('./config/cookie.mts')],
  ['session', await import('./config/session.mts')],
]));
