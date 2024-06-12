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
        ['lead', Central.APP_PATH+'/../database/www/lead.sqlite'],
        ['lead_info', Central.APP_PATH+'/../database/www/lead_info.sqlite'],
        ['mail', Central.APP_PATH+'/../database/mail.sqlite']
      ]),
      templates: new Map([
        ['index', 'templates/admin/guests/index'],
        ['read', 'templates/admin/guests/read'],
        ['edit', 'templates/admin/guests/read'],
      ]),
      database: 'lead',
      pagesize: 50,
    });
  }

  async action_index() {
   const instances = this.state.get('instances');
   const databases = this.state.get(ControllerMixinDatabase.DATABASES);
   await Promise.all(
     instances.map(async it => {
       const info = await ORM.factory(LeadInfo, it.id, {database: databases.get('lead_info')});
        Object.assign(it, info);
     })
   )

  }

  async action_send_email(){
    const {id} = this.state.get(Controller.STATE_PARAMS)
    const databases = this.state.get(ControllerMixinDatabase.DATABASES);
    const database = databases.get('lead');
    const instance = await ORM.factory(Lead, id, {database});
    const info = await ORM.factory(LeadInfo, id, {database: databases.get('lead_info')});

    Object.assign(instance, {...info});

    const helperRegister = new HelperRSVP(
      database,
      databases.get('mail'),
      this.state.get(Controller.STATE_CLIENT_IP),
      this.state.get(Controller.STATE_HOSTNAME)
    )

    await helperRegister.sendRSVP(instance, Central.config.edm);

    info.rsvp_code = "111.111.111";
    await info.write();

    await this.redirect(this.state.get(Controller.STATE_QUERY).cp || '/admin/rsvp/');
  }

}
