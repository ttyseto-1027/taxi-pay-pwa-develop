const fs=require('fs');
const src=fs.readFileSync('phase7-ui.js','utf8');
const checks=[
 ['Develop title',src.includes("Develop版 タクシー給与シミュレーター")],
 ['Develop class',src.includes("develop-header")],
 ['dark orange',src.includes('#c45100')],
 ['white text',src.includes('color: #fff')],
 ['Phase8 month nav retained',src.includes('.month-navigation-card #prevMonth')],
 ['Phase8 blank fields retained',src.includes("['idleA', 'idleB', 'otherPlus', 'otherMinus']")]
];
let fail=0; for(const [name,ok] of checks){console.log(`${ok?'PASS':'FAIL'} ${name}`);if(!ok)fail++;}
if(fail) process.exit(1);
