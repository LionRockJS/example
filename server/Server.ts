import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie';
import { RouteList } from '@lionrockjs/router';
import { Central, ControllerMixinDatabase } from '@lionrockjs/central';

import { ControllerMixinMultipartForm, MultipartParserR2 } from '@lionrockjs/mixin-form';
ControllerMixinMultipartForm.fileAdapter = MultipartParserR2;

await import('../application/import.mts'),
await import('../application/bootstrap.mts'),
await import('../application/routes.mts')

const views = await import('../views/index.ts');
views.default.forEach((value: any, key: string) => {
  Central.viewFiles.set(key, value);
});

const app = new Hono();

const requiredBindings = new Map([
  [
    'ADMIN_DB',
    'D1 database binding. Create a D1 database, update wrangler.jsonc with its database_id, and keep the binding name ADMIN_DB.',
  ],
  [
    'FORM_UPLOADS',
    'R2 bucket binding. Create the lionrockjs-form-uploads bucket or bind an existing bucket as FORM_UPLOADS.',
  ],
  [
    'SESSION_SECRET',
    'JWT session signing secret. Set it with `wrangler secret put SESSION_SECRET` for deployed Workers, and put SESSION_SECRET=... in .dev.vars for local Wrangler dev.',
  ],
]);

function describeBinding(env: Record<string, any>, binding: string) {
  const value = env?.[binding];

  return {
    present: value !== undefined && value !== null,
    type: value === null ? 'null' : typeof value,
    constructor: value?.constructor?.name ?? null,
    hasD1Prepare: typeof value?.prepare === 'function',
    hasD1Exec: typeof value?.exec === 'function',
    hasR2Put: typeof value?.put === 'function',
  };
}

function getEnvKeys(env: Record<string, any>) {
  try {
    return Object.keys(env ?? {}).sort();
  } catch (e) {
    return [`Unable to enumerate env keys: ${(e as Error).message}`];
  }
}

function buildBindingDebug(c: any, route: any = null, controller: any = null, error: any = null) {
  const env = c.env ?? {};
  const controllerRequest = controller?.state?.get?.('request');
  const controllerEnv = controllerRequest?.env ?? {};
  const databaseMap = controller?.state?.get?.(ControllerMixinDatabase.DATABASE_MAP);

  return {
    timestamp: new Date().toISOString(),
    method: c.req.method,
    url: c.req.url,
    route: route ? {
      method: route.method,
      path: route.path,
      controller: route.controller,
      action: route.action,
    } : null,
    error: error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : null,
    workerEnv: {
      hasEnv: !!c.env,
      keys: getEnvKeys(env),
      requiredBindings: Object.fromEntries(
        Array.from(requiredBindings.keys()).map(binding => [binding, describeBinding(env, binding)])
      ),
    },
    controllerRequestEnv: {
      keys: getEnvKeys(controllerEnv),
      requiredBindings: Object.fromEntries(
        Array.from(requiredBindings.keys()).map(binding => [binding, describeBinding(controllerEnv, binding)])
      ),
    },
    controllerDatabaseMap: databaseMap instanceof Map
      ? Array.from(databaseMap.entries()).map(([name, datasource]) => ({
        name,
        datasource: describeDatasource(datasource),
      }))
      : null,
    requestHeaders: {
      host: c.req.header('host') ?? null,
      cfRay: c.req.header('cf-ray') ?? null,
      userAgent: c.req.header('user-agent') ?? null,
    },
  };
}

function describeDatasource(datasource: any) {
  if (typeof datasource === 'string') {
    return {
      type: 'binding-name',
      value: datasource,
    };
  }

  return {
    type: datasource === null ? 'null' : typeof datasource,
    constructor: datasource?.constructor?.name ?? null,
    hasD1Prepare: typeof datasource?.prepare === 'function',
    hasD1Exec: typeof datasource?.exec === 'function',
  };
}

function hydrateDatabaseMapBindings(controller: any, env: Record<string, any>) {
  const databaseMap = controller?.state?.get?.(ControllerMixinDatabase.DATABASE_MAP);
  if (!(databaseMap instanceof Map)) return [];

  const hydrated: Array<{ name: string, binding: string }> = [];
  databaseMap.forEach((datasource, name) => {
    if (typeof datasource !== 'string') return;
    const binding = env?.[datasource];
    if (!binding) return;

    databaseMap.set(name, binding);
    hydrated.push({ name, binding: datasource });
  });

  return hydrated;
}

function wantsBindingDebug(c: any) {
  return c.req.query('__debug_bindings') === '1' || c.req.header('x-lionrock-debug-bindings') === '1';
}

function isBindingError(error: any) {
  return /D1 database binding not found/i.test(error?.message ?? '');
}

