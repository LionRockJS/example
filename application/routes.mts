import { RouteList } from '@lionrockjs/router';

RouteList.add('/', 'controller/Home');
RouteList.add('/pages/:slug', 'controller/Home', 'page');
console.log('routes added');
