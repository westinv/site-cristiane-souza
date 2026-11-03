/// <reference types="astro/client" />

type D1Database = import('@cloudflare/workers-types').D1Database;
type D1PreparedStatement = import('@cloudflare/workers-types').D1PreparedStatement;

interface Env {
  DB: D1Database;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {
    usuario?: { id: string; email: string; nome: string };
  }
}
