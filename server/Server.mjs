import { ServerAdapterNodeHTTP } from "@lionrockjs/platform-web-node-http";

import * as url from 'node:url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');

import path from 'node:path';
import {Central} from '@lionrockjs/central';
import {RouteList} from '@lionrockjs/router';

export default class Server {
  constructor(port = 8001) {
    this.port = port;
  }

  async setup() {
    // setup LionRockJS path constants
    await Central.init({
      EXE_PATH:  path.normalize(__dirname),
      APP_PATH:  path.normalize(`${__dirname}/../application`),
      VIEW_PATH: path.normalize(`${__dirname}/../views`),
    });

    await import('../application/import.mjs');
    await Central.reloadModuleInit(true);
    await import('../application/routes.mjs');

    this.adapter = Central.config.site?.platform?.adapter || ServerAdapterNodeHTTP;
    this.app = await this.adapter.setup();
  }

  async listen() {
    console.log(Central.ENV, Central.config);
    console.log(Array.from(RouteList.routeMap.values()).map(route => route.path + " " + route.method + ' => '+ route.controller + '::action_' + route.action).sort());
    await this.app.listen(this.port);
    console.log(`app listening at ${this.port}`);
  }
}