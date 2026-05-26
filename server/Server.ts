import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie';
import { RouteList } from '@lionrockjs/router';
import { Central } from '@lionrockjs/central';

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
    'SESSION_SECRET',
    'JWT session signing secret, at least 32 bytes. Set it with `wrangler secret put SESSION_SECRET` for deployed Workers, and put SESSION_SECRET=... in .dev.vars for local Wrangler dev.',
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
    requestHeaders: {
      host: c.req.header('host') ?? null,
      cfRay: c.req.header('cf-ray') ?? null,
      userAgent: c.req.header('user-agent') ?? null,
    },
  };
}

function isTruthyEnvFlag(value: any) {
  return value === true || value === '1' || value === 'true';
}

function isBindingDebugEnabled(c: any) {
  return isTruthyEnvFlag(c.env?.DEBUG_BINDINGS);
}

function wantsBindingDebug(c: any) {
  if (!isBindingDebugEnabled(c)) return false;

  return c.req.query('__debug_bindings') === '1' || c.req.header('x-lionrock-debug-bindings') === '1';
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
    `worker SESSION_SECRET: ${JSON.stringify(debug.workerEnv.requiredBindings.SESSION_SECRET)}`,
    `controller request env keys: ${debug.controllerRequestEnv.keys.length ? debug.controllerRequestEnv.keys.join(', ') : '(none)'}`,
    `controller request SESSION_SECRET: ${JSON.stringify(debug.controllerRequestEnv.requiredBindings.SESSION_SECRET)}`,
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
    const debugDetails = wantsBindingDebug(c) ? `\n\n${formatBindingDebug(debug)}` : '';

    return c.text(
      `Cloudflare Worker binding configuration is incomplete.\nMissing binding(s): ${missing.join(', ')}\n\n${details}${debugDetails}`,
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
      const result = await controller.execute(route.action, true);
      const controllerError = controller.error;

      if (controllerError) {
        const debug = buildBindingDebug(c, route, controller, controllerError);
        logBindingDebug(debug);

        if (wantsBindingDebug(c) || (isBindingDebugEnabled(c) && isSessionSecretError(controllerError))) {
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

      if (wantsBindingDebug(c) || (isBindingDebugEnabled(c) && isSessionSecretError(error))) {
        return c.text(formatBindingDebug(debug), 500);
      }

      throw error;
    }
  });
});

export default app;
