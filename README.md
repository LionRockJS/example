LionRockJS is a MVC framework inspired by Kohana PHP Framework, CodeIgniter and Laravel.

It's designed to use adapters to adopt different frameworks. 

For example, using Database Adapter allows you to use same ORM model for Better-SQLite3, SQLite3 (in development), MySQL / MySQL2 (in development)

---

Switch branches to view different examples for Fastify, Express, and the Node.js HTTP module.

start development server:
``node server/development.js``

start production server:
``node server/production.js``


1. add additional config file in application/bootstrap.mjs
2. import additional module and setup default adapters in application/import.mjs
3. setup routes in application/routes.mjs

---

features:

- rewrite in ESM and typing using JSDoc

- class file override by Cascading Filesystem
  - using ORM.import, models in @lionrockjs/mod-* can be override by using mjs file in application/classes/model.

- controller.before and controller.after
  - method for before and after actions.

- controller mixin
  - extend controller through multiple mixin, rather than complex inherit parent classes
 
- Central.config
  - similar to Cascading Filesystem, config can be override from application/config folder.

- ORM and Model
  - ORM static method to manipulate create / read Model
  - ORM static methods to read, count, update, delete Models applies to "ALL", "BY" key and values, or "WITH" criteria
  - Model can CRUD with eagerLoad function
  - Model eagerLoad use "with" object:
````
student.eagerLoad{
  with: ["School", "Teacher"],
  school: {with: ["Location"]}
);
 ````
  - Fast and secure ORM Model by explict declare fields, belongsTo and hasMany related tables.
  - ORMInput and ORMWrite mixin allow form data directly edit model database
    - example: html form name ":name" can edit model.name field

- Router

- warm reloading (in between Hot and Cold reloading)
  - application/controller and views changes can reflect immediately without restart server
