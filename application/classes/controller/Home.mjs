import {Controller, ControllerMixinView, Central} from '@lionrockjs/central';
import fs from 'node:fs';


export default class ControllerHome extends Controller{
  static mixins = [ControllerMixinView];

  async action_index() {
    const request = this.state.get(Controller.STATE_REQUEST);
    ControllerMixinView.setTemplate(this.state, 'templates/page', {
      ipcountry: request.headers['cf-ipcountry'] || 'HK',
      page: {
        metafields:{page:{headline:{value: "Hello World"}}}
      }
    });
  }

  async action_page(){
    const data = fs.readFileSync(Central.VIEW_PATH + '/templates/page.json', 'utf8');

    ControllerMixinView.setTemplate(this.state, 'templates/page', {
      data
    });
  }
}