import {Central} from '@lionrockjs/central';

export default {
  debug: (Central.ENV !== Central.ENV_PRODUCTION),
  serve_static_file: false,
}