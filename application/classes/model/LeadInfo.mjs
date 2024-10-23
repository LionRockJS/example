import { Model } from '@lionrockjs/central';

export default class LeadInfo extends Model{
  last_name = null;
  attending = null;
  diet = null;
  diet_other = null;

  static joinTablePrefix = 'lead_info';
  static tableName = 'lead_infos';

  static fields = new Map([
    ["last_name", "String"],
    ["attending", "String"],
    ["diet", "String"],
    ["diet_other", "String"]
  ]);
}
