# LionRockJS Cloudflare Worker example

This example runs on Cloudflare Workers and uses these bindings:

- `ADMIN_DB`: Cloudflare D1 database for admin/auth data
- `FORM_UPLOADS`: Cloudflare R2 bucket for uploaded files
- `SESSION_SECRET`: HMAC secret for JWT sessions

Local `npm run dev` can use Wrangler's local D1 state. A deployed Worker cannot read that local database; it must have a production D1 binding named exactly `ADMIN_DB`.

For a fresh local database, run:

```bash
npm run d1:init:local
```

## Cloudflare deploy checklist

Run these commands from `release/example`.

1. Install dependencies.

```bash
npm install
```

2. Create the remote D1 database and copy the generated `database_id` into `wrangler.jsonc`.

```bash
npm run d1:create
```

Keep the binding name as `ADMIN_DB`.

3. Create the R2 bucket, unless you already have one and update `wrangler.jsonc` to use it.

```bash
npm run r2:create
```

4. Initialize the remote D1 schema and seed login data.

```bash
npm run d1:init:remote
```

5. Set the JWT session secret for the deployed Worker. Use at least 32 random bytes.

```bash
openssl rand -base64 32
wrangler secret put SESSION_SECRET
```

For local `wrangler dev`, put the same key in `.dev.vars`:

```text
SESSION_SECRET=replace-with-a-long-random-value
```

6. Deploy the Worker.

```bash
npm run deploy
```

If you import this monorepo through Cloudflare Workers Builds, set the build root directory to `release/example`, keep the Worker name as `example-admin`, and use the deploy command `npm run deploy`. If you deploy from the Cloudflare dashboard without Wrangler, add the same bindings manually in the Worker settings: D1 binding `ADMIN_DB`, R2 binding `FORM_UPLOADS`, and secret `SESSION_SECRET`.

## Binding debug

When a controller error happens, the Worker logs safe binding diagnostics to Cloudflare logs with the prefix `[lionrockjs-worker-binding-debug]`. It prints binding names and object capabilities, never binding values.

HTTP responses do not include these diagnostics unless you explicitly enable them with `DEBUG_BINDINGS=1`. To force the same diagnostics for a request while that flag is enabled, add this query string:

```text
?__debug_bindings=1
```

For the specific `D1 database binding not found: ADMIN_DB` error, the page appends a `<pre>` block showing whether `ADMIN_DB` exists in `c.env` and whether it was passed into the LionRockJS controller request only when `DEBUG_BINDINGS=1` is set.

## Session security

This branch uses `@lionrockjs/adapter-session-jwt` for sessions. It signs compact JWTs with Web Crypto HMAC, accepts only the configured algorithm (`HS256` by default), requires `exp`, validates `iss` and `aud`, and stores tokens in `HttpOnly`, `Secure`, `SameSite=Strict` `__Host-` cookies.

The access-token cookie lasts 15 minutes. The refresh-token cookie lasts 7 days and is rotated whenever it is used to mint a new access token.

To rotate a compromised or old secret without logging everyone out immediately:

```text
SESSION_SECRET=<new-random-secret>
SESSION_SECRET_PREVIOUS=<old-random-secret>
```

Deploy with both values, wait longer than the session TTL, then remove `SESSION_SECRET_PREVIOUS`.

JWT sessions are stateless, so logout cannot revoke an already issued token before `exp`. For a higher-risk admin deployment, prefer a D1-backed session or store a `jti` or session version in D1 and check it on each request. Also add per-form CSRF tokens for destructive POST actions; `SameSite=Strict` helps, but it should not be the only CSRF control for admin workflows.

## Password Hashes On Workers

Cloudflare Workers can return Error 1102 when pure JavaScript password hashing exceeds CPU or memory limits. This example uses a local Worker-safe password identifier at `application/classes/identifier/Password.ts`, backed by WebCrypto PBKDF2.

Deploy this code, then reset any existing account that still has an old `$argon2id$...` hash.

For local Wrangler/D1 dev:

```bash
npm run d1:password:local -- root "new-password"
```

For the deployed Worker:

```bash
npm run d1:password:remote -- root "new-password"
```

The reset script loads `.dev.vars` and `.env` when present. The generated hash includes `AUTH_SALT` when that variable is configured. If the deployed Worker has `AUTH_SALT` set outside those files, run the reset command with the same local value:

```bash
AUTH_SALT="same-worker-value" npm run d1:password:remote -- root "new-password"
```

`PASSWORD_PBKDF2_ITERATIONS` is optional and controls the cost for newly generated hashes; the default is `20000`.

Then log in with that new password.

## Framework notes

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
