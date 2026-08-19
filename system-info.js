(function(){
  'use strict';

  const $ = id => document.getElementById(id);
  const meta = window.TAXI_PAY_APP_META || {};
  const APP_CACHE_PREFIX = 'taxi-pay-';

  function setText(id, value){
    const el = $(id);
    if(el) el.textContent = value ?? '—';
  }

  function formatError(err){
    if(!err) return '不明なエラー';
    return err.message || String(err);
  }

  async function ensureServiceWorkerRegistered(){
    if(!('serviceWorker' in navigator)){
      return {
        supported:false,
        status:'unsupported',
        registration:null,
        error:null
      };
    }

    setText('serviceWorkerStatus','登録中…');
    setText('serviceWorkerState','確認中…');

    try{
      const swUrl = new URL('./sw.js', location.href);

      let reg = await navigator.serviceWorker.getRegistration('./');

      if(!reg){
        reg = await navigator.serviceWorker.register(swUrl.pathname, {
          scope:'./',
          updateViaCache:'none'
        });
      }

      try{
        await reg.update();
      }catch(_){}

      // ready はアクティブなService Workerが制御可能になるまで待つ。
      // ただし初回登録直後に永遠に待たないようタイムアウトを設ける。
      const ready = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise(resolve => setTimeout(() => resolve(null), 5000))
      ]);

      reg = ready || reg;

      const worker =
        reg?.active ||
        reg?.waiting ||
        reg?.installing ||
        null;

      return {
        supported:true,
        status:'registered',
        registration:reg,
        worker,
        error:null
      };
    }catch(err){
      return {
        supported:true,
        status:'failed',
        registration:null,
        worker:null,
        error:err
      };
    }
  }

  async function readCacheInfo(){
    if(!('caches' in window)){
      return {supported:false, names:[], appNames:[], error:null};
    }

    try{
      const names = await caches.keys();
      const appNames = names.filter(name=>name.startsWith(APP_CACHE_PREFIX));
      return {supported:true, names, appNames, error:null};
    }catch(err){
      return {supported:true, names:[], appNames:[], error:err};
    }
  }

  function renderServiceWorkerInfo(result){
    if(!result.supported){
      setText('serviceWorkerStatus','非対応');
      setText('serviceWorkerState','このブラウザはService Workerに対応していません');
      return;
    }

    if(result.status === 'failed'){
      setText('serviceWorkerStatus','登録失敗');
      setText('serviceWorkerState',formatError(result.error));
      return;
    }

    const reg = result.registration;
    const worker = result.worker;

    setText('serviceWorkerStatus','登録済み');

    if(worker){
      const state = worker.state || '状態不明';
      const kind =
        reg?.active === worker ? 'active' :
        reg?.waiting === worker ? 'waiting' :
        reg?.installing === worker ? 'installing' :
        'worker';
      setText('serviceWorkerState',`${kind} / ${state}`);
    }else{
      setText('serviceWorkerState','登録済み（Worker状態取得待ち）');
    }
  }

  function renderCacheInfo(cacheInfo){
    const host = $('cacheList');
    if(!host) return;

    host.innerHTML = '';

    if(!cacheInfo.supported){
      host.textContent = 'Cache Storageはこのブラウザで利用できません。';
      return;
    }

    if(cacheInfo.error){
      host.textContent = `キャッシュ情報を取得できませんでした：${formatError(cacheInfo.error)}`;
      return;
    }

    if(cacheInfo.appNames.length === 0){
      host.textContent = 'このアプリのキャッシュはありません。';
      return;
    }

    const ul = document.createElement('ul');
    ul.className = 'system-cache-list';
    cacheInfo.appNames.forEach(name=>{
      const li = document.createElement('li');
      li.textContent = name;
      ul.appendChild(li);
    });
    host.appendChild(ul);
  }

  function renderStaticInfo(){
    setText('systemVersion',meta.version || '—');
    setText('systemBuild',meta.build || '—');
    setText('systemEnvironment',meta.environment || '—');
    setText('systemReleasedAt',meta.releasedAtJst || '—');
    setText('systemCacheVersion',meta.cacheVersion || '—');
    setText('systemFirebaseProjectId',
      window.TAXI_PAY_FIREBASE_CONFIG?.projectId || '—'
    );
    setText('systemCurrentUrl',location.href);
    setText('systemBrowser',navigator.userAgent || '—');

    const isStandalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;
    setText('systemPwaMode',isStandalone ? 'はい' : 'いいえ');
  }

  async function refreshDiagnostics(){
    const btn = $('refreshSystemInfo');
    if(btn){
      btn.disabled = true;
      btn.textContent = '情報を取得中…';
    }

    renderStaticInfo();
    setText('serviceWorkerStatus','登録中…');
    setText('serviceWorkerState','確認中…');

    const swResult = await ensureServiceWorkerRegistered();
    renderServiceWorkerInfo(swResult);

    // Service Worker確認後にキャッシュを取得する。
    const cacheInfo = await readCacheInfo();
    renderCacheInfo(cacheInfo);

    if(btn){
      btn.disabled = false;
      btn.textContent = '情報を再取得';
    }
  }

  async function rebuildPwaCache(){
    const btn = $('rebuildPwaCache');
    if(btn){
      btn.disabled = true;
      btn.textContent = '再構築中…';
    }

    try{
      if('caches' in window){
        const names = await caches.keys();
        await Promise.all(
          names
            .filter(name=>name.startsWith(APP_CACHE_PREFIX))
            .map(name=>caches.delete(name))
        );
      }

      const sw = await ensureServiceWorkerRegistered();

      if(sw.registration){
        try{
          if(sw.registration.waiting){
            sw.registration.waiting.postMessage({type:'SKIP_WAITING'});
          }
          await sw.registration.update();
        }catch(_){}
      }

      await refreshDiagnostics();
      alert('PWAキャッシュの再構築処理が完了しました。');
    }catch(err){
      alert(`PWAキャッシュを再構築できませんでした。\n${formatError(err)}`);
    }finally{
      if(btn){
        btn.disabled = false;
        btn.textContent = 'PWAキャッシュを再構築';
      }
    }
  }

  document.addEventListener('DOMContentLoaded',()=>{
    $('refreshSystemInfo')?.addEventListener('click',refreshDiagnostics);
    $('rebuildPwaCache')?.addEventListener('click',rebuildPwaCache);
    refreshDiagnostics();
  });
})();