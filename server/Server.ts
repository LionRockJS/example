import * as url from 'node:url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');

import path from 'node:path';
import fs from 'node:fs';
import {Central, RuntimeAdapterBun} from '@lionrockjs/central';
import {RouteList} from '@lionrockjs/router';
import packageJson from '../package.json'

Central.runtime = new RuntimeAdapterBun();
const controllerDir = path.join(__dirname, '../application/classes/controller');
for (const file of fs.readdirSync(controllerDir).filter(f => f.endsWith('.mjs') || f.endsWith('.ts') || f.endsWith('.js'))) {
  const mod = await import(`../application/classes/controller/${file}`);
  Central.controllerFiles.set(
    `controller/${path.basename(file, path.extname(file))}`, 
    mod.default
  );
}

// Auto-register all views from the views directory
async function registerViews(dir: string, baseKey = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const key = baseKey ? `${baseKey}/${entry.name}` : entry.name;
    
    if (entry.isDirectory()) {
      await registerViews(fullPath, key);
    } else if (entry.name.endsWith('.liquid') || entry.name.endsWith('.json')) {
      const ext = path.extname(entry.name);
      const viewKey = key.substring(0, key.length - ext.length);
      const payload = await import(fullPath, { with: { type: ext === '.json' ? 'json' : 'text' } });
       Central.viewFiles.set(viewKey, {
        package: packageJson.name,
        payload,
      });
    }
  }
}

const viewsDir = path.join(__dirname, '../views');
await registerViews(viewsDir);

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