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
Central.addModules([
  AdapterViewLiquid,
  await import('@lionrockjs/mixin-form'),
  MixinSession,
  await import('@lionrockjs/mod-auth'),
  await import('@lionrockjs/adapter-auth-password'),
  await import('@lionrockjs/mod-admin'),
  await import('@lionrockjs/view-admin')
]);