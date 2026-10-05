'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const index = read('index.html');
const serviceWorker = read('sw.js');
const metaScript = read('app-meta.js');
const metaJson = JSON.parse(read('app-meta.json'));
const workflow = read('.github/workflows/v14-upgrade.yml');
const development = read('DEVELOPMENT.md');
const history = read('IMPLEMENTATION_HISTORY_v1.4beta.md');

function metaScriptField(name) {
  const match = metaScript.match(new RegExp(`${name}:\\s*'([^']+)'`));
  assert.ok(match, `app-meta.js must define ${name}`);
  return match[1];
}

for (const field of ['version', 'build', 'cacheVersion', 'releasedAtJst']) {
  assert.equal(
    metaScriptField(field),
    metaJson[field],
    `app-meta.js and app-meta.json must agree on ${field}`
  );
}

assert.equal(metaJson.environment, 'DEVELOP');
assert.match(metaJson.build, /^\d{8}-\d{2}$/);
assert.match(metaJson.releasedAtJst, /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2} JST$/);
assert.ok(
  metaJson.cacheVersion.includes(metaJson.build.slice(0, 8)),
  'cache version must include the Build date'
);
assert.ok(
  metaScript.includes("path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION'"),
  'environment detection must remain explicit'
);

const swCache = serviceWorker.match(/const CACHE = '([^']+)'/)?.[1];
assert.equal(swCache, metaJson.cacheVersion, 'Service Worker cache and app metadata must match');

const localAsset = value => {
  const clean = String(value || '').split(/[?#]/)[0];
  if (!clean || /^(?:https?:)?\/\//i.test(clean) || clean.startsWith('data:')) return '';
  return clean.replace(/^\.\//, '').replace(/^\//, '');
};

const assetPatterns = [
  /<script\b[^>]*\bsrc=["']([^"']+)["']/g,
  /<link\b[^>]*\bhref=["']([^"']+)["']/g
];
const assets = new Set();
for (const pattern of assetPatterns) {
  for (const match of index.matchAll(pattern)) {
    const asset = localAsset(match[1]);
    if (asset) assets.add(asset);
  }
}

for (const asset of assets) {
  assert.ok(fs.existsSync(path.join(root, asset)), `index asset must exist: ${asset}`);
  assert.ok(
    serviceWorker.includes(`'./${asset}'`),
    `index asset must be included in the Service Worker cache: ${asset}`
  );
}

const requiredOrder = [
  'storage-safety.js',
  'data-integrity-v14.js',
  'app.js',
  'data-recovery-v14.js',
  'device-registry-v14.js',
  'phase56-drive-backup.js'
];
const positions = requiredOrder.map(file => index.indexOf(file));
assert.ok(positions.every(position => position >= 0), 'all protected runtime files must be loaded');
assert.deepEqual(positions, [...positions].sort((a, b) => a - b), 'protected runtime load order must remain stable');

const testFiles = fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.cjs'))
  .sort();
for (const testFile of testFiles) {
  assert.ok(
    workflow.includes(`node tests/${testFile}`),
    `every regression test must run in CI: ${testFile}`
  );
}

assert.ok(development.includes('## 実機確認方針'));
assert.ok(development.includes('Phase 15'));
assert.ok(development.includes('各1回'));
assert.ok(
  history.includes('Production main・コード・デプロイは変更しない'),
  'history must retain the Production no-change boundary'
);

console.log('Phase 15 Develop preflight gate: SUCCESS');
