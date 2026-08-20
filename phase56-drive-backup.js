'use strict';
(() => {
  const CLIENT_ID=String(window.TAXI_PAY_GOOGLE_DRIVE_CONFIG?.clientId||'');
  const SCOPE='https://www.googleapis.com/auth/drive.file';
  const TOKEN_KEY='taxiPayDriveTokenV1', META_KEY='taxiPayDriveMetaV2', DEVICE_KEY='taxiPayDeviceNameV1', SAFETY_KEY='taxiPayBeforeRestoreV1';
  const FOLDER_NAME='給与シミュレーター', RETENTION_DAYS=90;
  let tokenClient=null, accessToken='', folderId='', syncing=false;
  const $=id=>document.getElementById(id);
  const jstParts=(date=new Date())=>Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date).map(x=>[x.type,x.value]));
  const jstNow=()=>{const p=jstParts();return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}+09:00`};
  const jstStamp=()=>{const p=jstParts();return `${p.year}${p.month}${p.day}-${p.hour}${p.minute}${p.second}-JST`};
  const formatJst=s=>s?new Date(s).toLocaleString('ja-JP',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'})+' JST':'—';
  const formatBytes=n=>{n=Number(n||0);if(n<1024)return `${n} B`;if(n<1024**2)return `${(n/1024).toFixed(n<10240?1:0)} KB`;return `${(n/1024**2).toFixed(1)} MB`};
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function meta(){try{return JSON.parse(localStorage.getItem(META_KEY)||'{}')}catch{return {}}}
  function saveMeta(v){localStorage.setItem(META_KEY,JSON.stringify({...meta(),...v}));renderStatus()}
  function msg(id,text='',kind='info'){const el=$(id);if(el){el.textContent=text;el.dataset.kind=kind}}
  function defaultDeviceName(){const ua=navigator.userAgent;return /iPhone|iPad/.test(ua)?'iPhone / iPad':/Android/.test(ua)?'Android':/Windows/.test(ua)?'Windows PC':/Macintosh/.test(ua)?'Mac':'この端末'}
  function deviceName(){return localStorage.getItem(DEVICE_KEY)||defaultDeviceName()}
  function saveDeviceName(){const v=$('driveDeviceName')?.value.trim();if(!v)return msg('driveSyncMessage','デバイス名を入力してください。','error');localStorage.setItem(DEVICE_KEY,v);msg('driveSyncMessage','デバイス名を端末に保存しました。','success')}
  function payload(){
    const state=localStorage.getItem('taxiPayPwaStateV10');
    if(!state)throw new Error('端末に保存された給与シミュレーターデータがありません。');
    const salesTargets={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k?.startsWith('taxiPaySalesTarget:v1:'))salesTargets[k]=localStorage.getItem(k)}
    let parsed;try{parsed=JSON.parse(state)}catch{throw new Error('端末データを読み取れませんでした。')}
    return {schema:'taxi-pay-drive-v2',savedAtJst:jstNow(),deviceName:deviceName(),appVersion:window.TAXI_PAY_APP_META?.version||'',appBuild:window.TAXI_PAY_APP_META?.build||'',data:{state:parsed,salesTargets}};
  }
  function applyPayload(p){if(!p?.data?.state)throw new Error('給与シミュレーターのバックアップ形式ではありません。');localStorage.setItem('taxiPayPwaStateV10',JSON.stringify(p.data.state));Object.keys(localStorage).filter(k=>k.startsWith('taxiPaySalesTarget:v1:')).forEach(k=>localStorage.removeItem(k));Object.entries(p.data.salesTargets||{}).forEach(([k,v])=>localStorage.setItem(k,String(v)));localStorage.setItem('taxiPayLastImportedAtJst',jstNow())}
  function summary(p){const s=p?.data?.state||{}, entries=Array.isArray(s.entries)?s.entries:[], hist=Array.isArray(s.history)?s.history:[], dates=entries.map(x=>x.date).filter(Boolean).sort();return {daily:entries.length,monthly:hist.length,period:dates.length?`${dates[0]} ～ ${dates.at(-1)}`:'—'}}
  function renderStatus(){
    const m=meta(),connected=!!accessToken;
    if($('driveConnectionStatus')) $('driveConnectionStatus').textContent=
      connected?'この画面で利用可能':(m.driveScopeGranted?'同期時に自動確認':'初回同期時に権限確認');
    if($('driveLastSync')) $('driveLastSync').textContent=m.lastSyncAt?formatJst(m.lastSyncAt):'—';
    if($('driveDeviceName')&&!$('driveDeviceName').value) $('driveDeviceName').value=deviceName();
    if($('driveSyncNow')) $('driveSyncNow').disabled=syncing;
    if($('driveDisconnect')){
      $('driveDisconnect').disabled=!connected;
      $('driveDisconnect').hidden=!connected;
    }
    if($('driveRefreshBackups')) $('driveRefreshBackups').disabled=!connected;
  }
  async function loadGis(){if(window.google?.accounts?.oauth2)return;await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://accounts.google.com/gsi/client';s.async=true;s.onload=resolve;s.onerror=()=>reject(new Error('Google認証ライブラリを読み込めませんでした。'));document.head.appendChild(s)})}
  async function initTokenClient(){ return true; }

  async function ensureDriveAccess(){
    if(accessToken) return true;

    accessToken =
      sessionStorage.getItem('taxipay:google-api-access-token') ||
      sessionStorage.getItem(TOKEN_KEY) ||
      '';

    if(accessToken){
      sessionStorage.setItem(TOKEN_KEY, accessToken);
      saveMeta({driveScopeGranted:true, driveAuthorizationPending:false});
      await ensureFolder();
      renderStatus();
      return true;
    }

    if(typeof window.TaxiPayRequestDriveAuthorization !== 'function'){
      throw new Error(
        'Google認証機能の準備が完了していません。ページを再読み込みしてから、もう一度お試しください。'
      );
    }

    saveMeta({driveAuthorizationPending:true});
    msg('driveSyncMessage','Google Driveの利用権限を確認しています…','info');

    try{
      accessToken = await window.TaxiPayRequestDriveAuthorization();

      if(!accessToken){
        throw new Error('Google Driveの利用権限を取得できませんでした。');
      }

      sessionStorage.setItem(TOKEN_KEY, accessToken);
      saveMeta({
        driveScopeGranted:true,
        driveAuthorizationPending:false,
        connectedAt:jstNow()
      });

      await ensureFolder();
      renderStatus();
      return true;

    }catch(error){
      saveMeta({driveAuthorizationPending:false});
      renderStatus();

      if(error?.code === 'auth/popup-closed-by-user'){
        throw new Error('Google Driveの権限確認がキャンセルされました。');
      }
      if(error?.code === 'auth/popup-blocked'){
        throw new Error(
          'Googleの権限確認画面がブラウザにブロックされました。ポップアップを許可して再試行してください。'
        );
      }
      if(error?.code === 'auth/user-mismatch'){
        throw new Error(
          '現在ログインしているGoogleアカウントと異なるアカウントが選択されました。ログイン中のGoogleアカウントを選択してください。'
        );
      }
      if(error?.code === 'drive/not-signed-in'){
        throw new Error(
          'Googleログイン状態を確認できません。いったんログアウトして、もう一度Googleログインしてください。'
        );
      }
      throw error;
    }
  }

  async function syncNow(){
    if(syncing)return;
    syncing=true;
    renderStatus();
    try{
      await ensureDriveAccess();
      const p=payload(),m=meta();if(!m.everSynced){const s=summary(p);if(!confirm(`Google Driveへの初回同期です。\n\nこの端末の本人データ一式を保存します。\n日次データ：${s.daily}件\n月次データ：${s.monthly}件\n対象期間：${s.period}\n\n管理者には勤務実績（売上や個人の給与に関わる設定等の全て）は送信されません。\n\n同期しますか？`))return}const snap=JSON.parse(JSON.stringify(p));const name=`backup-${jstStamp()}.json`;await uploadJson(name,snap);const cur=await findFile('current.json');await uploadJson('current.json',snap,cur?.id||'');const d=await listBackups();const removed=await cleanupOld(d.files||[]);saveMeta({lastSyncAt:snap.savedAtJst,everSynced:true,lastDeviceName:snap.deviceName});msg('driveSyncMessage',`Google Driveにバックアップしました。1世代を保存しました。${removed?` 90日を超えた${removed}件を自動削除しました。`:''}`,'success');await refreshBackups()}catch(e){
      msg('driveSyncMessage',`Google Driveへのバックアップに失敗しました。端末には保存されています。${meta().lastSyncAt?` 最終同期：${formatJst(meta().lastSyncAt)}`:''} ${e.message}`,'error');
    }finally{
      syncing=false;
      renderStatus();
    }
  }
  async function refreshBackups(){const root=$('driveBackupList');if(!root)return;try{let d=await listBackups(),rows=d.files||[];const removed=await cleanupOld(rows);if(removed){d=await listBackups();rows=d.files||[]}const total=rows.reduce((a,f)=>a+Number(f.size||0),0);if($('driveBackupSummary'))$('driveBackupSummary').textContent=`過去バックアップ：${rows.length}世代・合計 ${formatBytes(total)}（90日保存）`;root.innerHTML=rows.length?rows.map(f=>`<div class="drive-backup-row"><div><strong>${esc(formatJst(f.createdTime||f.modifiedTime))}</strong><span>容量：${esc(formatBytes(f.size))}</span></div><div class="actions"><button class="secondary" data-drive-restore="${f.id}" type="button">復元</button><button class="ghost" data-drive-delete="${f.id}" data-drive-label="${esc(formatJst(f.createdTime||f.modifiedTime))}" type="button">削除</button></div></div>`).join(''):'<p class="note">バックアップはまだありません。</p>'}catch(e){root.innerHTML='<p class="note">一覧を取得できませんでした。</p>';msg('driveBackupMessage',e.message,'error')}}
  async function readDrive(id){return api(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`)}
  function saveSafety(){localStorage.setItem(SAFETY_KEY,JSON.stringify({savedAtJst:jstNow(),deviceName:deviceName(),payload:payload()}));if($('restoreSafetyButton'))$('restoreSafetyButton').hidden=false}
  async function restoreDrive(id){if(!confirm('選択したバックアップをこの端末へ復元します。現在の端末データは端末内に退避します。Google Driveは自動で上書きしません。続行しますか？'))return;try{saveSafety();applyPayload(await readDrive(id));msg('driveBackupMessage','端末へ復元しました。Google Driveにはまだ同期していません。内容を確認してください。','success');setTimeout(()=>location.reload(),500)}catch(e){msg('driveBackupMessage',e.message,'error')}}
  function restoreSafety(){try{const s=JSON.parse(localStorage.getItem(SAFETY_KEY)||'null');if(!s?.payload)throw new Error('復元前データがありません。');if(!confirm(`復元前の端末データ（${formatJst(s.savedAtJst)}）へ戻しますか？`))return;applyPayload(s.payload);msg('driveBackupMessage','復元前の端末データへ戻しました。','success');setTimeout(()=>location.reload(),500)}catch(e){msg('driveBackupMessage',e.message,'error')}}
  async function removeBackup(id,label){if(!confirm(`${label}\nこのバックアップを削除しますか？\n削除すると、この世代からは復元できません。`))return;try{await deleteFile(id);msg('driveBackupMessage','選択したバックアップを削除しました。','success');await refreshBackups()}catch(e){msg('driveBackupMessage',e.message,'error')}}
  async function checkConflict(){const cur=await findFile('current.json');const box=$('driveConflictBox');if(!cur||!box){if(box)box.hidden=true;return}try{const remote=await readDrive(cur.id),local=payload();if(JSON.stringify(remote.data)!==JSON.stringify(local.data)){const a=summary(local),b=summary(remote);box.hidden=false;box.innerHTML=`<strong>端末とGoogle Driveのデータが異なります</strong><div class="drive-compare"><div><b>この端末：${esc(deviceName())}</b><span>更新：${esc(formatJst(local.savedAtJst))}</span><span>日次 ${a.daily}件 / 月次 ${a.monthly}件</span><span>${esc(a.period)}</span></div><div><b>Drive保存元：${esc(remote.deviceName||'不明')}</b><span>同期：${esc(formatJst(remote.savedAtJst||cur.modifiedTime))}</span><span>日次 ${b.daily}件 / 月次 ${b.monthly}件</span><span>${esc(b.period)}</span></div></div><p class="note">新しい日時を自動採用しません。Driveデータを使う場合は過去バックアップ一覧から復元してください。この端末を正とする場合は［Google Driveにバックアップ］を押してください。</p>`}else box.hidden=true}catch{box.hidden=true}}
  function bind(){
    accessToken=sessionStorage.getItem('taxipay:google-api-access-token')||sessionStorage.getItem(TOKEN_KEY)||'';
    renderStatus();
    if($('restoreSafetyButton')) $('restoreSafetyButton').hidden=!localStorage.getItem(SAFETY_KEY);
    $('saveDriveDeviceName')?.addEventListener('click',saveDeviceName);
    $('driveSyncNow')?.addEventListener('click',syncNow);
    $('driveRefreshBackups')?.addEventListener('click',refreshBackups);
    $('restoreSafetyButton')?.addEventListener('click',restoreSafety);
    $('driveBackupList')?.addEventListener('click',e=>{
      const r=e.target.closest('[data-drive-restore]'),d=e.target.closest('[data-drive-delete]');
      if(r)restoreDrive(r.dataset.driveRestore);
      if(d)removeBackup(d.dataset.driveDelete,d.dataset.driveLabel);
    });
    if(accessToken){
      ensureFolder().then(()=>{refreshBackups();checkConflict()}).catch(()=>{
        accessToken='';
        sessionStorage.removeItem(TOKEN_KEY);
        renderStatus();
      });
    }
  }
  document.addEventListener('DOMContentLoaded',bind);
})();
