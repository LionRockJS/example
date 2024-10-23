import url from "node:url";
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');

import {build} from '@lionrockjs/start';

build(__dirname, 'lead', 'lead', 'www', false);
build(__dirname, 'lead_info', 'lead_info', 'www', false);
