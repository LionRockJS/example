import { Hono } from 'hono'
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

console.log(Central.config);

const app = new Hono();
const routes = Array.from(RouteList.routeMap.values());
routes.forEach((route: any) => {
  app.on(route.method, route.path, async c => {
    const Controller = (await import(`../application/classes/${route.controller}.ts`)).default;
    const controller = new Controller(
      {...c.req, 
        params: c.req.param(),
        headers: c.req.header(),
        env: c.env,
      }
    );
    const result = await controller.execute(route.action);
    return c.html(result.body, result.status);
  });
});

export default app;