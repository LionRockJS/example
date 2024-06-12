import { RouteList, Central } from '@lionrockjs/central';
import path from "path";
import fs from "fs";

RouteList.add('/', 'controller/Home');
RouteList.add('/pages/:slug', 'controller/Home', 'page');

RouteList.add('/admin/rsvp', 'controller/admin/RSVP');
RouteList.add('/admin/rsvp/send/:id', 'controller/admin/RSVP', 'send_email');

await Promise.all([...Central.nodePackages.values()].map( async x => {
  const filePath = path.normalize(`${x}/routes.mjs`);
  if (!fs.existsSync(filePath)) return;
  await import('file://'+filePath);
}));