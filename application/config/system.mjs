import {ServerAdapter} from "@lionrockjs/platform-web-fastify";

export default {
  debug: process.env.DEBUG === "true",
  serve_static_file: process.env.SERVE_STATIC === "true",

  platform:{
    adapter: ServerAdapter
  }
}