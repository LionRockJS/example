import { Central } from '@lionrockjs/central';
import AdapterViewLiquid, { LiquidView } from '@lionrockjs/adapter-view-liquidjs';
import { View } from '@lionrockjs/mvc';
View.DefaultViewClass = LiquidView;

import MixinSession, { ControllerMixinSession } from '@lionrockjs/mixin-session';
import { SessionJWT } from '@lionrockjs/adapter-session-jwt';
ControllerMixinSession.defaultAdapter = SessionJWT;

await Central.addModules([
  AdapterViewLiquid,
  await import('@lionrockjs/mixin-form'),
  MixinSession,
  await import('@lionrockjs/mod-auth'),
  await import('@lionrockjs/adapter-auth-password'),
  await import('@lionrockjs/mod-admin'),
  await import('@lionrockjs/view-admin'),
]);

export default {}