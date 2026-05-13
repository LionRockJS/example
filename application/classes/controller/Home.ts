import {Controller, ControllerState} from '@lionrockjs/mvc';
import {ControllerMixinView, Central} from '@lionrockjs/central';
import fs from 'node:fs';


export default class ControllerHome extends Controller{
  static mixins = [ControllerMixinView];

  async action_index() {
    const headers = this.state.get(ControllerState.REQUEST_HEADERS);

    ControllerMixinView.setTemplate(this.state, 'templates/page', {
      ipcountry: headers['cf-ipcountry'] || 'HK'
    });
  }

  async action_page(){
    const data = fs.readFileSync(Central.VIEW_PATH + '/templates/page.json', 'utf8');

    ControllerMixinView.setTemplate(this.state, 'templates/page', {
      data
    });
  }
}