import { Central } from '@lionrockjs/central';
import MixinSession, { ControllerMixinSession } from '@lionrockjs/mixin-session';
import { SessionJWT } from '@lionrockjs/adapter-session-jwt';
ControllerMixinSession.defaultAdapter = SessionJWT;

const AdapterViewLiquid = await import('@lionrockjs/adapter-view-liquidjs');
import { View } from '@lionrockjs/mvc';
View.DefaultViewClass = AdapterViewLiquid.LiquidView;

await Central.addModules([
  AdapterViewLiquid,
  MixinSession,
  await import('@lionrockjs/adapter-session-jwt'),
]);

export default {}
