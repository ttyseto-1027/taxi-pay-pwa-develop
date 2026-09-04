(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const DI=()=>window.TaxiPayDataIntegrity;
  const STORAGE=()=>window.TaxiPayStorageSafety;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function currentState(){
    const raw=STORAGE()?.getPrimaryRaw();
    if(!raw)return DI().ensureState(STORAGE()?.loadCandidate()?.data||{});
    return DI().ensureState(JSON.parse(raw));
  }

  function findArchive(state,id){return (state.dataArchive||[]).find(a=>a.archiveId===id)||null;}

  function makeRestoreState(state,archive){
    if(!archive||archive.kind!=='entry'||!archive.data||typeof archive.data!=='object')throw new Error('この退避データは勤務実績として復元できません。');
    const entry=JSON.parse(JSON.stringify(archive.data));
    if(!entry.id)throw new Error('退避データに勤務実績IDがありません。');
    const remote=DI().ensureState({entries:[entry],settings:state.settings||{},history:[]});
    return {entry,remote};
  }

  async function resolveArchiveRestore(state,archive){
    const {entry,remote}=makeRestoreState(state,archive);
    const plan=DI().buildMergePlan(state,remote);
    if(plan.conflicts.length){
      const resolver=window.TaxiPayRecoveryV14?.resolveStates;
      if(typeof resolver!=='function')throw new Error('競合比較機能を利用できません。');
      const result=await resolver(state,remote,{local:'現在の有効データ',remote:'退避データ'});
      if(!result)return null;
      return result.state;
    }
    const exists=(state.entries||[]).some(e=>e.id===entry.id);
    if(exists)return state;
    const out=DI().ensureState(state);
    out.entries.push(entry);
    return out;
  }

  function enhanceArchiveUI(){
    const card=$('v14ArchiveCard');
    if(!card||card.dataset.phase11RestoreReady==='1')return;
    card.dataset.phase11RestoreReady='1';
    const actions=card.querySelector('.actions');
    if(!actions)return;
    const btn=document.createElement('button');
    btn.id='v14ArchiveRestore';
    btn.type='button';
    btn.className='secondary';
    btn.textContent='選択した退避データを復元';
    actions.insertBefore(btn,actions.querySelector('#v14ArchiveDelete')||null);

    const message=$('v14ArchiveMessage');
    btn.onclick=async()=>{
      const ids=[...document.querySelectorAll('[data-v14-archive]:checked')].map(x=>x.dataset.v14Archive);
      if(ids.length!==1){if(message)message.textContent='復元する退避データを1件だけ選択してください。';return;}
      const beforeRaw=STORAGE().getPrimaryRaw();
      try{
        const state=currentState(),archive=findArchive(state,ids[0]);
        if(!archive)throw new Error('選択した退避データが見つかりません。');
        if(archive.kind!=='entry')throw new Error('現在は勤務実績の退避データのみ復元できます。');
        const restored=await resolveArchiveRestore(state,archive);
        if(!restored){if(message)message.textContent='復元をキャンセルしました。';return;}
        const currentRaw=STORAGE().getPrimaryRaw();
        if(currentRaw!==beforeRaw)throw new Error('確認中に端末データが変更されました。一覧を更新してやり直してください。');
        const kept=(restored.dataArchive||[]).filter(a=>a.archiveId!==archive.archiveId);
        restored.dataArchive=kept;
        restored.conflictHistory=Array.isArray(restored.conflictHistory)?restored.conflictHistory:[];
        restored.conflictHistory.push({
          conflictId:`archive-restore:${archive.archiveId}`,
          type:'archive-restore',
          targetDate:archive.workDate||archive.data?.date||'',
          resolvedAtJst:DI().jstNow(),
          selected:'restore',
          deviceId:DI().deviceId(),
          deviceName:DI().deviceName(),
          browser:DI().browserName()
        });
        STORAGE().save(restored,'archive-restore');
        if(message)message.textContent='退避データを有効な勤務実績へ復元しました。';
        const refresh=$('v14ArchiveRefresh');if(refresh)refresh.click();
      }catch(e){if(message)message.textContent=`復元できませんでした。${e.message||e}`;}
    };
  }

  function install(){
    enhanceArchiveUI();
    const observer=new MutationObserver(()=>enhanceArchiveUI());
    observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>observer.disconnect(),15000);
  }

  window.TaxiPayPhase11ArchiveRestore={currentState,makeRestoreState,resolveArchiveRestore,enhanceArchiveUI};
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',install):install();
})();
