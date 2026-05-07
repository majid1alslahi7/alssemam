import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nextDir = path.join(rootDir, '.next');
const standaloneDir = path.join(nextDir, 'standalone');
const staticDir = path.join(nextDir, 'static');
const standaloneStaticDir = path.join(standaloneDir, '.next', 'static');

async function ensureFile(file) {
  const info = await stat(file).catch(() => null);
  if (!info?.isFile()) {
    throw new Error(`Required build file is missing: ${path.relative(rootDir, file)}`);
  }
}

async function ensureDirectory(dir) {
  const info = await stat(dir).catch(() => null);
  if (!info?.isDirectory()) {
    throw new Error(`Required build directory is missing: ${path.relative(rootDir, dir)}`);
  }
}

async function listFiles(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(fullPath, base));
    } else if (entry.isFile()) {
      files.push(path.relative(base, fullPath).replaceAll(path.sep, '/'));
    }
  }

  return files;
}

async function collectStaticReferences(dir) {
  if (!existsSync(dir)) return new Set();

  const files = await listFiles(dir);
  const refs = new Set();
  const readableExtensions = new Set(['.html', '.rsc', '.js', '.json']);
  const staticRefPattern = /\/_next\/static\/[^"'\\\s<>]+/g;

  for (const relativeFile of files) {
    if (!readableExtensions.has(path.extname(relativeFile))) continue;

    const content = await readFile(path.join(dir, relativeFile), 'utf8').catch(() => '');
    for (const match of content.matchAll(staticRefPattern)) {
      const ref = match[0].replace('/_next/static/', '').split(/[?#]/)[0];
      refs.add(decodeURIComponent(ref));
    }
  }

  return refs;
}

await ensureFile(path.join(nextDir, 'BUILD_ID'));
await ensureFile(path.join(standaloneDir, 'server.js'));
await ensureDirectory(staticDir);
await ensureDirectory(standaloneStaticDir);

const sourceFiles = await listFiles(staticDir);
const standaloneFiles = new Set(await listFiles(standaloneStaticDir));
const missingFromStandalone = sourceFiles.filter((file) => !standaloneFiles.has(file));

if (missingFromStandalone.length > 0) {
  throw new Error(
    `Standalone static copy is incomplete. Missing files:\n${missingFromStandalone.slice(0, 20).join('\n')}`
  );
}

const refs = await collectStaticReferences(path.join(nextDir, 'server', 'app'));
const staticFiles = new Set(sourceFiles);
const missingRefs = [...refs].filter((ref) => !staticFiles.has(ref));

if (missingRefs.length > 0) {
  throw new Error(
    `Build output references missing static assets:\n${missingRefs.slice(0, 20).join('\n')}`
  );
}

console.log(`Verified ${sourceFiles.length} static assets and ${refs.size} server references`);
