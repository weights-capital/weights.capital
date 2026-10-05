import { json, type Env } from "./_lib";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const token = ctx.request.headers.get("x-lp-token") ?? "";
  const expected = ctx.env.LP_ACCESS_TOKEN ?? "";
  if (!expected || token !== expected) return json({ error: "unauthorized" }, 401);

  const list = await ctx.env.APPLICATIONS.list({ prefix: "apply/" });
  const applications = await Promise.all(
    list.keys.map(async (k) => {
      const v = await ctx.env.APPLICATIONS.get(k.name);
      return v ? JSON.parse(v) : null;
    }),
  );
  return json({ applications: applications.filter(Boolean) });
};
