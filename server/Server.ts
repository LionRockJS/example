import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie';
import { RouteList } from '@lionrockjs/router';
import {Central} from '@lionrockjs/central';

import { ControllerMixinMultipartForm, MultipartParserR2 } from '@lionrockjs/mixin-form';
ControllerMixinMultipartForm.fileAdapter = MultipartParserR2;

await import('../application/import.mts'),
await import('../application/bootstrap.mts'),
await import('../application/routes.mts')

const views = await import('../views/index.ts');
views.default.forEach((value: any, key: string) => {
  Central.viewFiles.set(key, value);
});

const app = new Hono();

const requiredBindings = new Map([
  [
    'ADMIN_DB',
    'D1 database binding. Create a D1 database, update wrangler.jsonc with its database_id, and keep the binding name ADMIN_DB.',
  ],
  [
    'FORM_UPLOADS',
    'R2 bucket binding. Create the lionrockjs-form-uploads bucket or bind an existing bucket as FORM_UPLOADS.',
  ],
]);

app.use('*', async (c, next) => {
  const env = c.env ?? {};
  const missing = Array.from(requiredBindings.keys()).filter(binding => !env[binding]);

  if (missing.length > 0) {
    const details = missing
      .map(binding => `${binding}: ${requiredBindings.get(binding)}`)
      .join('\n');

    return c.text(
      `Cloudflare Worker binding configuration is incomplete.\nMissing binding(s): ${missing.join(', ')}\n\n${details}`,
      500
    );
  }

  await next();
});

const routes = Array.from(RouteList.routeMap.values());
routes.forEach((route: any) => {
  app.on(route.method, route.path, async c => {
    console.log(route.controller);
    let Controller;
    try {
      Controller = (await import(`../application/classes/${route.controller}.ts`)).default;
    } catch (e) {
      Controller = Central.resolveController(route.controller);
      if (!Controller) throw e;
    }
    const controller = new Controller(
      {...c.req, 
        params: c.req.param(),
        query: c.req.query(),
        headers: c.req.header(),
        cookies: getCookie(c),
        env: c.env,
      }
    );
    const result = await controller.execute(route.action);
    Object.entries(result.headers).forEach(([key, value]) => c.header(key, String(value)));
    result.cookies.forEach(cookie => setCookie(c, cookie.name, cookie.value, cookie.options));
    return c.html(result.body, result.status as any);
  });
});

export default app;
