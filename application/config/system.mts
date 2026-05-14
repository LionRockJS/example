import {Central, CentralEnv} from '@lionrockjs/central';
import { ServerAdapter } from "@lionrockjs/platform-web-node-http";

export default {
  debug: (Central.ENV !== CentralEnv.PRODUCTION),
  serve_static_file: Central.ENV === CentralEnv.DEVELOPMENT,
  platform:{
    adapter: ServerAdapter
  }
}
