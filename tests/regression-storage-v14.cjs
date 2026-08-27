'use strict';
const assert=require('assert');

class MemoryStorage{
  constructor(){this.map=new Map();}
  get length(){return this.map.size;}
  key(i){return [...this.map.keys()][i]??null;}
  getItem(k){return this.map.has(k)?this.map.get(k):null;}
  setItem(k,v){this.map.set(String(k),String(v));}
  removeItem(k){this.map.delete(String(k));}
  clear(){this.map.clear();}
}

global.localStorage=new MemoryStorage();
global.location={pathname:'/taxi-pay-pwa-develop/'};
Object.defineProperty(globalThis,'navigator',{value:{userAgent:'Mozilla/5.0 (iPhone) AppleWebKit Safari'},configurable:true});
if(!globalThis.crypto) Object.defineProperty(globalThis,'crypto',{value:require('crypto').webcrypto,configurable:true});

const DI=require('../data-integrity-v14.js');
global.TaxiPayDataIntegrity=DI;
const STORAGE=require('../storage-safety.js');

const entry=(id,date,gross=10000)=>({id,date,paidLeaveUnits:0,grossSales:gross,adjustedGrossSales:gross,grossRevenue:gross,clockIn:'10:00',clockOut:'20:00',normalBreakMinutes:60,nightBreakMinutes:0,holidayType:'normal',hadAccident:false,hadViolation:false});
const state=entries=>({initialized:true,settings:{shiftType:'隔日勤務'},entries,history:[]});

// 1. Every ordinary storage save passes through data-integrity and records provenance.
{
  const saved=STORAGE.save(state([entry('1','2026-08-10')]),'entry-save');
  assert.equal(saved.entries.length,1);
  assert(saved.entries[0].createdAtJst);
  assert(saved.entries[0].createdDeviceId);
  const disk=JSON.parse(STORAGE.getPrimaryRaw());
  assert.equal(disk.entries[0].id,'1');
  assert(disk.entries[0].updatedAtJst);
}

// 2. Removing an active record through the normal app-save path archives it and creates a tombstone.
{
  const saved=STORAGE.save(state([]),'app-save');
  assert.equal(saved.entries.length,0);
  assert.equal(saved.dataArchive.length,1);
  assert.equal(saved.dataArchive[0].data.id,'1');
  assert.equal(saved.recordTombstones.length,1);
  assert.equal(saved.recordTombstones[0].entryId,'1');
}

// 3. A recovery/merge save must not manufacture a deletion archive merely because active entries differ.
{
  localStorage.clear();
  STORAGE.save(state([entry('2','2026-08-11')]),'entry-save');
  const restored=STORAGE.save(state([]),'manual-recovery-merge');
  assert.equal(restored.entries.length,0);
  assert.equal(restored.dataArchive.length,0);
  assert.equal(restored.recordTombstones.length,0);
}

// 4. DEVELOP remains isolated from PRODUCTION keys.
{
  assert.equal(STORAGE.isDevelop,true);
  assert.equal(STORAGE.primaryKey,'taxiPayPwaDevelopStateV10');
  assert(!STORAGE.legacyKeys.some(k=>/^taxiPayPwaStateV/.test(k)));
}

// 5. Re-saving unchanged data must not create an archive/tombstone or change business data.
{
  localStorage.clear();
  const first=STORAGE.save(state([entry('3','2026-08-12',12345)]),'entry-save');
  const second=STORAGE.save(state([entry('3','2026-08-12',12345)]),'entry-save');
  assert.equal(second.entries.length,1);
  assert.equal(second.entries[0].grossSales,12345);
  assert.equal(second.dataArchive.length,0);
  assert.equal(second.recordTombstones.length,0);
  assert.equal(second.entries[0].createdAtJst,first.entries[0].createdAtJst);
}

// 6. Moving an active entry into closed-month history is not a deletion and must not create a tombstone.
{
  localStorage.clear();
  STORAGE.save(state([entry('4','2026-08-13')]),'entry-save');
  const closed=state([]);
  closed.history=[{month:'2026-08',dailyEntries:[entry('4','2026-08-13')]}];
  const saved=STORAGE.save(closed,'close-month');
  assert.equal(saved.entries.length,0);
  assert.equal(saved.dataArchive.length,0);
  assert.equal(saved.recordTombstones.length,0);
}

console.log('v1.4 storage integration regression: 6/6 PASS');