function isSessionSecretError(error: any) {
  return /SESSION_SECRET|secretOrPrivateKey must have a value/i.test(error?.message ?? '');
}

function formatBindingDebug(debug: any) {
  return [
    'LionRockJS Worker binding debug',
    `time: ${debug.timestamp}`,
    `url: ${debug.method} ${debug.url}`,
    `route: ${debug.route ? `${debug.route.method} ${debug.route.path} -> ${debug.route.controller}.${debug.route.action}` : 'n/a'}`,
    `error: ${debug.error ? `${debug.error.name}: ${debug.error.message}` : 'n/a'}`,
    `worker env keys: ${debug.workerEnv.keys.length ? debug.workerEnv.keys.join(', ') : '(none)'}`,
    `worker ADMIN_DB: ${JSON.stringify(debug.workerEnv.requiredBindings.ADMIN_DB)}`,
    `worker FORM_UPLOADS: ${JSON.stringify(debug.workerEnv.requiredBindings.FORM_UPLOADS)}`,
    `worker SESSION_SECRET: ${JSON.stringify(debug.workerEnv.requiredBindings.SESSION_SECRET)}`,
    `controller request env keys: ${debug.controllerRequestEnv.keys.length ? debug.controllerRequestEnv.keys.join(', ') : '(none)'}`,
    `controller request ADMIN_DB: ${JSON.stringify(debug.controllerRequestEnv.requiredBindings.ADMIN_DB)}`,
    `controller request FORM_UPLOADS: ${JSON.stringify(debug.controllerRequestEnv.requiredBindings.FORM_UPLOADS)}`,
    `controller request SESSION_SECRET: ${JSON.stringify(debug.controllerRequestEnv.requiredBindings.SESSION_SECRET)}`,
    `controller database map: ${JSON.stringify(debug.controllerDatabaseMap)}`,
    `cf-ray: ${debug.requestHeaders.cfRay ?? 'n/a'}`,
  ].join('\n');
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function logBindingDebug(debug: any) {
  console.error('[lionrockjs-worker-binding-debug]', JSON.stringify(debug, null, 2));
}

app.use('*', async (c, next) => {
  const env = c.env ?? {};
  const missing = Array.from(requiredBindings.keys()).filter(binding => !env[binding]);

  if (missing.length > 0) {
    const debug = buildBindingDebug(c);
    logBindingDebug(debug);

    const details = missing
      .map(binding => `${binding}: ${requiredBindings.get(binding)}`)
      .join('\n');

    return c.text(
      `Cloudflare Worker binding configuration is incomplete.\nMissing binding(s): ${missing.join(', ')}\n\n${details}\n\n${formatBindingDebug(debug)}`,
      500
    );
  }

  if (wantsBindingDebug(c)) {
    const debug = buildBindingDebug(c);
    logBindingDebug(debug);
  }

  await next();
});

const routes = Array.from(RouteList.routeMap.values());
routes.forEach((route: any) => {
  app.on(route.method, route.path, async c => {
    try {
      console.log(route.controller);
      let Controller;
      try {
        Controller = (await import(`../application/classes/${route.controller}.ts`)).default;
      } catch (e) {
        Controller = Central.resolveController(route.controller);
        if (!Controller) throw e;
      }
      const controller = new Controller(
        {...c.req,
          params: c.req.param(),
          query: c.req.query(),
          headers: c.req.header(),
          cookies: getCookie(c),
          env: c.env,
        }
      );
      const hydratedBindings = hydrateDatabaseMapBindings(controller, c.env ?? {});
      if (hydratedBindings.length > 0 && wantsBindingDebug(c)) {
        console.log('[lionrockjs-worker-binding-debug] hydrated database map', JSON.stringify(hydratedBindings));
      }

      const result = await controller.execute(route.action, true);
      const controllerError = controller.error;

      if (controllerError) {
        const debug = buildBindingDebug(c, route, controller, controllerError);
        logBindingDebug(debug);

        if (isBindingError(controllerError) || isSessionSecretError(controllerError) || wantsBindingDebug(c)) {
          result.body += `\n<pre>${escapeHtml(formatBindingDebug(debug))}</pre>`;
        }
      }

      controller.state.clear();

      Object.entries(result.headers).forEach(([key, value]) => c.header(key, String(value)));
      result.cookies.forEach(cookie => setCookie(c, cookie.name, cookie.value, cookie.options));
      return c.html(result.body, result.status as any);
    } catch (error) {
      const debug = buildBindingDebug(c, route, null, error);
      logBindingDebug(debug);

      if (wantsBindingDebug(c) || isBindingError(error) || isSessionSecretError(error)) {
        return c.text(formatBindingDebug(debug), 500);
      }

      throw error;
    }
  });
});

export default app;
