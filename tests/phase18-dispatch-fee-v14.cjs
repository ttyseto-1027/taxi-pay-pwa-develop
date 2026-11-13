'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');

const app=read('app.js');
const html=read('index.html');
const draft=read('v13-features.js');
const recovery=read('data-recovery-v14.js');
const sw=read('sw.js');
const meta=JSON.parse(read('app-meta.json'));

// 1. The daily input exposes one independent dispatch-fee field.
assert.equal((html.match(/id="dispatchFee"/g)||[]).length,1);
assert.ok(html.includes('id="dispatchFee" inputmode="numeric" pattern="[0-9]*" type="text" value=""'));
assert.ok(html.includes('配車手数料'));

// 2. The visible formula identifies the dispatch fee as a subtraction.
assert.ok(html.includes('－ その他（－）－ 配車手数料'));

// 3. Execute the actual calculation function with representative values.
const match=app.match(/function calculateAdjustedGross\(\)\{([\s\S]*?)\n\}/);
assert.ok(match,'calculateAdjustedGross must exist');
const values={grossRevenue:100000,otherPlus:500,otherMinus:1000,dispatchFee:300,idleA:2000,idleB:1500};
const $=id=>({value:values[id]??0});
const adjustmentValue=id=>Math.max(0,Number($(id)?.value||0));
const calculateAdjustedGross=new Function('$','adjustmentValue',`function calculateAdjustedGross(){${match[1]}\n}\nreturn calculateAdjustedGross;`)($,adjustmentValue);
assert.equal(calculateAdjustedGross(),95700);

// 4. Old records receive a zero value without changing their old adjusted gross.
assert.ok(app.includes('const dispatchFee=Number(e.dispatchFee||0)'));
assert.ok(app.includes('const adjustedGrossSales=Number(e.adjustedGrossSales ?? legacyGross)'));

// 5. New and paid-leave records persist the field.
assert.ok(app.includes('grossSales,otherPlus,otherMinus,dispatchFee,idleA,idleB'));
assert.ok(app.includes('otherMinus:0,dispatchFee:0,idleA:0'));

// 6. Editing a saved record restores the field.
assert.ok(app.includes("$('dispatchFee').value=Number(e.dispatchFee||0)"));

// 7. Draft save and restore include the field.
assert.ok(draft.includes("dispatchFee:$('dispatchFee')?.value||''"));
assert.ok(draft.includes("'otherMinus','dispatchFee','idleA'"));

// 8. CSV output has a matching header and data cell.
assert.ok(app.includes("'その他（－）','配車手数料','A空転'"));
assert.ok(app.includes('leave?0:Number(e.dispatchFee||0)'));

// 9. Recovery presents the field with a human-readable label and yen unit.
assert.ok(recovery.includes("dispatchFee:'配車手数料'"));
assert.ok(recovery.includes('gross|Plus|Minus|Fee|idle'));

// 10. Build metadata and the Service Worker cache are synchronized.
assert.equal(meta.build,'20261114-01');
assert.ok(sw.includes(meta.cacheVersion));

console.log('Phase 18 dispatch fee regression: 10/10 PASS');
