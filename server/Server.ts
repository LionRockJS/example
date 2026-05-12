import { Hono } from 'hono'
import { RouteList } from '@lionrockjs/router';
await import('../application/bootstrap.ts');
await import('../application/import.ts');
await import('../application/routes.ts');

const app = new Hono();
const routes = Array.from(RouteList.routeMap.values());
routes.forEach((route: any) => {
  app.on(route.method, route.path, async c => {
    const Controller = (await import(`../application/classes/${route.controller}.ts`)).default;
    const controller = new Controller(
      {...c.req, params: c.req.param()}
    );
    const result = await controller.execute(route.action);
    return c.text(result.body, result.status);
  });
});

export default app;