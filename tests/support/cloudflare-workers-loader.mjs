import { register } from "node:module";

// Node's ESM loader rejects the `cloudflare:` scheme. The built worker imports
// `cloudflare:workers` (namespace import, read only via Reflect.get(..., "tracing")).
// This registers a resolve hook that swaps that specifier for a stub module.
// The stub exports `tracing = undefined` and throws for every other surface so
// the test process never receives real Cloudflare bindings.

const stubSource = `
// Bindings-free stand-in for the cloudflare:workers built-in. Do not add real bindings.
export const tracing = undefined;

function unavailable() {
  throw new Error(
    "Cloudflare bindings are unavailable during Node test rendering.",
  );
}

const inaccessible = new Proxy({}, {
  get: unavailable,
  has: unavailable,
  ownKeys: unavailable,
  getOwnPropertyDescriptor: unavailable,
});

export const env = inaccessible;
export const exports = inaccessible;
export const cache = inaccessible;

export function waitUntil() {
  throw new Error(
    "Cloudflare waitUntil is unavailable during Node test rendering.",
  );
}
export function withEnv() {
  unavailable();
}
export function withExports() {
  unavailable();
}
export function withEnvAndExports() {
  unavailable();
}

export class WorkerEntrypoint {
  constructor() {
    unavailable();
  }
}
export class DurableObject {
  constructor() {
    unavailable();
  }
}
export class RpcTarget {
  constructor() {
    unavailable();
  }
}
export class WorkflowEntrypoint {
  constructor() {
    unavailable();
  }
}
`;

const stubUrl = `data:text/javascript,${encodeURIComponent(stubSource)}`;

const hookSource = `
export async function resolve(specifier, context, nextResolve) {
  if (specifier === "cloudflare:workers") {
    return { shortCircuit: true, url: ${JSON.stringify(stubUrl)} };
  }
  return nextResolve(specifier, context);
}
`;

let registered = false;

/** Install the cloudflare:workers resolve hook. Safe to call more than once. */
export function registerCloudflareWorkersLoader() {
  if (registered) return;
  registered = true;
  register(`data:text/javascript,${encodeURIComponent(hookSource)}`);
}
