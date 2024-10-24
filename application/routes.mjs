import path from "node:path";
import fs from "node:fs";
import { Central } from '@lionrockjs/central';
import { RouteList } from '@lionrockjs/router';

RouteList.add('/', 'controller/Home');
RouteList.add('/submit', 'controller/Home', 'form_post', 'POST');
RouteList.add('/pages/:slug', 'controller/Home', 'page');

RouteList.add(    `${Central.config.language.route}/contact`, 'controller/Contact', 'post', 'POST');