export const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export interface Env {
  APPLICATIONS: KVNamespace;
  LP_ACCESS_TOKEN?: string;
}
