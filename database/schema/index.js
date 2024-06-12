import url from "node:url";
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');

import {build} from '@lionrockjs/start';

build(__dirname, 'session', 'session');
build(__dirname, 'admin', 'admin', '', true);
build(__dirname, 'lead_info', 'lead_info', 'www', true);
build(__dirname, 'lead', 'lead', 'www', true);
build(__dirname, 'lead_action', 'lead_action', 'www', true);
build(__dirname, 'mail', 'mail');