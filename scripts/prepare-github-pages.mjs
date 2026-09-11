import { access, rename, rm, rmdir } from 'node:fs/promises';
import path from 'node:path';

const rawPrefix = process.env.PAGES_BASE_PATH ?? '';
const prefix = rawPrefix.replace(/^\/+|\/+$/g, '');

if (!prefix) {
  console.log('GitHub Pages asset relocation skipped (root deployment).');
  process.exit(0);
}

if (prefix.includes('/') || prefix === '.' || prefix === '..') {
  throw new Error(`PAGES_BASE_PATH must contain one safe repository-name segment; received ${rawPrefix}.`);
}

const clientRoot = path.resolve('dist/client');
const prefixedRoot = path.join(clientRoot, prefix);
const source = path.join(prefixedRoot, '_next');
const destination = path.join(clientRoot, '_next');

await access(source);
await rm(destination, { recursive: true, force: true });
await rename(source, destination);
await rmdir(prefixedRoot);

console.log(`Prepared static assets for deployment at /${prefix}/.`);
