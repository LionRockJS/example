import {Request, Controller} from "@lionrockjs/mvc";
import {Central, ControllerMixinDatabase, ControllerMixinMime, ControllerMixinView, ControllerMixinViewState} from "@lionrockjs/central";
import {ControllerMixinLoginRequire} from "@lionrockjs/mod-auth";
import {ControllerMixinSession} from "@lionrockjs/mixin-session";

export default class ControllerAdminHome extends Controller {
  static mixins = [...Controller.mixins,
    ControllerMixinDatabase,
    ControllerMixinSession,
    ControllerMixinLoginRequire,
    ControllerMixinView
  ]

  constructor(request: Request) {
    super(request, new Map([
      [ControllerMixinLoginRequire.REJECT_LANDING, '/login'],
      [ControllerMixinLoginRequire.ALLOW_ROLES, new Set(['admin', 'staff'])],
      [ControllerMixinViewState.LAYOUT_FILE, 'layout/admin/default'],
    ]));
  }

  async action_index() {
    ControllerMixinView.setTemplate(this.state, 'templates/admin/home', {});
    console.log('Hello This is Admin');
  }
}