import { Central } from '@lionrockjs/central';

await Central.addConfig(new Map([
  ['system', await import('./config/system.mts')],
  ['auth', await import('./config/auth.mts')],
  ['signup', await import('./config/signup.mts')],
  ['admin', await import('./config/admin.mts')]
]));