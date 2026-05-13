import {Controller, ControllerState} from '@lionrockjs/mvc';
import {ControllerMixinView, Central} from '@lionrockjs/central';

export default class ControllerHome extends Controller{
  static mixins = [ControllerMixinView];

  async action_index() {
    const headers = this.state.get(ControllerState.REQUEST_HEADERS);

    ControllerMixinView.setTemplate(this.state, 'templates/page', {
      ipcountry: headers['cf-ipcountry'] || 'HK'
    });
  }

  async action_page(){
    ControllerMixinView.setTemplate(this.state, 'templates/page', {
      data: 'This is a page.'
    });
  }
}