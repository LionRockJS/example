import { Central } from '@lionrockjs/central';

await Central.addConfig(new Map<string, any>([
  ['system', await import('./config/system.mts')],
  ['auth', await import('./config/auth.mts')],
  ['signup', await import('./config/signup.mts')],
  ['admin', await import('./config/admin.mts')]
]));
