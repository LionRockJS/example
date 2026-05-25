import { Central } from '@lionrockjs/central';
import { ControllerMixinDatabase, Model } from '@lionrockjs/central';
import AdapterDatabaseCloudflareD1, { DatabaseAdapterCloudflareD1, ORMAdapterSQLite } from '@lionrockjs/adapter-database-cloudflare-d1';

import MixinSession, { ControllerMixinSession } from '@lionrockjs/mixin-session';
import SessionJWT from './classes/session/JWT.ts';
ControllerMixinSession.defaultAdapter = SessionJWT;
Model.defaultAdapter = ORMAdapterSQLite;
ControllerMixinDatabase.defaultAdapter = DatabaseAdapterCloudflareD1;

const AdapterViewLiquid = await import('@lionrockjs/adapter-view-liquidjs');
import { View } from '@lionrockjs/mvc';
View.DefaultViewClass = AdapterViewLiquid.LiquidView;

await Central.addModules([
  AdapterViewLiquid,
  AdapterDatabaseCloudflareD1,
  await import('@lionrockjs/mixin-form'),
  MixinSession,
  await import('@lionrockjs/mod-auth'),
  await import('@lionrockjs/adapter-auth-password'),
  await import('@lionrockjs/mod-admin'),
  await import('@lionrockjs/view-admin'),
]);

ControllerMixinSession.defaultAdapter = SessionJWT;

export default {}
