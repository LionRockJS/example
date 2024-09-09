import { Central, ControllerMixinDatabase, Model, View } from '@lionrockjs/central';
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
    MixinSession,
    await import('@lionrockjs/mixin-form'),
    await import('@lionrockjs/mod-auth'),
    await import('@lionrockjs/mod-admin'),
    await import('@lionrockjs/mod-admin-cms'),
  ]);
})();
