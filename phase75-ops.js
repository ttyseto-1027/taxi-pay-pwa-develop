(function(){
  'use strict';
  const meta = window.TAXI_PAY_APP_META || {};
  const PREFIX = 'taxi-pay-';
  const text = `Version ${meta.version || '—'}｜Build ${meta.build || '—'}｜${meta.environment || '—'}`;

  function addVersionNodes(){
    document.querySelectorAll('[data-app-version]').forEach(node => { node.textContent = text; });
    const loginCard = document.querySelector('#authGate .auth-card');
    if(loginCard && !loginCard.querySelector('[data-app-version]')){
      const node=document.createElement('p'); node.className='app-version-line'; node.dataset.appVersion=''; node.textContent=text;
      loginCard.querySelector('h1')?.insertAdjacentElement('afterend',node);
    }
    document.querySelectorAll('.app-header > div:first-child, .admin-app-header > div:first-child').forEach(box=>{
      if(box.querySelector('[data-app-version]')) return;
      const node=document.createElement('p'); node.className='app-version-line'; node.dataset.appVersion=''; node.textContent=text;
      box.querySelector('h1')?.insertAdjacentElement('afterend',node);
    });
  }

  async function clearAppCaches(){
    if('caches' in window){
      const keys=await caches.keys();
      await Promise.all(keys.filter(k=>k.startsWith(PREFIX)).map(k=>caches.delete(k)));
    }
    if('serviceWorker' in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.filter(r=>String(r.scope||'').includes(location.pathname.split('/').filter(Boolean)[0]||'' )).map(r=>r.unregister()));
    }
  }

  async function recover(){
    const ok=confirm('アプリの表示データを更新しますか？\n\n保存済みの勤務実績・控除設定・利用者情報は削除されません。');
    if(!ok) return;
    const btn=document.getElementById('refreshAppCache');
    if(btn){btn.disabled=true;btn.textContent='更新しています…';}
    try{
      await clearAppCaches();
      const url=new URL(location.href); url.searchParams.set('_refresh',Date.now());
      location.replace(url.toString());
    }catch(err){
      alert(`キャッシュを更新できませんでした。\n${err?.message||err}`);
      if(btn){btn.disabled=false;btn.textContent='ログインできない場合はこちら（キャッシュを更新）';}
    }
  }

  function addRecoveryButton(){
    const login=document.getElementById('googleLoginButton');
    if(!login || document.getElementById('refreshAppCache')) return;
    const btn=document.createElement('button');
    btn.type='button'; btn.id='refreshAppCache'; btn.className='auth-recovery-link';
    btn.textContent='ログインできない場合はこちら（キャッシュを更新）';
    btn.addEventListener('click',recover);
    login.insertAdjacentElement('afterend',btn);
  }

  function compareBuild(a,b){
    return String(a||'').localeCompare(String(b||''),undefined,{numeric:true,sensitivity:'base'});
  }
  async function checkLatest(){
    try{
      const res=await fetch(`app-meta.json?_=${Date.now()}`,{cache:'no-store'});
      if(!res.ok) return;
      const latest=await res.json();
      if(compareBuild(meta.build,latest.build)>=0) return;
      const host=document.getElementById('authMessage') || document.querySelector('.app-announcement') || document.body.firstElementChild;
      if(document.getElementById('appUpdateNotice')) return;
      const box=document.createElement('div'); box.id='appUpdateNotice'; box.className='app-update-notice';
      box.innerHTML=`<strong>新しいバージョンがあります。</strong><span>Build ${latest.build} を取得してください。</span><button type="button">キャッシュを更新して最新版を取得</button>`;
      box.querySelector('button').addEventListener('click',recover);
      host.insertAdjacentElement('afterend',box);
    }catch(err){ console.warn('最新版確認を実行できませんでした。',err); }
  }
  window.TaxiPayPhase75={meta,clearAppCaches,recover};
  document.addEventListener('DOMContentLoaded',()=>{addVersionNodes();addRecoveryButton();checkLatest();});
})();
