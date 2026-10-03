#!/usr/bin/env node

/**
 * پاک‌کنندهٔ چندسکویی (جایگزین rimraf).
 * استفاده: node ../../scripts/clean.mjs dist .next
 */

import { rmSync } from 'node:fs';
import { resolve } from 'node:path';

const targets = process.argv.slice(2);

if (targets.length === 0) {
  console.log('clean: هیچ مسیری داده نشد.');
  process.exit(0);
}

for (const target of targets) {
  const path = resolve(process.cwd(), target);

  rmSync(path, { recursive: true, force: true });

  console.log(`clean: ${target}`);
}
