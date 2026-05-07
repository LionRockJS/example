import 'dotenv/config';
import {Central, CentralEnv, CentralAdapterWorker} from '@lionrockjs/central';
import {RouteList} from '@lionrockjs/router';

import {ServerAdapter} from "@lionrockjs/platform-cloudflare-workers";

Central.ENV = CentralEnv.PRODUCTION;
Central.adapter = new CentralAdapterWorker();

function escapeHtml(str: string) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const HTML_TEMPLATE = (title: string, body: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: monospace; padding: 2rem; background: #f5f5f5; }
    h1   { color: #333; }
    pre  { background: #fff; border: 1px solid #ddd; padding: 1rem; border-radius: 4px; white-space: pre-wrap; word-break: break-all; }
    .error { color: #c00; }
  </style>
</head>
<body>${body}</body>
</html>`;

function htmlResponse(title:string, body:string, status = 200) {
  return new Response(HTML_TEMPLATE(title, body), {
    status,
    headers: { 'Content-Type': 'text/html;charset=UTF-8' },
  });
}

export default {
  async fetch(request: Request) {
    await Central.init({
      EXE_PATH:  __dirname,
      APP_PATH:  `${__dirname}/../application`,
      VIEW_PATH: `${__dirname}/../views`,
    });


    await import('../application/import.mjs');
    await Central.reloadModuleInit(true);
    await import('../application/routes.mjs');

    const app = await ServerAdapter.setup();

    console.log(Central.ENV, Central.config);
    console.log(Array.from(RouteList.routeMap.values()).map(route => route.path + " " + route.method + ' => '+ route.controller + '::action_' + route.action).sort());

    console.log(app);
  }
}