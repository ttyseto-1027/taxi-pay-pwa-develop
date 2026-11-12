'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const RULES=require('../payroll-rules.js');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

// 1. Existing production calculation constants remain the default values.
assert.equal(RULES.DEFAULT_VALUES.taxRate,10);
assert.equal(RULES.DEFAULT_VALUES.payRevenueCoefficient,0.9585);
assert.equal(RULES.DEFAULT_VALUES.kakuARate,41.44);
assert.equal(RULES.DEFAULT_VALUES.kakuBRate,19.05);
assert.equal(RULES.DEFAULT_VALUES.dayARate,45.80);
assert.equal(RULES.DEFAULT_VALUES.nightBRate,20.95);

// 2. A rule starts only at its effective payroll month.
let history=RULES.upsert([],{
  effectiveMonth:'2026-11',
  ...RULES.DEFAULT_VALUES,
  kakuARate:50
});
assert.equal(RULES.resolve(history,'2026-10',{}).kakuARate,41.44);
assert.equal(RULES.resolve(history,'2026-11',{}).kakuARate,50);

// 3. The latest applicable rule wins without changing earlier months.
history=RULES.upsert(history,{
  effectiveMonth:'2027-01',
  ...RULES.DEFAULT_VALUES,
  kakuARate:55
});
assert.equal(RULES.resolve(history,'2026-12',{}).kakuARate,50);
assert.equal(RULES.resolve(history,'2027-01',{}).kakuARate,55);

// 4. Saving the same month replaces that month instead of duplicating it.
history=RULES.upsert(history,{
  effectiveMonth:'2026-11',
  ...RULES.DEFAULT_VALUES,
  kakuARate:52
});
assert.equal(history.filter(x=>x.effectiveMonth==='2026-11').length,1);
assert.equal(RULES.resolve(history,'2026-12',{}).kakuARate,52);

// 5. Deleting a rule restores the prior applicable rule.
history=RULES.remove(history,'2027-01');
assert.equal(RULES.resolve(history,'2027-01',{}).kakuARate,52);

// 6. Legacy local developer values remain effective before the first history row.
assert.equal(RULES.resolve(history,'2026-01',{taxRate:8}).taxRate,8);

// 7. Invalid months and invalid rate/cap relationships are rejected.
assert.throws(()=>RULES.upsert(history,{effectiveMonth:'2026-13',...RULES.DEFAULT_VALUES}),/適用開始給与月/);
assert.throws(()=>RULES.validateValues({...RULES.DEFAULT_VALUES,kakuBStart:500000,kakuBCap:400000}),/最高算定額/);
assert.throws(()=>RULES.validateValues({...RULES.DEFAULT_VALUES,nightRate:101}),/100%以下/);

// 8. Existing commission results are unchanged under defaults.
const kaku=RULES.commissionFor('隔日勤務',1000000,RULES.DEFAULT_VALUES);
assert.equal(kaku.A,414400);
assert.equal(kaku.B,110490);
assert.equal(kaku.total,524890);
const day=RULES.commissionFor('昼日勤',1000000,RULES.DEFAULT_VALUES);
assert.equal(day.A,458000);
assert.equal(day.B,87391);
assert.equal(day.C,30744);
assert.equal(day.total,576135);

// 9. A changed rule actually changes the calculation.
const changed=RULES.commissionFor('隔日勤務',1000000,{...RULES.DEFAULT_VALUES,kakuARate:50});
assert.equal(changed.total,610490);

// 10. Fixed-time rates remain separated by work type.
assert.equal(RULES.fixedRateForType('定隔10'),45.32);
assert.equal(RULES.fixedRateForType('定昼20'),49.92);
assert.equal(RULES.fixedRateForType('定夜20'),44.50);

const html=read('payroll-rules.html');
const adminJs=read('payroll-rules-admin.js');
const app=read('app.js');
const index=read('index.html');
const rules=read('firestore.rules');

// 11. Every schema field has exactly one admin input.
for(const field of RULES.NUMERIC_FIELDS){
  assert.equal((html.match(new RegExp(`data-rule-field="${field}"`,'g'))||[]).length,1,`missing/duplicate field: ${field}`);
}

// 12. Direct URL access is protected by the real Firebase admin record.
assert.ok(adminJs.includes("getDoc(doc(db,'admins',user.uid))"));
assert.ok(adminJs.includes("admin.data().enabled===false"));
assert.ok(!adminJs.includes('ADMIN_PASSWORD'));

// 13. The setting is local-only and never written to Firestore.
assert.ok(adminJs.includes("STORAGE.save(state,reason)"));
assert.ok(!adminJs.includes('setDoc('));
assert.ok(!rules.includes('payrollRuleHistory'));
assert.ok(html.includes('この管理者端末のDevelop版にだけ保存されます'));

// 14. Main calculation resolves rules by payroll month.
for(const marker of ['payrollRuleForMonth','PAYROLL_RULES.resolve','PAYROLL_RULES.commissionFor','payrollRule:clone(payrollRuleForMonth(ym))']){
  assert.ok(app.includes(marker),`calculation integration missing: ${marker}`);
}

// 15. General users cannot see the navigation, and the old weak password UI is gone.
assert.ok(index.includes('id="payrollRulesMenuLink"'));
assert.ok(index.includes('href="payroll-rules.html"'));
assert.ok(index.includes('data-help-admin-href="payroll-rules.html"'));
assert.ok(!index.includes('id="openAdmin"'));
assert.ok(!index.includes('id="adminDialog"'));
assert.ok(!app.includes('TaxiPay-Dev-2026'));

console.log('Phase 17 payroll rules regression: 15/15 PASS');
