import guests from './guest.mjs';

const leadInfos = guests.map((x, i) => ({
  id: 1000+i,
  order_number: x[0],
  shipping: x[3],
  city: x[4],
  quantity: x[5],
}));

export default new Map([
  ['LeadInfos', [
    {id:1, order_number:"#00A", shipping: "Home", city: 'HK', quantity: "1"},
    {id:2, order_number:"#00B", shipping: "Space Ship", city: 'TW', quantity: "2"},
    {id:3, order_number:"#00C", shipping: "Moon", city: 'KT', quantity: "3"},
    ...leadInfos,
  ]],
]);