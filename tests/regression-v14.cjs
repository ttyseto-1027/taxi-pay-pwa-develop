'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const DI=require('../data-integrity-v14.js');
const baseSettings={shiftType:'隔日勤務',residentTax:0};
const entry=(id,date,gross=10000,extra={})=>({id,date,paidLeaveUnits:0,grossSales:gross,adjustedGrossSales:gross,grossRevenue:gross,clockIn:'10:00',clockOut:'20:00',normalBreakMinutes:60,nightBreakMinutes:0,holidayType:'normal',hadAccident:false,hadViolation:false,...extra});
const state=(entries=[],extra={})=>({initialized:true,settings:{...baseSettings},entries,history:[],...extra});
const ctx={deviceId:'dev-a',deviceName:'iPhone',browser:'Safari'};

// 1. backward compatible shape
{
  const s=DI.ensureState({entries:[],history:[],settings:{}});
  for(const k of ['dataArchive','conflictHistory','deletionHistory','recordTombstones'])assert(Array.isArray(s[k]),k);
}
// 2. metadata does not alter semantic equality
{
  const a=entry('1','2026-08-10',10000),b={...a,updatedAtJst:'x',updatedDeviceId:'y'};
  assert(DI.same(a,b));
}
// 3. save normalization adds provenance
{
  const out=DI.normalizeBeforeSave(state([]),state([entry('1','2026-08-10')]),'entry-save',ctx);
  assert.equal(out.entries[0].createdDeviceId,'dev-a');assert.equal(out.entries[0].updatedBrowser,'Safari');
}
// 4. user deletion archives + tombstone
{
  const prev=state([entry('1','2026-08-10')]);
  const out=DI.normalizeBeforeSave(prev,state([]),'app-save',ctx);
  assert.equal(out.dataArchive.length,1);assert.equal(out.recordTombstones.length,1);assert.equal(out.dataArchive[0].data.id,'1');
}
// 5. month close removal is not mistaken for deletion
{
  const e=entry('1','2026-08-10');
  const prev=state([e]);
  const next=state([],{history:[{month:'2026-08',dailyEntries:[e]}]});
  const out=DI.normalizeBeforeSave(prev,next,'app-save',ctx);
  assert.equal(out.dataArchive.length,0);assert.equal(out.recordTombstones.length,0);
}
// 6. remote-only is auto-added
{
  const p=DI.buildMergePlan(state([entry('1','2026-08-10')]),state([entry('2','2026-08-11')]));
  assert.equal(p.addRemote.length,1);assert.equal(p.conflicts.length,0);
  const out=DI.applyMergePlan(p,{},ctx);assert.deepEqual(out.entries.map(x=>x.id).sort(),['1','2']);
}
// 7. identical same-date different ID is deduplicated
{
  const a=entry('1','2026-08-10'),b={...a,id:'2'};
  const p=DI.buildMergePlan(state([a]),state([b]));assert.equal(p.conflicts.length,1);
}
// 8. same ID content difference is a conflict and remote winner archives local
{
  const p=DI.buildMergePlan(state([entry('1','2026-08-10',10000)]),state([entry('1','2026-08-10',20000)]));
  assert.equal(p.conflicts.length,1);assert(p.conflicts[0].diffs.some(x=>x.field==='grossSales'||x.field==='grossRevenue'||x.field==='adjustedGrossSales'));
  const out=DI.applyMergePlan(p,{[p.conflicts[0].id]:'remote'},ctx);assert.equal(out.entries[0].grossSales,20000);assert.equal(out.dataArchive.length,1);
}
// 9. local winner keeps local and archives remote
{
  const p=DI.buildMergePlan(state([entry('1','2026-08-10',10000)]),state([entry('1','2026-08-10',20000)]));
  const out=DI.applyMergePlan(p,{[p.conflicts[0].id]:'local'},ctx);assert.equal(out.entries[0].grossSales,10000);assert.equal(out.dataArchive.length,1);
}
// 10. field-by-field merge preserves both source records in archive
{
  const l=entry('1','2026-08-10',10000,{normalBreakMinutes:60}),r=entry('1','2026-08-10',20000,{normalBreakMinutes:90});
  const p=DI.buildMergePlan(state([l]),state([r])),c=p.conflicts[0];
  const fields={};c.diffs.forEach(d=>fields[d.field]=d.field==='normalBreakMinutes'?'remote':'local');
  const out=DI.applyMergePlan(p,{[c.id]:{mode:'fields',fields}},ctx);assert.equal(out.entries[0].normalBreakMinutes,90);assert.equal(out.entries[0].grossSales,10000);assert(out.dataArchive.length>=2);
}
// 11. deletion vs existing record is never auto-decided
{
  const l=state([],{recordTombstones:[{entryId:'1',workDate:'2026-08-10',deletedAtJst:'2026-08-27T10:00:00+09:00'}]});
  const r=state([entry('1','2026-08-10',10000)]);const p=DI.buildMergePlan(l,r);assert.equal(p.conflicts.length,1);assert.equal(p.conflicts[0].type,'entry-delete');
}
// 12. deleted-state choice archives surviving record
{
  const l=state([],{recordTombstones:[{entryId:'1',workDate:'2026-08-10',deletedAtJst:'2026-08-27T10:00:00+09:00'}]});
  const r=state([entry('1','2026-08-10',10000)]);const p=DI.buildMergePlan(l,r),c=p.conflicts[0];const out=DI.applyMergePlan(p,{[c.id]:'local'},ctx);assert.equal(out.entries.length,0);assert.equal(out.dataArchive.length,1);
}
// 13. setting differences are user-visible conflicts when both states are active
{
  const l=state([entry('1','2026-08-10')]);l.settings.residentTax=1000;const r=state([entry('1','2026-08-10')]);r.settings.residentTax=2000;
  const p=DI.buildMergePlan(l,r);assert(p.conflicts.some(x=>x.id==='setting:residentTax'));
}
// 14. fresh empty local adopts remote settings without pointless conflict
{
  const l={initialized:false,settings:{},entries:[],history:[]},r=state([entry('1','2026-08-10')]);r.settings.residentTax=3000;
  const p=DI.buildMergePlan(l,r);assert(!p.conflicts.some(x=>x.type==='setting'));const out=DI.applyMergePlan(p,{},ctx);assert.equal(out.settings.residentTax,3000);
}
// 15. archive union deduplicates
{
  const archive={archiveId:'a',kind:'entry',sourceId:'1',workDate:'2026-08-10',archivedAtJst:'x',reason:'x',data:entry('1','2026-08-10')};
  const l=state([],{dataArchive:[archive]}),r=state([],{dataArchive:[{...archive,archiveId:'b'}]});const out=DI.applyMergePlan(DI.buildMergePlan(l,r),{},ctx);assert.equal(out.dataArchive.length,1);
}
// 16. permanent archive deletion removes body and keeps only audit metadata
{
  const archive={archiveId:'a',kind:'entry',sourceId:'1',workDate:'2026-08-10',archivedAtJst:'x',reason:'x',data:entry('1','2026-08-10')};
  const out=DI.permanentlyDeleteArchives(state([],{dataArchive:[archive]}),['a'],ctx);assert.equal(out.dataArchive.length,0);assert.equal(out.deletionHistory.length,1);assert(!('data' in out.deletionHistory[0]));
}
// 17. recovery/restore reason does not manufacture deletion archives
{
  const prev=state([entry('1','2026-08-10')]);const out=DI.normalizeBeforeSave(prev,state([]),'manual-recovery-merge',ctx);assert.equal(out.dataArchive.length,0);
}
// 18. history remote-only is merged
{
  const l=state([]),r=state([],{history:[{month:'2026-07',gross:1000}]});const p=DI.buildMergePlan(l,r);const out=DI.applyMergePlan(p,{},ctx);assert.equal(out.history.length,1);
}
// 19. history differing same month is conflict
{
  const l=state([],{history:[{month:'2026-07',gross:1000}]}),r=state([],{history:[{month:'2026-07',gross:2000}]});const p=DI.buildMergePlan(l,r);assert(p.conflicts.some(x=>x.type==='history'));
}
// 20. no unchosen conflict is allowed to apply
{
  const p=DI.buildMergePlan(state([entry('1','2026-08-10',10000)]),state([entry('1','2026-08-10',20000)]));assert.throws(()=>DI.applyMergePlan(p,{},ctx),/未解決/);
}
// 21. Develop must keep Service Worker update flow and use only explicit V2 acknowledgement
{
  const ops=fs.readFileSync(path.join(__dirname,'..','phase75-ops.js'),'utf8');
  const sw=fs.readFileSync(path.join(__dirname,'..','sw.js'),'utf8');
  assert(!ops.includes('disableDevelopServiceWorkers'),'Develop must not unregister its Service Worker');
  assert(ops.includes('キャッシュ更新'),'visible cache update label is required');
  assert(ops.includes('serviceWorker.register'),'Develop must register the Service Worker');
  assert(ops.includes('taxiPayPendingCacheVersionV2'),'explicit update must use V2 pending acknowledgement');
  assert(ops.includes('taxiPayLastExplicitCacheVersionV2'),'explicit update must use a dedicated V2 applied key');
  assert(!ops.includes('taxiPayLastAppliedCacheVersionV1'),'legacy auto-acknowledgement must not influence current update state');
  assert(ops.includes('pending===latestVersion && currentVersion===pending'),'acknowledgement must complete only after the requested build loads');
  assert(sw.includes('SKIP_WAITING'),'Service Worker must support controlled activation');
}
console.log('v1.4 regression core: 21/21 PASS');
