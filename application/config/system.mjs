import {Central} from '@lionrockjs/central';
import { ServerAdapterNodeHTTP } from "@lionrockjs/platform-web-node-http";

export default {
  debug: (Central.ENV !== Central.ENV_PRODUCTION),
  serve_static_file: Central.ENV === Central.ENV_DEV,
  platform:{
    adapter: ServerAdapterNodeHTTP
  }
}