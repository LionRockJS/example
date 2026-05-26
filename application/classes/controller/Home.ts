import { Controller } from '@lionrockjs/mvc';
import { ControllerMixinSession } from '@lionrockjs/mixin-session';

export default class ControllerHome extends Controller {
  static mixins = [...Controller.mixins, ControllerMixinSession];

  async action_index() {
    const request = this.state.get(Controller.STATE_REQUEST);
    const { id, sid, creator } = request.session;
    this.state.set(Controller.STATE_BODY, JSON.stringify({ id, sid, creator }));
  }

  async action_page() {
    return this.action_index();
  }
}
