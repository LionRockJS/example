import {Central} from '@lionrockjs/central';
import { ServerAdapterExpress } from "@lionrockjs/platform-web-express";

export default {
  debug: (Central.ENV !== Central.ENV_PRODUCTION),
  serve_static_file: Central.ENV === Central.ENV_DEV,
  platform:{
    adapter: ServerAdapterExpress
  }
}
