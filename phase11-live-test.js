(function(){
  'use strict';
  if(new URLSearchParams(location.search).get('phase11Test')!=='1')return;
  const TEST_ID='phase11-live-test-entry-v1';
  const ARCHIVE_ID='phase11-live-test-archive-v1';
  const TEST_DATE='2099-12-31';
  const $=id=>document.getElementById(id);
  const DI=()=>window.TaxiPayDataIntegrity;
  const STORAGE=()=>window.TaxiPayStorageSafety;

  function state(){
    const raw=STORAGE()?.getPrimaryRaw();
    return DI().ensureState(raw?JSON.parse(raw):(STORAGE()?.loadCandidate()?.data||{}));
  }
  function testEntry(gross){
    return {id:TEST_ID,date:TEST_DATE,paidLeaveUnits:0,grossSales:gross,adjustedGrossSales:gross,grossRevenue:gross,
      clockIn:'10:00',clockOut:'20:00',normalBreakMinutes:60,nightBreakMinutes:0,holidayType:'normal',
      hadAccident:false,hadViolation:false,phase11TestFixture:true};
  }
  function createFixture(){
    const s=state();
    if((s.entries||[]).some(e=>e?.id===TEST_ID)||(s.dataArchive||[]).some(a=>a?.archiveId===ARCHIVE_ID))
      throw new Error('Phase 11テストデータは既に存在します。先にテストデータを削除してください。');
    s.entries.push(testEntry(22222));
    s.dataArchive.push({archiveId:ARCHIVE_ID,kind:'entry',sourceId:TEST_ID,workDate:TEST_DATE,
      archivedAtJst:DI().jstNow(),reason:'phase11-live-test-fixture',deviceId:DI().deviceId(),
      deviceName:DI().deviceName(),browser:DI().browserName(),data:testEntry(11111)});
    localStorage.setItem(STORAGE().primaryKey,JSON.stringify(s));
  }
  function cleanup(){
    const s=state();
    s.entries=(s.entries||[]).filter(e=>e?.id!==TEST_ID);
    s.dataArchive=(s.dataArchive||[]).filter(a=>a?.archiveId!==ARCHIVE_ID&&a?.sourceId!==TEST_ID);
    s.recordTombstones=(s.recordTombstones||[]).filter(t=>t?.entryId!==TEST_ID);
    s.deletionHistory=(s.deletionHistory||[]).filter(d=>d?.archiveId!==ARCHIVE_ID&&d?.sourceId!==TEST_ID);
    s.conflictHistory=(s.conflictHistory||[]).filter(h=>!String(h?.conflictId||'').includes(TEST_ID)&&!String(h?.conflictId||'').includes(ARCHIVE_ID));
    localStorage.setItem(STORAGE().primaryKey,JSON.stringify(s));
  }
  function renderStatus(){
    const s=state(),el=$('phase11TestStatus');if(!el)return;
    const active=(s.entries||[]).find(e=>e?.id===TEST_ID),archive=(s.dataArchive||[]).find(a=>a?.archiveId===ARCHIVE_ID);
    el.textContent=`テスト実績：${active?'あり（営収 '+Number(active.grossRevenue||active.grossSales||0).toLocaleString('ja-JP')+'円）':'なし'} / テスト退避：${archive?'あり':'なし'}`;
  }
  function install(){
    if(!STORAGE()?.isDevelop)return;
    const panel=document.querySelector('[data-view-panel="settings"]');
    if(!panel||$('phase11LiveTestCard'))return;
    const card=document.createElement('section');card.className='card drive-card';card.id='phase11LiveTestCard';
    card.innerHTML='<h2>Phase 11 実機テスト</h2><p class="note">Develop専用です。実在する勤務実績には触れず、2099年12月31日の専用テストIDだけを作成・削除します。</p><div id="phase11TestStatus" class="phase2-message"></div><div class="actions"><button id="phase11CreateFixture" type="button">競合テストデータを作成</button><button id="phase11CleanupFixture" type="button" class="danger">Phase 11テストデータを削除</button></div><div id="phase11TestMessage" class="phase2-message"></div>';
    panel.appendChild(card);
    $('phase11CreateFixture').onclick=()=>{try{createFixture();$('phase11TestMessage').textContent='テスト用の有効データ22,222円と退避データ11,111円を作成しました。';$('v14ArchiveRefresh')?.click();renderStatus();}catch(e){$('phase11TestMessage').textContent=e.message||String(e);}};
    $('phase11CleanupFixture').onclick=()=>{try{cleanup();$('phase11TestMessage').textContent='Phase 11専用テストデータだけを削除しました。';$('v14ArchiveRefresh')?.click();renderStatus();}catch(e){$('phase11TestMessage').textContent=e.message||String(e);}};
    renderStatus();
  }
  window.TaxiPayPhase11LiveTest={TEST_ID,ARCHIVE_ID,TEST_DATE,state,createFixture,cleanup};
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',install):install();
})();