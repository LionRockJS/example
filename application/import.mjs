import { Central } from '@lionrockjs/central';

import {ControllerMixinSession} from '@lionrockjs/mixin-session';
import {SessionJWT} from '@lionrockjs/adapter-session-jwt';
ControllerMixinSession.defaultAdapter = SessionJWT;

await Central.addModules([
  await import("@lionrockjs/adapter-database-better-sqlite3"),
  await import('@lionrockjs/adapter-view-liquidjs'),
  await import('@lionrockjs/mixin-form'),
  await import('@lionrockjs/mixin-session'),
  await import('@lionrockjs/mod-auth'),
  await import('@lionrockjs/adapter-auth-password'),
  await import('@lionrockjs/mod-admin')
]);