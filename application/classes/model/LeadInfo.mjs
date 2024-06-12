import { Model } from '@lionrockjs/central';

export default class LeadInfo extends Model{
  last_name = null;
  cc = null;
  rsvp_code = null;
  salutation = null;

  static joinTablePrefix = 'lead_info';
  static tableName = 'lead_infos';

  static fields = new Map([
    ["last_name", "String"],
    ["cc", "String"],
    ["rsvp_code", "String"],
    ["salutation", "String"]
  ]);
}
