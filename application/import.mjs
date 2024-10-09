import { Central, ControllerMixinDatabase, Model } from '@lionrockjs/central';
import { View } from '@lionrockjs/mvc';
import AdapterViewLiquid, { LiquidView } from '@lionrockjs/adapter-view-liquidjs';
View.DefaultViewClass = LiquidView;

import { ORMAdapterSQLite, DatabaseAdapterBetterSQLite3 } from "@lionrockjs/adapter-database-better-sqlite3";
Model.defaultAdapter = ORMAdapterSQLite;
ControllerMixinDatabase.defaultAdapter = DatabaseAdapterBetterSQLite3;

import MixinSession, {ControllerMixinSession} from '@lionrockjs/mixin-session';
import {SessionJWT} from '@lionrockjs/adapter-session-jwt';
ControllerMixinSession.defaultAdapter = SessionJWT;
import AdapterPassword from '@lionrockjs/adapter-auth-password';

await (async () => {
  Central.addModules([
    AdapterViewLiquid,
    await import('@lionrockjs/mixin-form'),
    MixinSession,
    await import('@lionrockjs/mod-auth'),
    AdapterPassword,
    await import('@lionrockjs/mod-admin'),
    await import('@lionrockjs/adapter-mail-aws'),
    await import('@lionrockjs/mod-cold-leads'),
    await import('@lionrockjs/mod-admin-rsvp')
  ]);
})();