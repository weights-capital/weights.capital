import { json, type Env } from "./_lib";

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const raw = await ctx.request.text();
  if (raw.length > 32_000) return json({ error: "payload_too_large" }, 413);

  let body: any;
  try { body = JSON.parse(raw); } catch { return json({ error: "invalid_json" }, 400); }
  // Quietly absorb obvious bots without creating an application record.
  if (body?.website) return json({ ok: true, ref: "received" }, 202);
  if (!body?.repoUrl || typeof body.repoUrl !== "string") {
    return json({ error: "repoUrl_required" }, 400);
  }
  let repoUrl: URL;
  try { repoUrl = new URL(body.repoUrl); } catch { return json({ error: "repoUrl_invalid" }, 400); }
  if (repoUrl.protocol !== "https:" || repoUrl.username || repoUrl.password) {
    return json({ error: "repoUrl_must_be_https" }, 400);
  }

  const sourceIp = ctx.request.headers.get("CF-Connecting-IP") || "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(sourceIp));
  const ipKey = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  const rateKey = `rate/apply/${ipKey}`;
  if (await ctx.env.APPLICATIONS.get(rateKey)) return json({ error: "rate_limited" }, 429);
  await ctx.env.APPLICATIONS.put(rateKey, "1", { expirationTtl: 600 });

  const random = crypto.getRandomValues(new Uint8Array(4));
  const ref = `WC-2026-${Array.from(random, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
  const record = {
    ref,
    repoUrl: repoUrl.toString().slice(0, 500),
    email: String(body.email ?? "").slice(0, 200),
    moat: String(body.moat ?? "").slice(0, 4000),
    compute: String(body.compute ?? "").slice(0, 4000),
    parsed: body.parsed ?? null,
    status: "received",
    createdAt: new Date().toISOString(),
  };
  await ctx.env.APPLICATIONS.put(`apply/${ref}`, JSON.stringify(record));
  return json({ ok: true, ref });
};
