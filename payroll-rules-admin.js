import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getAuth,GoogleAuthProvider,browserLocalPersistence,setPersistence,signInWithPopup,signInWithRedirect,getRedirectResult,signOut,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {getFirestore,doc,getDoc} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const config=window.TAXI_PAY_FIREBASE_CONFIG||{};
const STORAGE=window.TaxiPayStorageSafety;
const RULES=window.TaxiPayPayrollRules;
const gate=document.getElementById('payrollRulesAuthGate');
const checking=document.getElementById('authCheckingPanel');
const authMessage=document.getElementById('payrollRulesAuthMessage');
const status=document.getElementById('payrollRulesStatus');
let currentAdminEmail='';
let state=null;

function showGate(text='管理者のGoogleアカウントでログインしてください。'){
  document.body.classList.remove('auth-checking');
  document.body.classList.add('auth-pending');
  checking.hidden=true;gate.hidden=false;authMessage.textContent=text;
}
function showPage(){document.body.classList.remove('auth-checking','auth-pending');checking.hidden=true;gate.hidden=true;}
function setStatus(text='',kind=''){status.textContent=text;status.dataset.kind=kind;}
function formatError(error,fallback='処理を完了できませんでした。'){console.error(error);return error?.message||fallback;}
function currentJstMonth(){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit'}).format(new Date());}
function formatNumber(value){return Number(value||0).toLocaleString('ja-JP',{maximumFractionDigits:4});}
function loadState(){
  const loaded=STORAGE.loadCandidate();
  if(loaded.health?.writeBlocked)throw new Error('保存済みデータを安全に読み取れないため、条件設定を停止しました。');
  state=loaded.data||{initialized:false,settings:{},entries:[],history:[]};
  state.payrollRuleHistory=RULES.normalizeHistory(state.payrollRuleHistory);
}
function saveState(reason){
  state.payrollRuleHistory=RULES.normalizeHistory(state.payrollRuleHistory);
  state=STORAGE.save(state,reason);
}
function formValues(){
  const values={};
  document.querySelectorAll('[data-rule-field]').forEach(input=>{values[input.dataset.ruleField]=Number(input.value);});
  return values;
}
function fillForm(values){
  document.querySelectorAll('[data-rule-field]').forEach(input=>{input.value=String(values[input.dataset.ruleField]??'');});
}
function activeFor(month){return RULES.resolve(state.payrollRuleHistory,month,state.settings||{});}
function updateActiveMessage(){
  const month=document.getElementById('effectiveMonth').value;
  const active=activeFor(month);
  document.getElementById('payrollActiveRule').textContent=active.effectiveMonth==='legacy'
    ? `${month}給与には、既存の標準条件が適用されています。`
    : `${month}給与には、${active.effectiveMonth}からの条件が適用されています。`;
}
function loadEffective(){
  const month=document.getElementById('effectiveMonth').value;
  if(!RULES.validMonth(month)){setStatus('適用開始給与月を入力してください。','error');return;}
  fillForm(activeFor(month));updateActiveMessage();setStatus(`${month}給与に適用される条件を読み込みました。`,'success');
}
function renderHistory(){
  const host=document.getElementById('payrollRuleHistory');
  const rows=RULES.normalizeHistory(state.payrollRuleHistory).slice().reverse();
  if(!rows.length){host.innerHTML='<p class="note">保存済みの条件はありません。既存の標準条件で計算します。</p>';return;}
  host.innerHTML=rows.map(row=>`<article class="payroll-rule-history-row" data-rule-month="${row.effectiveMonth}"><div><strong>${row.effectiveMonth.replace('-','年')}月から</strong><small>消費税 ${formatNumber(row.taxRate)}%／隔日A ${formatNumber(row.kakuARate)}%／給与算定係数 ${formatNumber(row.payRevenueCoefficient)}</small></div><div class="actions"><button class="ghost" type="button" data-edit-rule="${row.effectiveMonth}">編集</button><button class="danger" type="button" data-delete-rule="${row.effectiveMonth}">削除</button></div></article>`).join('');
}
function resetToDefaults(){fillForm(RULES.DEFAULT_VALUES);setStatus('標準値を入力しました。保存するまで計算には反映されません。','info');}

if(!STORAGE||!RULES){showGate('給与計算条件の保存機能を読み込めませんでした。最新版へ更新してください。');}
else if(!config.enabled||!config.apiKey||config.apiKey==='REPLACE_ME'){showGate('Firebaseの初期設定が未完了です。');}
else{
  const app=initializeApp(config);const auth=getAuth(app);const db=getFirestore(app);const provider=new GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});
  document.getElementById('payrollRulesLogin').addEventListener('click',async()=>{try{await setPersistence(auth,browserLocalPersistence);try{await signInWithPopup(auth,provider);}catch(error){if(['auth/popup-blocked','auth/popup-closed-by-user','auth/cancelled-popup-request','auth/operation-not-supported-in-this-environment'].includes(error?.code)){await signInWithRedirect(auth,provider);return;}throw error;}}catch(error){showGate(formatError(error,'Googleログインに失敗しました。'));}});
  document.getElementById('payrollRulesLogout').addEventListener('click',()=>signOut(auth));
  document.getElementById('effectiveMonth').addEventListener('change',updateActiveMessage);
  document.getElementById('loadEffectivePayrollRules').addEventListener('click',loadEffective);
  document.getElementById('resetPayrollRules').addEventListener('click',resetToDefaults);
  document.getElementById('payrollRulesForm').addEventListener('submit',event=>{
    event.preventDefault();
    try{
      const effectiveMonth=document.getElementById('effectiveMonth').value;
      if(!RULES.validMonth(effectiveMonth))throw new Error('適用開始給与月を入力してください。');
      const values=formValues();RULES.validateValues(values);
      const replacing=RULES.normalizeHistory(state.payrollRuleHistory).some(row=>row.effectiveMonth===effectiveMonth);
      const action=replacing?'更新':'追加';
      if(!confirm(`${effectiveMonth}給与から適用する条件を${action}します。\n\nこの管理者端末だけに保存されます。`))return;
      state.payrollRuleHistory=RULES.upsert(state.payrollRuleHistory,{effectiveMonth,...values,updatedAt:new Date().toISOString(),updatedBy:currentAdminEmail});
      saveState('payroll-rule-save');renderHistory();updateActiveMessage();setStatus(`${effectiveMonth}給与からの計算条件を保存しました。`,'success');
    }catch(error){setStatus(formatError(error,'給与計算条件を保存できませんでした。'),'error');}
  });
  document.getElementById('payrollRuleHistory').addEventListener('click',event=>{
    const edit=event.target.dataset.editRule;const remove=event.target.dataset.deleteRule;
    if(edit){document.getElementById('effectiveMonth').value=edit;fillForm(RULES.resolve(state.payrollRuleHistory,edit,state.settings||{}));updateActiveMessage();scrollTo({top:0,behavior:'smooth'});setStatus(`${edit}給与からの条件を編集中です。`,'info');}
    if(remove){
      if(!confirm(`${remove}給与からの条件を削除します。\n\n削除後は1つ前の条件が適用されます。`))return;
      try{state.payrollRuleHistory=RULES.remove(state.payrollRuleHistory,remove);saveState('payroll-rule-delete');renderHistory();updateActiveMessage();setStatus(`${remove}給与からの条件を削除しました。`,'success');}catch(error){setStatus(formatError(error,'条件を削除できませんでした。'),'error');}
    }
  });
  getRedirectResult(auth).catch(error=>showGate(formatError(error,'Googleログインに失敗しました。')));
  onAuthStateChanged(auth,async user=>{
    if(!user){showGate();return;}
    try{
      const admin=await getDoc(doc(db,'admins',user.uid));
      if(!admin.exists()||admin.data().enabled===false){await signOut(auth);showGate('このGoogleアカウントには管理者権限がありません。');return;}
      currentAdminEmail=String(user.email||'').trim().toLowerCase();loadState();
      const month=currentJstMonth();document.getElementById('effectiveMonth').value=month;fillForm(activeFor(month));renderHistory();updateActiveMessage();showPage();
    }catch(error){await signOut(auth).catch(()=>{});showGate(formatError(error,'管理者権限を確認できませんでした。'));}
  });
}
