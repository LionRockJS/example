import { Hono } from 'hono'
import { RouteList } from '@lionrockjs/router';

RouteList.add('/', 'controller/Home');
RouteList.add('/pages/:slug', 'controller/Home', 'page');

const app = new Hono();
const routes = Array.from(RouteList.routeMap.values());
routes.forEach((route: any) => {
console.log(route);

  app.on(route.method, route.path, async c => {
    const Controller = (await import(`../application/classes/${route.controller}.ts`)).default;
    const controller = new Controller(
      {...c.req, params: c.req.param()}
    );
    const result = await controller.execute(route.action);
    return c.text(result.body, result.status);
  });
});

export default {
  async fetch(request: Request) {
    return await app.fetch(request);
  }
};