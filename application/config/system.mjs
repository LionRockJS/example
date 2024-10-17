import {Central} from '@lionrockjs/central';

export default {
  debug: true,//(Central.ENV !== Central.ENV_PROD),
  serve_static_file: true//Central.ENV === Central.ENV_DEVE,
}