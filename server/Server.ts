import * as url from 'node:url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');

import path from 'node:path';
import fs from 'node:fs';
import {Central, RuntimeAdapterBun} from '@lionrockjs/central';
import {RouteList} from '@lionrockjs/router';

Central.runtime = new RuntimeAdapterBun();
const controllerDir = path.join(__dirname, '../application/classes/controller');
for (const file of fs.readdirSync(controllerDir).filter(f => f.endsWith('.ts'))) {
  const key = `controller/${path.basename(file, '.ts')}`;
  const mod = await import(`../application/classes/controller/${file}`);
  Central.controllerFiles.set(key, mod.default);
}

export default class Server {
  port: number;
  adapter: any;
  app: any;

  constructor(port = 8001) {
    this.port = port;
  }

  async setup() {
    await import('../application/bootstrap.mjs');
    await import('../application/import.mjs');
    await import('../application/routes.mjs');
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