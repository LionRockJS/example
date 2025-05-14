import {Controller} from '@lionrockjs/mvc';

export default class ControllerHome extends Controller{
  static mixins = [];
  constructor(request) {
    super(request);
  }

  async action_index() {
    this.state.set(Controller.STATE_BODY, 'Hello World');
  }

  async action_page(){
    this.state.set(Controller.STATE_BODY, 'This is the page action');
  }
}