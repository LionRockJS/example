import {Central} from '@lionrockjs/central';
import { ServerAdapterFastify } from "@lionrockjs/platform-web-fastify";

export default {
  debug: (Central.ENV !== Central.ENV_PRODUCTION),
  serve_static_file: Central.ENV === Central.ENV_DEV,
  platform:{
    adapter: ServerAdapterFastify
  }
}