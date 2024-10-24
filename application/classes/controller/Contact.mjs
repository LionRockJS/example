import {Controller} from "@lionrockjs/central";
import {ControllerLead} from "@lionrockjs/mod-cold-leads";

export default class ControllerContact extends Controller{
  async action_post(){
    const request = this.state.get(Controller.STATE_REQUEST);
    const c = new ControllerLead(request, this.state);
    const configLead = c.state.get(ControllerLead.STATE_CONFIG);
    c.state.set(ControllerLead.STATE_CONFIG, Object.assign({}, configLead, {
      greetingHandler: async (lead) => {
        return {
          leadName: lead.name,
          edmTypeGreeting: 'contact',
          edmTypeGreetingSMS: 'contact_sms',
          edmTypeAdminNotification: 'contact_notification',
          greetingToken: {}
        }
      }
    }));
    return await c.execute('update');
  }
}