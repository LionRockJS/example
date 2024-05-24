import { RouteList, Central } from '@lionrockjs/central';
import path from "path";
import fs from "fs";

RouteList.add('/', 'controller/Home');
RouteList.add('/pages/:slug', 'controller/Home', 'page');

[...Central.nodePackages.values()].forEach( async x => {
  const filePath = path.normalize(`${x}/routes.mjs`);
  if (!fs.existsSync(filePath)) return;
  await import('file://' + filePath);
});