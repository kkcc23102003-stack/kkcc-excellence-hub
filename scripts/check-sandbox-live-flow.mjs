import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { encode } from "@tanstack/router-core";
import { fromCrossJSON, toJSONAsync } from "seroval";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SANDBOX_BEARER = "kkcc-sandbox-preview-only";

async function findFreePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const { port } = address;
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
  return port;
}

function waitForReady(child, timeoutMs = 45_000) {
  return new Promise((resolve, reject) => {
    let output = "";
    let ready = false;
    const timeout = setTimeout(() => {
      if (!ready) reject(new Error(`Vite did not start in time.\n${output.slice(-6000)}`));
    }, timeoutMs);
    const append = (chunk) => {
      output = `${output}${chunk}`.slice(-12_000);
      if (!ready && /ready in\s+\d+/i.test(output)) {
        ready = true;
        clearTimeout(timeout);
        resolve(output);
      }
    };
    child.stdout.on("data", append);
    child.stderr.on("data", append);
    child.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once("exit", (code, signal) => {
      if (!ready) {
        clearTimeout(timeout);
        reject(new Error(`Vite exited before startup (${code ?? signal}).\n${output}`));
      }
    });
  });
}

function stop(child) {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve();
  return new Promise((resolve) => {
    child.once("exit", resolve);
    child.kill("SIGTERM");
    setTimeout(() => {
      if (child.exitCode === null && child.signalCode === null) child.kill("SIGKILL");
    }, 5_000).unref();
  });
}

