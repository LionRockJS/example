import * as url from 'node:url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');

import path from 'node:path';
import fs from 'node:fs';
import {Central, RuntimeAdapterBun} from '@lionrockjs/central';
import {RouteList} from '@lionrockjs/router';
import packageJson from '../package.json'

const runtimeAdapterBun = new RuntimeAdapterBun();
Central.runtime = runtimeAdapterBun;
await runtimeAdapterBun.registerControllers(path.join(__dirname, '../application/classes/controller'));
await runtimeAdapterBun.registerViews({ package: packageJson.name, path: path.join(__dirname, '../views') });

console.log(Central.viewFiles.keys());

export default class Server {
  port: number;
  adapter: any;
  app: any;

  constructor(port = 8001) {
    this.port = port;
  }

  async setup() {
    await import('../application/import.mts');
    await import('../application/bootstrap.mts');
    await import('../application/routes.mts');
    this.adapter = Central.config.system.platform.adapter;
    this.app = await this.adapter.setup();
  }

  async listen() {
    console.log(Central.ENV, Central.config);
    console.log(Array.from(RouteList.routeMap.values()).map(route => route.path + " " + route.method + ' => '+ route.controller + '::action_' + route.action).sort());
    await this.app.listen(this.port);
    console.log(`app listening at ${this.port}`);
  }
}