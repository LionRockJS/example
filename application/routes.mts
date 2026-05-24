import { RouteList } from '@lionrockjs/router';

RouteList.add('/', 'controller/Home');
RouteList.add('/pages/:slug', 'controller/Home', 'page');

import { routes as ModAuthRoutes } from '@lionrockjs/mod-auth';
ModAuthRoutes();
import { routes as ModAdminRoutes } from '@lionrockjs/mod-admin';
ModAdminRoutes();