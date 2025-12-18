import {Controller, ControllerState, Request} from '@lionrockjs/mvc';

export default class ControllerHome extends Controller{
  static mixins = [];
  constructor(request: Request) {
    super(request);
  }

  async action_index() {
    this.state.set(ControllerState.BODY, 'Hello World');
  }

  async action_page(){
    this.state.set(ControllerState.BODY, 'This is the page action');
  }
}