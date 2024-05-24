import {Controller} from "@lionrockjs/mvc";
import {Central, ControllerMixinDatabase, ControllerMixinMime, ControllerMixinView} from "@lionrockjs/central";
import {ControllerMixinLoginRequire} from "@lionrockjs/mod-auth";
import {ControllerMixinSession} from "@lionrockjs/mixin-session";

export default class ControllerAdminHome extends Controller {
  static mixins = [...Controller.mixins,
    ControllerMixinDatabase,
    ControllerMixinSession,
    ControllerMixinLoginRequire,
    ControllerMixinView]

  constructor(request){
    super(request, new Map([
      [ControllerMixinLoginRequire.REJECT_LANDING, '/login'],
      [ControllerMixinLoginRequire.ALLOW_ROLES, new Set(['admin', 'staff'])],
      [ControllerMixinView.LAYOUT_FILE, 'layout/admin/default'],
      [ControllerMixinDatabase.DATABASE_MAP, new Map([['session', `${Central.config.auth.databasePath}/session.sqlite`]]),
      ]
    ]));
  }

  async action_index() {
    console.log('Hello This is Admin');
  }
}