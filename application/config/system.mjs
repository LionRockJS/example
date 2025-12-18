import {Central, CentralEnv} from '@lionrockjs/central';

export default {
  debug: (Central.ENV !== CentralEnv.PRODUCTION),
  serve_static_file: false,
}