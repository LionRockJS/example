import { Central, ControllerMixinDatabase, Model } from '@lionrockjs/central';
import { View } from '@lionrockjs/mvc';
import AdapterViewLiquid, { LiquidView } from '@lionrockjs/adapter-view-liquidjs';
View.DefaultViewClass = LiquidView;

import { ORMAdapterSQLite, DatabaseAdapterBunSqlite } from "@lionrockjs/adapter-database-bun-sqlite";
Model.defaultAdapter = ORMAdapterSQLite;
ControllerMixinDatabase.defaultAdapter = DatabaseAdapterBunSqlite;

import MixinSession, {ControllerMixinSession} from '@lionrockjs/mixin-session';
import {SessionJWT} from '@lionrockjs/adapter-session-jwt';
ControllerMixinSession.defaultAdapter = SessionJWT;
import AdapterPassword from '@lionrockjs/adapter-auth-password';

Central.addModules([
  AdapterViewLiquid,
  await import('@lionrockjs/mixin-form'),
  MixinSession,
  await import('@lionrockjs/mod-auth'),
  AdapterPassword,
  await import('@lionrockjs/mod-admin'),
]);