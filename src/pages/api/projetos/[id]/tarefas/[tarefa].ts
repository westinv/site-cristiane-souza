import type { APIRoute } from 'astro';
import { moverTarefa } from '../../../../../lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ params, request, locals }) => {
  let col: unknown;
  try {
    ({ col } = (await request.json()) as { col?: unknown });
  } catch {
    return new Response('JSON inválido', { status: 400 });
  }
  if (col !== 0 && col !== 1 && col !== 2) return new Response('Coluna inválida', { status: 400 });
  const ok = await moverTarefa(locals.runtime.env.DB, params.tarefa!, params.id!, col);
  return ok ? new Response(null, { status: 204 }) : new Response('Tarefa não encontrada', { status: 404 });
};
