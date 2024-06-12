import {ControllerAdmin} from '@lionrockjs/mod-admin';
import {Central, ORM, ControllerMixinDatabase, Controller} from '@lionrockjs/central';
import HelperRSVP from '../../helper/RSVP.mjs';

import Lead from '../../model/Lead.mjs';
import LeadInfo from '../../model/LeadInfo.mjs';

export default class ControllerAdminRSVP extends ControllerAdmin {
  constructor(request) {
    super(request, Lead, {
      roles: new Set(['staff', 'moderator']),
      databases: new Map([
        ['lead', Central.config.setup.databaseFolder+'/www/lead.sqlite'],
        ['lead_info', Central.config.setup.databaseFolder+'/www/lead_info.sqlite'],
        ['mail', Central.config.setup.databaseFolder+'/mail.sqlite']
      ]),
      templates: new Map([
        ['index', 'templates/admin/guests/index'],
        ['read', 'templates/admin/guests/read'],
        ['edit', 'templates/admin/guests/read'],
      ]),
      database: 'guest',
      pagesize: 50,
    });
  }

  async action_index() {}

  async action_send_email(){
    const {id} = this.state.get(Controller.STATE_PARAMS)
    const databases = this.state.get(ControllerMixinDatabase.DATABASES);
    const database = databases.get('lead');
    const instance = await ORM.factory(Lead, id, {database});
    const info = await ORM.factory(LeadInfo, id, {database: databases.get('lead_info')});

    Object.assign(instance, ...info);

    const helperRegister = new HelperRSVP(
      database,
      databases.get('mail'),
      this.clientIP,
      this.request.hostname
    )

    await helperRegister.sendRSVP(instance, Central.config.edm);

    info.rsvp_code = "111.111.111";
    await info.write();

    await this.redirect(this.request.query.cp || '/admin/rsvp/');
  }

}
