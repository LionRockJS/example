import { Central } from '@lionrockjs/central';

await (async () => {
  Central.addModules([
    await import('@lionrockjs/adapter-view-liquidjs'),
    await import('@lionrockjs/mixin-form'),
  ]);
})();
