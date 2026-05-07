import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nextDir = path.join(rootDir, '.next');

await rm(nextDir, { recursive: true, force: true });

console.log('Removed stale .next build output');
