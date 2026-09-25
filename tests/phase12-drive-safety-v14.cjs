const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const drive = fs.readFileSync(path.join(__dirname,'..','phase56-drive-backup.js'),'utf8');
const integrity = fs.readFileSync(path.join(__dirname,'..','data-integrity-v14.js'),'utf8');

assert.ok(drive.includes("schema: 'taxi-pay-drive-v3'"));
assert.ok(drive.includes('TaxiPayDataIntegrity?.ensureState?.(parsed)'));
for (const key of ['dataArchive','conflictHistory','deletionHistory','recordTombstones']) assert.ok(integrity.includes(key), key);
assert.ok(drive.includes('function normalizedBackupState(backup)'));
assert.ok(drive.includes('TaxiPayDataIntegrity?.ensureState?.(backup.data.state)'));
assert.ok(drive.includes('window.TaxiPayRecoveryV14.resolveStates('));
assert.ok(drive.includes('const resolved = await resolver('));
assert.ok(drive.includes('remoteState'));
assert.ok(drive.includes('if (!requireDeviceName()) return;'));
assert.ok(drive.includes('const backupName = `backup-${jstStamp()}.json`;'));
assert.ok(drive.includes('await uploadJson(backupName, snapshot);'));
assert.ok(drive.includes("await uploadJson('current.json', snapshot"));
console.log('Phase 12 Drive safety regression: SUCCESS');
