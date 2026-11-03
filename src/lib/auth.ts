import type { AstroCookies } from 'astro';

const ITERACOES = 100_000;
export const COOKIE_SESSAO = 'sessao';
const DURACAO_SESSAO = 60 * 60 * 24 * 30;

const enc = new TextEncoder();

const hex = (buf: ArrayBuffer | Uint8Array) =>
  [...(buf instanceof Uint8Array ? buf : new Uint8Array(buf))].map((b) => b.toString(16).padStart(2, '0')).join('');

const deHex = (s: string) => new Uint8Array((s.match(/../g) ?? []).map((h) => parseInt(h, 16)));

async function pbkdf2(senha: string, salt: Uint8Array<ArrayBuffer>, iteracoes: number) {
  const chave = await crypto.subtle.importKey('raw', enc.encode(senha), 'PBKDF2', false, ['deriveBits']);
  return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iteracoes }, chave, 256);
}

function iguais(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let dif = 0;
  for (let i = 0; i < a.length; i++) dif |= a[i] ^ b[i];
  return dif === 0;
}

export async function gerarHashSenha(senha: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${ITERACOES}$${hex(salt)}$${hex(await pbkdf2(senha, salt, ITERACOES))}`;
}

export async function conferirSenha(senha: string, guardado: string) {
  const [alg, iter, salt, hash] = guardado.split('$');
  if (alg !== 'pbkdf2' || !iter || !salt || !hash) return false;
  const calculado = new Uint8Array(await pbkdf2(senha, deHex(salt), Number(iter)));
  return iguais(calculado, deHex(hash));
}

async function sha256(texto: string) {
  return hex(await crypto.subtle.digest('SHA-256', enc.encode(texto)));
}

const HASH_FALSO = 'pbkdf2$100000$00000000000000000000000000000000$' + '0'.repeat(64);

export async function autenticar(db: D1Database, email: string, senha: string) {
  const u = await db
    .prepare('SELECT id, email, nome, senha_hash FROM usuarios WHERE email = ?')
    .bind(email.trim())
    .first<{ id: string; email: string; nome: string; senha_hash: string }>();
  const ok = await conferirSenha(senha, u?.senha_hash ?? HASH_FALSO);
  return ok && u ? { id: u.id, email: u.email, nome: u.nome } : null;
}

export async function criarSessao(db: D1Database, cookies: AstroCookies, usuarioId: string, seguro: boolean) {
  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  const expira = Math.floor(Date.now() / 1000) + DURACAO_SESSAO;
  await db.batch([
    db.prepare('DELETE FROM sessoes WHERE expira_em < unixepoch()'),
    db.prepare('INSERT INTO sessoes (id, usuario_id, expira_em) VALUES (?, ?, ?)').bind(await sha256(token), usuarioId, expira),
  ]);
  cookies.set(COOKIE_SESSAO, token, {
    path: '/',
    httpOnly: true,
    secure: seguro,
    sameSite: 'lax',
    maxAge: DURACAO_SESSAO,
  });
}

export async function usuarioDaSessao(db: D1Database, cookies: AstroCookies) {
  const token = cookies.get(COOKIE_SESSAO)?.value;
  if (!token) return null;
  return db
    .prepare(
      `SELECT u.id, u.email, u.nome FROM sessoes s JOIN usuarios u ON u.id = s.usuario_id
       WHERE s.id = ? AND s.expira_em > unixepoch()`,
    )
    .bind(await sha256(token))
    .first<{ id: string; email: string; nome: string }>();
}

export async function encerrarSessao(db: D1Database, cookies: AstroCookies) {
  const token = cookies.get(COOKIE_SESSAO)?.value;
  if (token) await db.prepare('DELETE FROM sessoes WHERE id = ?').bind(await sha256(token)).run();
  cookies.delete(COOKIE_SESSAO, { path: '/' });
}
