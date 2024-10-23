import { Central } from '@lionrockjs/central';

await Central.addModules([
  await import('@lionrockjs/adapter-mail-aws'),
  await import('@lionrockjs/adapter-view-liquidjs'),
  await import('@lionrockjs/adapter-database-better-sqlite3'),
  await import('@lionrockjs/adapter-form-captcha-recaptcha'),
  await import('@lionrockjs/mixin-form'),
  await import('@lionrockjs/mod-cold-leads'),
]);