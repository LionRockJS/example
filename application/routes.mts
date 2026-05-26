import { RouteList } from '@lionrockjs/router';

RouteList.add('/', 'controller/Home');
RouteList.add('/pages/:slug', 'controller/Home', 'page');

RouteList.add('/admin', 'controller/admin/Home');
export default{}