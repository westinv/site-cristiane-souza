import type { APIRoute } from 'astro';
import { encerrarSessao } from '../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ locals, cookies, redirect }) => {
  await encerrarSessao(locals.runtime.env.DB, cookies);
  return redirect('/login', 303);
};

export const GET: APIRoute = ({ redirect }) => redirect('/login');
