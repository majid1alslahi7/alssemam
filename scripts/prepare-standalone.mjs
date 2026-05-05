import { cp, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nextDir = path.join(rootDir, '.next');
const standaloneDir = path.join(nextDir, 'standalone');

async function ensureDirectory(dir) {
  const info = await stat(dir).catch(() => null);
  if (!info?.isDirectory()) {
    throw new Error(`Required directory is missing: ${path.relative(rootDir, dir)}`);
  }
}

async function copyIfExists(from, to) {
  if (!existsSync(from)) return false;

  await mkdir(path.dirname(to), { recursive: true });
  await cp(from, to, { recursive: true, force: true });
  return true;
}

await ensureDirectory(standaloneDir);
await ensureDirectory(path.join(nextDir, 'static'));

const copiedPublic = await copyIfExists(path.join(rootDir, 'public'), path.join(standaloneDir, 'public'));
const copiedStatic = await copyIfExists(path.join(nextDir, 'static'), path.join(standaloneDir, '.next', 'static'));

if (!copiedPublic || !copiedStatic) {
  throw new Error('Standalone package is incomplete; public or .next/static was not copied.');
}

console.log('Standalone assets prepared in .next/standalone');
