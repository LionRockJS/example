import {Controller, ControllerState} from '@lionrockjs/mvc';
import {ControllerMixinView} from '@lionrockjs/central';
import {ControllerMixinMultipartForm} from '@lionrockjs/mixin-form';

export default class ControllerHome extends Controller{
  static mixins = [ControllerMixinMultipartForm, ControllerMixinView];

  async action_index() {
    const request = this.state.get(ControllerState.REQUEST);
    ControllerMixinView.setTemplate(this.state, 'templates/home', {
      ipcountry: request.headers['cf-ipcountry'] || 'HK'
    });
  }

  async action_page(){
    this.state.set(ControllerState.BODY, '');
  }

  async action_form_post(){
    const $_POST = this.state.get(ControllerMixinMultipartForm.POST_DATA);
    ControllerMixinView.setTemplate(this.state, 'templates/submit', {post: $_POST, keys: Object.keys($_POST)});
  }
}