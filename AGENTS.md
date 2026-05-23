#AGENTS.md

This is a **Cloudflare Workers** application built with the **LionRockJS MVC** framework, **Hono**, and **LiquidJS** templating. Use these conventions for all code changes and additions.

---

## Stack

- **Runtime**: Cloudflare Workers (ESModule, `nodejs_compat`)
- **HTTP framework**: [Hono](https://hono.dev)
- **MVC framework**: LionRockJS (`@lionrockjs/central`, `@lionrockjs/mvc`, `@lionrockjs/router`)
- **Templating**: LiquidJS via `@lionrockjs/adapter-view-liquidjs`
- **Form handling**: `@lionrockjs/mixin-form` with `MultipartParserR2` for file uploads
- **File storage**: Cloudflare R2 (binding: `FORM_UPLOADS`)
- **Language**: TypeScript (ESNext, `allowImportingTsExtensions`, `noEmit`)
- **Package manager**: npm

---

## Project conventions

### File extensions
- Application source: `.ts` (controllers, views index) and `.mts` (bootstrap, import, routes, config)
- Templates: `.liquid`

### Module style
All files use **ESM** (`import`/`export`). No CommonJS.

### Controllers
- Live in `application/classes/controller/`
- Extend `Controller` from `@lionrockjs/mvc`
- Declare mixins as a static array: `static mixins = [ControllerMixinMultipartForm, ControllerMixinView]`
- Action methods are named `action_<name>()` and are `async`
- Access request data via `this.state.get(ControllerState.REQUEST)` etc.
- Set view output with `ControllerMixinView.setTemplate(this.state, 'templates/name', { ...data })`
- To return a raw body without a view: `this.state.set(ControllerState.BODY, '')`

### Routes
- Registered in `application/routes.mts` using `RouteList.add(path, controller, action?, method?)`
- Default method is `GET`; pass `'POST'` as the 4th argument for POST routes
- Controller path is relative to `application/classes/` (e.g. `'controller/Home'`)

### Views
- All Liquid templates live in `views/`
- Every template **must** be registered in `views/index.ts` as an entry in the exported `Map`
- Layout template: `views/layout/default.liquid` — injects `{{ main }}`
- Templates go in `views/templates/`

### Config & modules
- App config added in `application/bootstrap.mts` via `Central.addConfig()`
- Modules (adapters, mixins) loaded in `application/import.mts` via `Central.addModules()`

### Entry point
`server/Server.ts` — do not move. Referenced by `wrangler.jsonc` as `"main"`.

---

## Adding a new page / feature

1. **Route**: Add to `application/routes.mts`
   ```ts
   RouteList.add('/my-path', 'controller/MyController', 'my_action');
   ```

2. **Controller**: Create `application/classes/controller/MyController.ts`
   ```ts
   import { Controller, ControllerState } from '@lionrockjs/mvc';
   import { ControllerMixinView } from '@lionrockjs/central';

   export default class ControllerMyController extends Controller {
     static mixins = [ControllerMixinView];

     async action_my_action() {
       ControllerMixinView.setTemplate(this.state, 'templates/my-template', { /* data */ });
     }
   }
   ```

3. **Template**: Create `views/templates/my-template.liquid`

4. **Register template**: Add entry to the `Map` in `views/index.ts`
   ```ts
   ['templates/my-template', {
     package: packageJson.name,
     payload: await import('./templates/my-template.liquid'),
   }],
   ```

---

## Form handling

- Use `ControllerMixinMultipartForm` in the controller's `mixins` array
- Read parsed form data: `this.state.get(ControllerMixinMultipartForm.POST_DATA)`
- File uploads are automatically stored in the R2 bucket bound as `FORM_UPLOADS`
- The file parser adapter is set globally in `server/Server.ts`:
  ```ts
  ControllerMixinMultipartForm.fileAdapter = MultipartParserR2;
  ```

---

## Infrastructure

- R2 bucket binding: `FORM_UPLOADS` → bucket `lionrockjs-form-uploads`
- Create the bucket before first deploy: `wrangler r2 bucket create lionrockjs-form-uploads`
- Wrangler config: `wrangler.jsonc`
- TypeScript config: `tsconfig.json` (noEmit — Wrangler handles bundling)

---

## Dev commands

```bash
npm run dev       # local dev via wrangler
npm run deploy    # deploy to Cloudflare Workers
npm test          # run vitest (Cloudflare vitest pool)
npm run cf-typegen  # regenerate Workers type bindings
```
