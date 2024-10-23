import path from "node:path";
import fs from "node:fs";
import { Central } from '@lionrockjs/central';
import { RouteList } from '@lionrockjs/router';

RouteList.add('/', 'controller/Home');
RouteList.add('/submit', 'controller/Home', 'form_post', 'POST');
RouteList.add('/pages/:slug', 'controller/Home', 'page');

await Promise.all([...Central.nodePackages.values()].map( async x => {
  const filePath = path.normalize(`${x}/routes.mjs`);
  if (!fs.existsSync(filePath)) return;
  await import('file://'+filePath);
}));