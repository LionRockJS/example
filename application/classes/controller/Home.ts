import { Controller, ControllerState } from '@lionrockjs/mvc';
import { ControllerMixinSession } from '@lionrockjs/mixin-session';

export default class ControllerHome extends Controller {
  static mixins = [...Controller.mixins, ControllerMixinSession];

  async action_index() {
    const request = this.state.get(ControllerState.REQUEST);
    this.state.set(ControllerState.BODY, JSON.stringify(request.session));
  }

  async action_page() {
    return this.action_index();
  }
}
