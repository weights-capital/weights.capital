import { json, type Env } from "./_lib";

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const list = await ctx.env.APPLICATIONS.list({ prefix: "apply/" });
  return json({ total: list.keys.length });
};
