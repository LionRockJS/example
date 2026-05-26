import {Controller} from "@lionrockjs/mvc";
import {ControllerMixinDatabase, ControllerMixinView, ControllerMixinViewState} from "@lionrockjs/central";
import {ControllerMixinLoginRequire} from "@lionrockjs/mod-auth";
import {ControllerMixinSession} from "@lionrockjs/mixin-session";

export default class ControllerAdminHome extends Controller {
  static mixins = [...Controller.mixins,
    ControllerMixinDatabase,
    ControllerMixinSession,
    ControllerMixinLoginRequire,
    ControllerMixinView]

  constructor(request){
    // AUTH_URL: set in wrangler.jsonc vars (or .dev.vars) to point to the external
    // auth worker, e.g. https://v2-auth.eventuai.com/login
    const authLoginURL = (request as any).env?.AUTH_URL ?? '/login';
    super(request, new Map<any, any>([
      [ControllerMixinLoginRequire.REJECT_LANDING, authLoginURL],
      [ControllerMixinLoginRequire.ALLOW_ROLES, new Set(['admin', 'staff'])],
      [ControllerMixinViewState.LAYOUT_FILE, 'layout/admin/default'],
    ]));
  }

  async action_index() {
    ControllerMixinView.setTemplate(this.state, 'templates/admin/index');
  }
}
