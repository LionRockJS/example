import * as url from 'node:url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');

import path from 'node:path';
import fs from 'node:fs';
import {Central, RuntimeAdapterBun} from '@lionrockjs/central';
import {RouteList} from '@lionrockjs/router';

Central.runtime = new RuntimeAdapterBun();
const controllerDir = path.join(__dirname, '../application/classes/controller');
for (const file of fs.readdirSync(controllerDir).filter(f => f.endsWith('.mjs') || f.endsWith('.ts') || f.endsWith('.js'))) {
  const ext = path.extname(file);
  const key = `controller/${path.basename(file, ext)}`;
  const mod = await import(`../application/classes/controller/${file}`);
  Central.controllerFiles.set(key, mod.default);
}

import packageJson from '../package.json'
const views = new Map(
  [
    ['layout/default', {
      package: packageJson.name,
      payload: await import('../views/layout/default.liquid'),
    }],
    ['sections/dev-footer', {
      package: packageJson.name,
      payload: await import('../views/sections/dev-footer.liquid'),
    }],
    ['sections/footnote', {
      package: packageJson.name,
      payload: await import('../views/sections/footnote.liquid'),
    }],
    ['sections/header', {
      package: packageJson.name,
      payload: await import('../views/sections/header.liquid'),
    }],
    ['sections/hero', {
      package: packageJson.name,
      payload: await import('../views/sections/hero.liquid'),
    }],
    ['sections/paragraphs', {
      package: packageJson.name,
      payload: await import('../views/sections/paragraphs.liquid'),
    }],
    ['templates/error', {
      package: packageJson.name,
      payload: await import('../views/templates/error.liquid'),
    }],
    ['templates/page', {
      package: packageJson.name,
      payload: await import('../views/templates/page.json'),
    }],
  ]
).forEach((value, key) => Central.viewFiles.set(key, value));

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