#!/usr/bin/env node
import { webcrypto as crypto, randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline';
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ITERACOES = 100_000;
const BANCO = 'cristiane-db';

const args = process.argv.slice(2);
const destino = args.includes('--remote') ? '--remote' : args.includes('--local') ? '--local' : null;
const [email, nome] = args.filter((a) => !a.startsWith('--'));

if (!email || !nome || !destino) {
  console.error('Uso: npm run usuario:criar -- <email> "<nome>" --local|--remote');
  process.exit(1);
}

function perguntarSenha(pergunta) {
  if (process.env.SENHA) return Promise.resolve(process.env.SENHA);
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => {
      if (s.includes(pergunta)) rl.output.write(s);
    };
    rl.question(pergunta, (resp) => {
      rl.close();
      process.stdout.write('\n');
      resolve(resp);
    });
  });
}

const hex = (buf) => Buffer.from(buf).toString('hex');

async function gerarHash(senha) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const chave = await crypto.subtle.importKey('raw', new TextEncoder().encode(senha), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERACOES }, chave, 256);
  return `pbkdf2$${ITERACOES}$${hex(salt)}$${hex(bits)}`;
}

const sql = (s) => `'${String(s).replace(/'/g, "''")}'`;

const senha = await perguntarSenha('Senha (mín. 8 caracteres): ');
if (senha.length < 8) {
  console.error('Senha muito curta.');
  process.exit(1);
}
const hash = await gerarHash(senha);

const comando =
  `INSERT INTO usuarios (id, email, nome, senha_hash) VALUES (${sql(randomUUID())}, ${sql(email.trim())}, ${sql(nome)}, ${sql(hash)}) ` +
  `ON CONFLICT(email) DO UPDATE SET nome = excluded.nome, senha_hash = excluded.senha_hash;`;

const dir = mkdtempSync(join(tmpdir(), 'usuario-'));
const arquivo = join(dir, 'usuario.sql');
writeFileSync(arquivo, comando);
try {
  const r = spawnSync('npx', ['wrangler', 'd1', 'execute', BANCO, destino, '--file', arquivo, '--yes'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
  console.log(`Usuário ${email} pronto (${destino.slice(2)}).`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
