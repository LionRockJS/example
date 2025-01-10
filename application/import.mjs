import { Central, ControllerMixinDatabase, Model } from '@lionrockjs/central';
import { View } from '@lionrockjs/mvc';
import AdapterViewLiquid, { LiquidView } from '@lionrockjs/adapter-view-liquidjs';
import { ORMAdapterSQLite, DatabaseAdapterBetterSQLite3 } from "@lionrockjs/adapter-database-better-sqlite3";
import MixinSession, {ControllerMixinSession} from '@lionrockjs/mixin-session';
import AdapterSessionDatabase from "@lionrockjs/adapter-session-database";

View.DefaultViewClass = LiquidView;
Model.defaultAdapter = ORMAdapterSQLite;
ControllerMixinDatabase.defaultAdapter = DatabaseAdapterBetterSQLite3;
ControllerMixinSession.defaultAdapter = AdapterSessionDatabase;

await (async () => {
  Central.addModules([
    AdapterViewLiquid,
    MixinSession,
    AdapterSessionDatabase,
    await import('@lionrockjs/mixin-form'),
    await import('@lionrockjs/mod-auth'),
    await import('@lionrockjs/adapter-auth-password'),
    await import('@lionrockjs/mod-admin'),
  ]);
})();