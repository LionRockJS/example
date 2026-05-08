import { Central } from '@lionrockjs/central';
import {HelperTranslate} from "@lionrockjs/adapter-view-liquidjs";

await Central.initConfig(new Map([
  ['liquidjs', await import('./config/liquidjs.mjs')],
]));

HelperTranslate.update();