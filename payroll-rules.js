'use strict';
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.TaxiPayPayrollRules=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  const DEFAULT_VALUES=Object.freeze({
    taxRate:10,
    fareRevisionCoefficient:1,
    payRevenueCoefficient:0.9585,
    modelWorkAllowance:3000,
    accidentFreeAllowance:700,
    violationFreeAllowance:200,
    statutoryOvertimeRate:25,
    scheduledOvertimeRate:25,
    over60Rate:50,
    statutoryHolidayRate:35,
    nonStatutoryHolidayRate:25,
    nightRate:25,
    kakuARate:41.44,
    kakuBStart:420000,
    kakuBCap:1200000,
    kakuBRate:19.05,
    dayARate:45.80,
    dayBStart:378000,
    dayBRate:14.05,
    dayCStart:748000,
    dayCRate:12.20,
    nightARate:37.98,
    nightBStart:420000,
    nightBCap:1200000,
    nightBRate:20.95,
    fixedKakuRate:45.32,
    fixedDayRate:49.92,
    fixedNightRate:44.50
  });
  const NUMERIC_FIELDS=Object.freeze(Object.keys(DEFAULT_VALUES));
  const LEGACY_SETTING_FIELDS=Object.freeze([
    'taxRate','fareRevisionCoefficient','payRevenueCoefficient',
    'modelWorkAllowance','accidentFreeAllowance','violationFreeAllowance',
    'statutoryOvertimeRate','scheduledOvertimeRate','over60Rate',
    'statutoryHolidayRate','nonStatutoryHolidayRate','nightRate'
  ]);
  const RATE_FIELDS=new Set(NUMERIC_FIELDS.filter(key=>key.endsWith('Rate')));
  const COEFFICIENT_FIELDS=new Set(['fareRevisionCoefficient','payRevenueCoefficient']);

  function clone(value){return JSON.parse(JSON.stringify(value));}
  function validMonth(value){return /^\d{4}-(0[1-9]|1[0-2])$/.test(String(value||''));}
  function legacyValues(settings={}){
    const values={...DEFAULT_VALUES};
    for(const key of LEGACY_SETTING_FIELDS){
      const value=Number(settings?.[key]);
      if(Number.isFinite(value))values[key]=value;
    }
    return values;
  }
  function normalizeValues(input={},fallback=DEFAULT_VALUES){
    const values={};
    for(const key of NUMERIC_FIELDS){
      const candidate=Number(input?.[key]);
      const base=Number(fallback?.[key]);
      values[key]=Number.isFinite(candidate)?candidate:(Number.isFinite(base)?base:DEFAULT_VALUES[key]);
    }
    return values;
  }
  function validateValues(values){
    for(const key of NUMERIC_FIELDS){
      const value=Number(values?.[key]);
      if(!Number.isFinite(value))throw new Error(`${key}の値が正しくありません。`);
      if(value<0)throw new Error(`${key}は0以上で入力してください。`);
      if(RATE_FIELDS.has(key)&&value>100)throw new Error(`${key}は100%以下で入力してください。`);
      if(COEFFICIENT_FIELDS.has(key)&&(value<=0||value>5))throw new Error(`${key}は0より大きく5以下で入力してください。`);
      if(!RATE_FIELDS.has(key)&&!COEFFICIENT_FIELDS.has(key)&&value>100000000)throw new Error(`${key}の金額が大きすぎます。`);
    }
    if(Number(values.kakuBCap)<Number(values.kakuBStart))throw new Error('隔日勤務のB最高算定額はB開始額以上にしてください。');
    if(Number(values.nightBCap)<Number(values.nightBStart))throw new Error('夜日勤のB最高算定額はB開始額以上にしてください。');
    if(Number(values.dayCStart)<Number(values.dayBStart))throw new Error('昼日勤のC開始額はB開始額以上にしてください。');
    return true;
  }
  function normalizeHistory(history){
    const byMonth=new Map();
    for(const row of Array.isArray(history)?history:[]){
      if(!row||!validMonth(row.effectiveMonth))continue;
      const values=normalizeValues(row,DEFAULT_VALUES);
      try{validateValues(values);}catch{continue;}
      byMonth.set(row.effectiveMonth,{
        effectiveMonth:row.effectiveMonth,
        ...values,
        updatedAt:String(row.updatedAt||''),
        updatedBy:String(row.updatedBy||'')
      });
    }
    return [...byMonth.values()].sort((a,b)=>a.effectiveMonth.localeCompare(b.effectiveMonth));
  }
  function resolve(history,effectiveMonth,settings={}){
    const month=validMonth(effectiveMonth)?effectiveMonth:'9999-12';
    const rows=normalizeHistory(history).filter(row=>row.effectiveMonth<=month);
    if(rows.length)return clone(rows.at(-1));
    return {effectiveMonth:'legacy',...legacyValues(settings),updatedAt:'',updatedBy:''};
  }
  function upsert(history,row){
    if(!validMonth(row?.effectiveMonth))throw new Error('適用開始給与月を入力してください。');
    const values=normalizeValues(row,DEFAULT_VALUES);
    validateValues(values);
    const next=normalizeHistory(history).filter(item=>item.effectiveMonth!==row.effectiveMonth);
    next.push({
      effectiveMonth:row.effectiveMonth,
      ...values,
      updatedAt:String(row.updatedAt||new Date().toISOString()),
      updatedBy:String(row.updatedBy||'')
    });
    return next.sort((a,b)=>a.effectiveMonth.localeCompare(b.effectiveMonth));
  }
  function remove(history,effectiveMonth){
    return normalizeHistory(history).filter(row=>row.effectiveMonth!==effectiveMonth);
  }
  function fixedRateForType(type,values=DEFAULT_VALUES){
    const rule=normalizeValues(values,DEFAULT_VALUES);
    return String(type||'').startsWith('定隔')?rule.fixedKakuRate:String(type||'').startsWith('定昼')?rule.fixedDayRate:rule.fixedNightRate;
  }
  function commissionFor(type,revenue,values=DEFAULT_VALUES){
    const rule=normalizeValues(values,DEFAULT_VALUES),amount=Math.max(0,Number(revenue||0));
    let A=0,B=0,C=0,names=[];
    if(String(type||'').startsWith('定')){A=amount*fixedRateForType(type,rule)/100;return {A,B,C,total:A,names:[['積算歩合給',A]]};}
    if(type==='隔日勤務'){A=amount*rule.kakuARate/100;B=Math.max(0,Math.min(amount,rule.kakuBCap)-rule.kakuBStart)*rule.kakuBRate/100;names=[['隔日歩合給A',A],['隔日歩合給B',B]];}
    if(type==='昼日勤'){A=amount*rule.dayARate/100;B=Math.max(0,amount-rule.dayBStart)*rule.dayBRate/100;C=Math.max(0,amount-rule.dayCStart)*rule.dayCRate/100;names=[['昼日勤歩合給A',A],['昼日勤歩合給B',B],['昼日勤歩合給C',C]];}
    if(type==='夜日勤'){A=amount*rule.nightARate/100;B=Math.max(0,Math.min(amount,rule.nightBCap)-rule.nightBStart)*rule.nightBRate/100;names=[['夜日勤歩合給A',A],['夜日勤歩合給B',B]];}
    return {A,B,C,total:A+B+C,names};
  }
  return Object.freeze({DEFAULT_VALUES,NUMERIC_FIELDS,LEGACY_SETTING_FIELDS,validMonth,legacyValues,normalizeValues,validateValues,normalizeHistory,resolve,upsert,remove,fixedRateForType,commissionFor});
});
