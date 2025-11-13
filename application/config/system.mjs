import {ServerAdapterNodeHTTP} from "@lionrockjs/platform-web-node-http";

export default {
  DEFAULT_EMAIL_SENDER: process.env.DEFAULT_EMAIL_SENDER || 'rsvp@cowise.com.hk',
  APP_NAME: process.env.APP_NAME || 'Eventuai',
  APP_TITLE: process.env.APP_TITLE || 'Eventuai',
  APP_HOME_URL: process.env.APP_HOME_URL || 'https://example.com',

  debug: process.env.DEBUG === "true",
  serve_static_file: process.env.SERVE_STATIC === "true",

  platform:{
    adapter: ServerAdapterNodeHTTP
  }
}