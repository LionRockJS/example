import {ServerAdapterNodeHTTP} from "@lionrockjs/platform-web-node-http";

export default {
  debug: process.env.DEBUG === "true",
  serve_static_file: process.env.SERVE_STATIC === "true",

  platform:{
    adapter: ServerAdapterNodeHTTP
  }
}