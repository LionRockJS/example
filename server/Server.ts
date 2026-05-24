import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie';
import { RouteList } from '@lionrockjs/router';
import {Central} from '@lionrockjs/central';

import { ControllerMixinMultipartForm, MultipartParserR2 } from '@lionrockjs/mixin-form';
ControllerMixinMultipartForm.fileAdapter = MultipartParserR2;

await import('../application/bootstrap.mts'),
await import('../application/import.mts'),
await import('../application/routes.mts')

const views = await import('../views/index.ts');
views.default.forEach((value: any, key: string) => {
  Central.viewFiles.set(key, value);
});

const app = new Hono();
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
    Object.entries(result.headers).forEach(([key, value]) => c.header(key, value));
    result.cookies.forEach(cookie => setCookie(c, cookie.name, cookie.value, cookie.options));
    return c.html(result.body, result.status as any);
  });
});

export default app;