async function run() {
  const port = await findFreePort();
  const base = `http://127.0.0.1:${port}`;
  const env = { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" };
  const disabledSupabaseKeys = [
    "SUPABASE_URL",
    "SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_ANON_KEY",
    "SUPABASE_PROJECT_ID",
    "SUPABASE_SERVICE_ROLE_KEY",
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
    "VITE_SUPABASE_ANON_KEY",
    "VITE_SUPABASE_PROJECT_ID",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "NEXT_PUBLIC_SUPABASE_PROJECT_ID",
  ];
  for (const key of new Set([
    ...Object.keys(env).filter((key) => /supabase/i.test(key)),
    ...disabledSupabaseKeys,
  ])) {
    // Empty process values also override Supabase settings loaded from a developer's .env file.
    env[key] = "";
  }

  const viteBin = path.join(ROOT, "node_modules", "vite", "bin", "vite.js");
  const child = spawn(
    process.execPath,
    [viteBin, "dev", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    { cwd: ROOT, env, stdio: ["ignore", "pipe", "pipe"] },
  );

  try {
    await waitForReady(child);

    const routePaths = [
      "/",
      "/courses",
      "/classes",
      "/test-series",
      "/study-material",
      "/results",
      "/support",
      "/faculty",
      "/downloads/",
      "/login",
      "/admin",
      "/admin/tests",
      "/admin/exam-bank",
      "/admin/offline-access",
      "/admin/payments",
      "/admin/ai-question-engine",
      "/dashboard/courses",
      "/test-series/learn/ppsc-pcs",
    ];
    for (const route of routePaths) {
      const response = await fetch(`${base}${route}`);
      assert.equal(response.status, 200, `${route} should serve in the local sandbox`);
    }

    const moduleCache = new Map();
    async function callServerFn(file, exportName, data) {
      let source = moduleCache.get(file);
      if (!source) {
        const moduleResponse = await fetch(`${base}/src/lib/${file}`);
        assert.equal(moduleResponse.status, 200, `Vite should compile ${file}`);
        source = await moduleResponse.text();
        moduleCache.set(file, source);
      }

      const start = source.indexOf(`export const ${exportName} =`);
      assert.notEqual(start, -1, `${exportName} should be exported from ${file}`);
      const next = source.indexOf("\nexport const ", start + 1);
      const segment = source.slice(start, next < 0 ? undefined : next);
      const functionId = segment.match(/createClientRpc\("([^"]+)"\)/)?.[1];
      assert.ok(functionId, `Vite should create an RPC endpoint for ${exportName}`);
      const method = segment.match(/createServerFn\(\{\s*method:\s*"(GET|POST)"/)?.[1] ?? "GET";
      const headers = {
        Authorization: `Bearer ${SANDBOX_BEARER}`,
        "x-tsr-serverFn": "true",
        Accept: "application/json, application/x-ndjson",
        Origin: base,
        Referer: `${base}/login`,
      };
      let url = `${base}/_serverFn/${functionId}`;
      const options = { headers };

      if (method === "GET" && data !== undefined) {
        const payload = JSON.stringify(await toJSONAsync({ data }));
        url += `?${encode({ payload })}`;
      } else if (method === "POST") {
        options.method = "POST";
        headers["content-type"] = "application/json";
        options.body = JSON.stringify(await toJSONAsync(data === undefined ? {} : { data }));
      }

      const response = await fetch(url, options);
      const text = await response.text();
      let decoded;
      try {
        decoded = fromCrossJSON(JSON.parse(text), { plugins: [] });
      } catch {
        throw new Error(`${exportName} returned HTTP ${response.status}: ${text.slice(0, 600)}`);
      }
      if (!response.ok || decoded.error) {
        throw new Error(`${exportName} failed: ${decoded.error?.message ?? text}`);
      }
      return decoded.result;
    }

    const grants = await callServerFn("test-access.functions.ts", "listMySeriesAccess");
    assert.ok(grants.some((grant) => grant.series_id === "ppsc-pcs"));

    const learningCases = [
      {
        kind: "topic",
        subject: "Punjab GK",
        chapter: "Punjab at a glance",
        topic: "Districts and Headquarters",
        questions: 20,
      },
      {
        kind: "chapter",
        subject: "Punjab GK",
        chapter: "Punjab at a glance",
        questions: 60,
      },
      { kind: "subject", subject: "Punjab GK", questions: 100 },
      { kind: "combined", questions: 200 },
    ];
    for (const testCase of learningCases) {
      const result = await callServerFn("test-access.functions.ts", "getSeriesLearningTest", {
        series_id: "ppsc-pcs",
        exam: "Punjab PCS",
        ...testCase,
      });
      assert.equal(result.questions.length, testCase.questions, `${testCase.kind} paper size`);
      assert.equal(
        new Set(result.questions.map((question) => question.question_text.trim().toLowerCase()))
          .size,
        testCase.questions,
        `${testCase.kind} paper should not contain duplicate stems`,
      );
    }

    const sampleId = "00000000-0000-4000-8000-000000000201";
    const sampleTest = await callServerFn("content.functions.ts", "getPublicTest", {
      id: sampleId,
    });
    assert.equal(
      sampleTest?.questions.length,
      20,
      "the sandbox's published sample test uses bank content",
    );
    const adminTests = await callServerFn("admin.functions.ts", "listAdminTests");
    const editableSample = adminTests.find((test) => test.id === sampleId);
    assert.ok(editableSample, "the sandbox admin should be able to edit its seeded test");
    const editedTitle = `${editableSample.title} — RPC smoke check`;
    const updatedSample = await callServerFn("admin.functions.ts", "saveTest", {
      ...editableSample,
      title: editedTitle,
    });
    assert.equal(updatedSample.title, editedTitle);
    const publicReadback = await callServerFn("content.functions.ts", "getPublicTest", {
      id: sampleId,
    });
    assert.equal(
      publicReadback.test.title,
      editedTitle,
      "public readback should reflect the admin edit",
    );
    assert.equal(
      publicReadback.questions.length,
      20,
      "editing the test recipe must keep its bank paper",
    );
    await callServerFn("admin.functions.ts", "saveTest", editableSample);

    const syllabus = {
      subjects: [
        {
          name: "Punjab GK",
          bank_subject: "Punjab GK",
          chapters: [
            {
              name: "Punjab at a glance",
              topics: [
                { name: "Districts and Headquarters", bank_topic: "Districts and Headquarters" },
              ],
            },
          ],
        },
      ],
    };
    const saveSyllabus = await callServerFn(
      "test-series-syllabus.functions.ts",
      "adminSaveSeriesSyllabus",
      { series_id: "ppsc-pcs", exam_track: "Punjab PCS", syllabus, status: "published" },
    );
    assert.equal(saveSyllabus.status, "published");
    const published = await callServerFn(
      "test-series-syllabus.functions.ts",
      "listPublishedSeriesSyllabi",
    );
    assert.equal(
      published.find((row) => row.series_id === "ppsc-pcs")?.syllabus.subjects.length,
      1,
    );
    await assert.rejects(
      callServerFn("test-series-syllabus.functions.ts", "adminSaveSeriesSyllabus", {
        series_id: "ppsc-pcs",
        exam_track: "Punjab PCS",
        syllabus: {
          subjects: [
            {
              ...syllabus.subjects[0],
              chapters: [
                {
                  ...syllabus.subjects[0].chapters[0],
                  topics: [{ name: "Unknown", bank_topic: "Not in the question bank" }],
                },
              ],
            },
          ],
        },
        status: "published",
      }),
      /exact question-bank topic/i,
    );

    const grantInput = {
      series_id: "ctet-sandbox-check",
      email: "sandbox-admin@preview.invalid",
      method: "Sandbox regression test",
      amount_inr: 0,
      note: "Local only",
      valid_days: 30,
    };
    const firstGrant = await callServerFn(
      "test-access.functions.ts",
      "adminGrantSeriesAccess",
      grantInput,
    );
    assert.equal(firstGrant.renewed, false);
    const renewedGrant = await callServerFn("test-access.functions.ts", "adminGrantSeriesAccess", {
      ...grantInput,
      valid_days: 60,
    });
    assert.equal(
      renewedGrant.renewed,
      true,
      "a second offline grant should renew the active access",
    );
    assert.ok(new Date(renewedGrant.expiresAt) > new Date(firstGrant.expiresAt));
    const afterGrant = await callServerFn("test-access.functions.ts", "listMySeriesAccess");
    assert.ok(afterGrant.some((grant) => grant.series_id === "ctet-sandbox-check"));
    const seriesGrants = await callServerFn("test-access.functions.ts", "adminListSeriesGrants");
    const demoGrant = seriesGrants.find((grant) => grant.series_id === "ctet-sandbox-check");
    assert.ok(demoGrant?.id);
    await callServerFn("test-access.functions.ts", "adminRevokeSeriesAccess", { id: demoGrant.id });
    const afterRevoke = await callServerFn("test-access.functions.ts", "listMySeriesAccess");
    assert.ok(!afterRevoke.some((grant) => grant.series_id === "ctet-sandbox-check"));

    const payments = "platform-settings.functions.ts";
    const savedPayment = await callServerFn(payments, "saveAdminPaymentSettings", {
      enabled: true,
      provider: "razorpay",
      mode: "test",
      razorpay_key_id: "rzp_test_sandbox_only",
      razorpay_key_secret: "sandbox-only-not-a-real-secret",
      razorpay_webhook_secret: "sandbox-only-not-a-real-webhook",
      offline_payment_instructions: "Sandbox test only — no payment provider is connected.",
    });
    assert.equal(savedPayment.enabled, true);
    assert.equal(savedPayment.secrets.razorpay_key_secret.configured, true);
    const publicPayment = await callServerFn(payments, "getPublicPaymentSettings");
    assert.equal(publicPayment.enabled, true, "sandbox public reads should reflect admin settings");
    await callServerFn(payments, "disconnectAdminRazorpay");
    const disconnectedPayment = await callServerFn(payments, "getAdminPaymentSettings");
    assert.equal(disconnectedPayment.enabled, false);
    assert.equal(disconnectedPayment.secrets.razorpay_key_secret.configured, false);

    const ai = "ai-question-engine.functions.ts";
    const defaults = await callServerFn(ai, "getAIQuestionEngineSettings");
    assert.equal(defaults.enabled, false, "AI must default off in the sandbox");
    const aiSettings = {
      enabled: true,
      model: "gemini-2.5-flash",
      dailyLimit: 30,
      minQuality: 85,
      autoPublish: false,
      googleSearch: true,
    };
    await callServerFn(ai, "saveAIQuestionEngineSettings", aiSettings);
    assert.equal((await callServerFn(ai, "getAIQuestionEngineSettings")).enabled, true);
    await callServerFn(ai, "saveAIQuestionEngineSettings", { ...aiSettings, enabled: false });
    assert.equal((await callServerFn(ai, "getAIQuestionEngineSettings")).enabled, false);

    console.log(
      "Live sandbox flow: public routes, bank-backed learning modes, seeded-test editing, syllabus publishing, offline grant/renew/revoke, Razorpay disconnect, and AI off/on/off: PASS",
    );
  } finally {
    await stop(child);
  }
}

await run();
