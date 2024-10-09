import { Central, ControllerMixinDatabase, Model } from '@lionrockjs/central';
import { View } from '@lionrockjs/mvc';
import AdapterViewLiquid, { LiquidView } from '@lionrockjs/adapter-view-liquidjs';
import { ORMAdapterSQLite, DatabaseAdapterBetterSQLite3 } from "@lionrockjs/adapter-database-better-sqlite3";
import MixinSession, {ControllerMixinSession} from '@lionrockjs/mixin-session';
import {SessionJWT} from '@lionrockjs/adapter-session-jwt';

View.DefaultViewClass = LiquidView;
Model.defaultAdapter = ORMAdapterSQLite;
ControllerMixinDatabase.defaultAdapter = DatabaseAdapterBetterSQLite3;
ControllerMixinSession.defaultAdapter = SessionJWT;

await (async () => {
  Central.addModules([
    AdapterViewLiquid,
    await import('@lionrockjs/mixin-form'),
    MixinSession,
    await import('@lionrockjs/mod-auth'),
    await import('@lionrockjs/adapter-auth-password'),
    await import('@lionrockjs/mod-admin'),
    await import('@lionrockjs/mod-mail'),
    await import('@lionrockjs/adapter-mail-aws'),
    await import('@lionrockjs/mod-cold-leads'),
    await import('@lionrockjs/mod-admin-rsvp')
  ]);
})();