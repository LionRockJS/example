import { Central } from '@lionrockjs/central';
await Central.addModules([
  await import('@lionrockjs/adapter-view-liquidjs'),
]);