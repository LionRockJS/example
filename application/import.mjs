import { Central, View } from '@lionrockjs/central';
import AdapterViewLiquid, { LiquidView } from '@lionrockjs/adapter-view-liquidjs';
View.DefaultViewClass = LiquidView;

await (async () => {
  Central.addModules([
    AdapterViewLiquid,
  ]);
})();
