import type { APIRoute } from 'astro';
import { salvarNotas } from '../../../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ params, request, locals }) => {
  let notas: unknown;
  try {
    ({ notas } = (await request.json()) as { notas?: unknown });
  } catch {
    return new Response('JSON inválido', { status: 400 });
  }
  if (typeof notas !== 'string') return new Response('Campo "notas" ausente', { status: 400 });
  const ok = await salvarNotas(locals.runtime.env.DB, params.id!, notas);
  return ok ? new Response(null, { status: 204 }) : new Response('Cliente não encontrado', { status: 404 });
};
