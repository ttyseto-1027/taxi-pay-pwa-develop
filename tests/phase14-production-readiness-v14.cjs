'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const productionBaseline = '85597dca050d5dbe4c78cd00cc3e579ce30e6c13';
const productionBackupBranch = 'backup/production-pre-phase14-20261001';

const requiredProductionFiles = [
  'storage-safety.js',
  'data-integrity-v14.js',
  'data-recovery-v14.js',
  'device-registry-v14.js',
  'phase11-archive-restore.js'
];

for (const file of requiredProductionFiles) {
  assert.ok(fs.existsSync(path.join(root, file)), `${file} must exist in Develop before Phase 14 synchronization`);
}

const index = read('index.html');
const serviceWorker = read('sw.js');
for (const file of requiredProductionFiles) {
  assert.ok(index.includes(file), `${file} must be loaded by index.html`);
  assert.ok(serviceWorker.includes(`./${file}`), `${file} must be included in the Service Worker cache list`);
}

const appMeta = read('app-meta.js');
assert.ok(
  appMeta.includes("path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION'"),
  'environment detection must remain explicit'
);

const storage = read('storage-safety.js');
assert.ok(
  storage.includes("const primaryKey = isDevelop ? 'taxiPayPwaDevelopStateV10' : 'taxiPayPwaStateV10';"),
  'Develop and Production primary storage keys must remain separated'
);
assert.ok(
  storage.includes("const recoveryKey = isDevelop ? 'taxiPayDevelopRecoverySnapshotsV1' : 'taxiPayRecoverySnapshotsV1';"),
  'Develop and Production recovery keys must remain separated'
);

const recovery = read('data-recovery-v14.js');
assert.ok(
  recovery.includes("STORAGE()?.isDevelop?'taxiPayDevelopBeforeBuiltInRecoveryV1':'taxiPayBeforeBuiltInRecoveryV1'"),
  'pre-recovery safety backups must remain environment-specific'
);

const developUi = read('phase7-ui.js');
assert.ok(developUi.includes('Develop版 タクシー給与シミュレーター'), 'Develop must keep its unmistakable header');
assert.ok(developUi.includes("header.classList.add('develop-header')"), 'Develop header styling marker must remain explicit');

const liveTest = read('phase11-live-test.js');
assert.ok(liveTest.includes('if(!STORAGE()?.isDevelop)return'), 'Phase 11 live test must remain Develop-only');

const deviceTest = read('phase10-device-association-test.js');
assert.ok(deviceTest.includes("params.get('phase10DeviceTest') !== '1'"), 'Phase 10 device association test must require its explicit query flag');
assert.ok(developUi.includes("get('phase10DeviceTest') === '1'"), 'Phase 10 test loader must remain identifiable for exclusion from Production');

const history = read('IMPLEMENTATION_HISTORY_v1.4beta.md');
assert.ok(history.includes(productionBaseline), 'Phase 14 history must record the exact Production baseline commit');
assert.ok(history.includes(productionBackupBranch), 'Phase 14 history must record the exact Production backup branch');
assert.ok(history.includes('Production main・コード・デプロイは変更していない'), 'Phase 14 history must state the Production no-change boundary');

console.log('Phase 14 production readiness gate: SUCCESS');
