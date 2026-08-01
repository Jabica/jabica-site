import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const appRoot = new URL("../app/", import.meta.url);
const repoRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the portfolio shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Gabriel Jabour \| Tecnologia, automacao e operacao digital<\/title>/i,
  );
  assert.match(html, /Site biografico de Gabriel Jabour/);
  assert.match(html, /Gabriel Jabour/);
  assert.match(html, /00 \/ Perfil profissional/);
  assert.match(html, /Carreira construida dentro da operacao/);
  assert.match(html, /Projetos que mostram impacto alem do chamado/);
  assert.match(html, /Escolha o melhor canal para falar comigo/);
  assert.match(html, /contato@jabica\.com\.br/);
  assert.match(html, /http:\/\/wa\.me\/5548996437375/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/i);
  assert.doesNotMatch(html, /react-loading-skeleton|codex-preview/i);
});

test("keeps the starter preview removed from the app", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("page.tsx", appRoot), "utf8"),
    readFile(new URL("layout.tsx", appRoot), "utf8"),
    readFile(new URL("package.json", repoRoot), "utf8"),
  ]);

  assert.match(page, /const content = \{/);
  assert.match(page, /type Language = "pt" \| "en"/);
  assert.match(page, /jabica-language/);
  assert.match(page, /jabica-theme/);
  assert.match(page, /href="http:\/\/wa\.me\/5548996437375"/);
  assert.match(layout, /title:\s*"Gabriel Jabour \| Tecnologia, automacao e operacao digital"/);
  assert.doesNotMatch(page, /SkeletonPreview|react-loading-skeleton|codex-preview/);
  assert.doesNotMatch(layout, /codex-preview|_sites-preview|Starter Project/);
  assert.doesNotMatch(packageJson, /"react-loading-skeleton"/);

  await assert.rejects(access(new URL("_sites-preview", appRoot)));
});
