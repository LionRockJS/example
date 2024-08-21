import {Central, Controller, ControllerMixinDatabase, ControllerMixinView} from "@lionrockjs/central";

export default class ControllerHome extends Controller {
  static mixins = [...Controller.mixins,
    ControllerMixinDatabase,
    ControllerMixinView,
  ]

  constructor(request){
    super(request, new Map([
      [ControllerMixinView.LAYOUT_FILE, 'layout/default'],
      [ControllerMixinDatabase.DATABASE_MAP, new Map([['session', `${Central.config.auth.databasePath}/session.sqlite`]]),
      ]
    ]));
  }

  async action_index() {
    console.log('Hello Database');
  }
}