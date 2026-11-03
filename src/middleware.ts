import { defineMiddleware } from 'astro:middleware';
import { usuarioDaSessao } from './lib/auth';

const protegida = (p: string) => p === '/app' || p.startsWith('/app/') || p.startsWith('/api/');

export const onRequest = defineMiddleware(async (ctx, next) => {
  const p = ctx.url.pathname;
  if (!protegida(p) && p !== '/login') return next();

  const db = ctx.locals.runtime?.env?.DB;
  if (!db) return new Response('Banco de dados indisponível (binding DB ausente).', { status: 500 });

  const usuario = await usuarioDaSessao(db, ctx.cookies);

  if (p === '/login') return usuario ? ctx.redirect('/app') : next();

  if (!usuario) {
    if (p.startsWith('/api/')) return new Response('Não autenticado', { status: 401 });
    return ctx.redirect('/login');
  }
  ctx.locals.usuario = usuario;
  const res = await next();
  res.headers.set('Cache-Control', 'private, no-store');
  return res;
});
