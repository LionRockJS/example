# example-form

A minimal Cloudflare Workers application demonstrating HTML form handling with the [LionRockJS](https://lionrockjs.com) MVC framework, [Hono](https://hono.dev), and LiquidJS templating.

## What it does

The app renders a page with two HTML forms and processes their submissions:

| Route | Method | Description |
|---|---|---|
| `/` | GET | Display both form examples |
| `/submit` | POST | Process form data and echo submitted fields |
| `/pages/:slug` | GET | Dynamic page placeholder (empty) |

Form submissions support both encoding types:
- **`multipart/form-data`** — text fields + file uploads (files stored to Cloudflare R2)
- **`application/x-www-form-urlencoded`** — standard text-only form

## Architecture

```
server/Server.ts          ← Hono entry point; loads routes & renders controllers
application/
  bootstrap.mts           ← Registers app config (system.mts)
  import.mts              ← Loads LiquidJS adapter and form mixin modules
  routes.mts              ← Declares all URL routes via RouteList
  classes/controller/
    Home.ts               ← MVC controller: index, form_post, page actions
  config/
    system.mts            ← App-level config flags (debug, platform adapter)
views/
  index.ts                ← Registers all Liquid template files into Central
  layout/default.liquid   ← Base HTML shell (injects {{ main }})
  templates/
    home.liquid           ← Form page (both encoding examples)
    submit.liquid         ← Submission result (echoes all posted keys/values)
    page.liquid           ← Dynamic page (empty, ready to extend)
```

### Request lifecycle

1. Hono receives a request and matches it against registered routes.
2. The matching controller class is dynamically imported.
3. The controller is instantiated with the request context (params, headers, env).
4. `controller.execute(action)` runs the named action method.
5. The action sets a LiquidJS template + data via `ControllerMixinView.setTemplate`.
6. The rendered HTML is returned as the response.

## Key dependencies

| Package | Role |
|---|---|
| `hono` | Edge HTTP framework |
| `@lionrockjs/central` | Shared registry — config, modules, view files |
| `@lionrockjs/mvc` | Base `Controller` class and `ControllerState` |
| `@lionrockjs/router` | `RouteList` — declarative route registration |
| `@lionrockjs/adapter-view-liquidjs` | LiquidJS view rendering adapter |
| `@lionrockjs/mixin-form` | Multipart form parser; R2 file upload adapter |
| `wrangler` | Cloudflare Workers CLI — dev server and deployment |

## Infrastructure

- **Runtime**: Cloudflare Workers (ESModule, `nodejs_compat` flag)
- **File storage**: Cloudflare R2 bucket `lionrockjs-form-uploads` (bound as `FORM_UPLOADS`)
- **Observability**: Workers observability enabled, source maps uploaded

## Getting started

```bash
# Install dependencies
npm install

# Local development
npm run dev        # starts wrangler dev server

# Deploy to Cloudflare
npm run deploy
```

> **R2 setup**: Create the R2 bucket before deploying:
> ```bash
> wrangler r2 bucket create lionrockjs-form-uploads
> ```

## Adding a new route

1. Register the route in [`application/routes.mts`](application/routes.mts):
   ```ts
   RouteList.add('/my-path', 'controller/MyController', 'my_action');
   ```
2. Create `application/classes/controller/MyController.ts` extending `Controller`.
3. Add a corresponding `action_my_action()` method.
4. Create a LiquidJS template in `views/templates/` and register it in [`views/index.ts`](views/index.ts).

## Adding a controller mixin

Mixins are declared as a static array on the controller class:

```ts
static mixins = [ControllerMixinMultipartForm, ControllerMixinView];
```

Mixins run in order before and after the action method, injecting data into `this.state`.
