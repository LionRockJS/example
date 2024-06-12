import guests from './guest.mjs';

const leads = guests.map((x, i) => ({
  id: 1000+i,
  language: "zh-hant",
  name: x[1],
  contact_type: 'email',
  contact: x[2],
}));

export default new Map([
  ['LeadStates', [
    {id: 1, name: 'pending'},
    {id: 2, name: 'reject'},
    {id: 3, name: 'active'},
    {id: 4, name: 'suspend'},
  ]],
  ['LeadTypes', [
    {id: 1, name: 'guest'},
  ]],
  ['Leads', [
    {id:1, language:"zh-hant", name: "開始", contact_type: 'email', contact: "start@example.com"},
    {id:2, language:"zh-hans", name: "开始", contact_type: 'email',contact: "alice@example.com"},
    {id:3, language:"en", name: "Bob", contact_type: 'email', contact: "bob@example"},
    ...leads,
  ]],
]);