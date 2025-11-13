import { Central } from '@lionrockjs/central';

await Central.addModules([
  await import('@lionrockjs/mixin-form'),
  await import('@lionrockjs/mixin-session'),

  await import('@lionrockjs/adapter-view-liquidjs'),
  await import('@lionrockjs/adapter-database-better-sqlite3'),
  await import('@lionrockjs/adapter-auth-password'),
  await import('@lionrockjs/adapter-session-jwt'),

  await import('@lionrockjs/mod-auth'),
  await import('@lionrockjs/mod-admin'),

  await import('@lionrockjs/view-admin'),
]);