(function(){
  'use strict';

  const meta = window.TAXI_PAY_APP_META || {};
  const PREFIX = 'taxi-pay-';

  function compareBuild(a,b){
    return String(a||'').localeCompare(String(b||''), undefined, {numeric:true, sensitivity:'base'});
  }

  async function fetchLatestMeta(){
    const url = new URL('./app-meta.json', location.href);
    url.searchParams.set('_', Date.now());
    const res = await fetch(url.toString(), {
      cache:'no-store',
      headers:{'Cache-Control':'no-cache, no-store, must-revalidate'}
    });
    if(!res.ok) throw new Error(`app-meta.json ${res.status}`);
    return await res.json();
  }

  function removeNotice(){
    document.getElementById('appUpdateNotice')?.remove();
  }

  function showNotice(latestBuild){
    let box = document.getElementById('appUpdateNotice');
    if(box){
      const buildText = box.querySelector('[data-latest-build]');
      if(buildText) buildText.textContent = `Build ${latestBuild} を取得してください。`;
      box.dataset.latestBuild = latestBuild;
      return;
    }

    box = document.createElement('div');
    box.id = 'appUpdateNotice';
    box.className = 'app-update-notice app-update-notice-stable';
    box.setAttribute('role','status');
    box.dataset.latestBuild = latestBuild;
    box.innerHTML =
      `<strong>新しいバージョンがあります。</strong>` +
      `<span data-latest-build>Build ${latestBuild} を取得してください。</span>` +
      `<button type="button">キャッシュを更新して最新版を取得</button>`;

    box.querySelector('button').addEventListener('click', ()=>recover(latestBuild));
    document.body.prepend(box);
  }

  async function clearAppCaches(){
    if(!('caches' in window)) return;
    const keys = await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith(PREFIX)).map(k=>caches.delete(k)));
  }

  async function forceServiceWorkerUpdate(){
    if(!('serviceWorker' in navigator)) return null;

    const swUrl = new URL('./sw.js', location.href);
    swUrl.searchParams.set('_', Date.now());

    let reg = await navigator.serviceWorker.getRegistration('./');

    if(!reg){
      reg = await navigator.serviceWorker.register(swUrl.toString(), {
        scope:'./',
        updateViaCache:'none'
      });
    }else{
      await reg.update();
    }

    if(reg.waiting) reg.waiting.postMessage({type:'SKIP_WAITING'});

    await Promise.race([
      navigator.serviceWorker.ready,
      new Promise(resolve => setTimeout(resolve, 4000))
    ]);

    return reg;
  }

  async function verifyServerBuild(targetBuild){
    const latest = await fetchLatestMeta();
    return {
      ok: compareBuild(latest.build, targetBuild) >= 0,
      serverBuild: String(latest.build || '')
    };
  }

  async function recover(targetBuild){
    const ok = confirm(
      '最新版を取得しますか？\n\n' +
      '勤務実績・控除設定・利用者情報は削除されません。'
    );
    if(!ok) return;

    const btn = document.querySelector('#appUpdateNotice button');
    if(btn){
      btn.disabled = true;
      btn.textContent = '最新版を取得しています…';
    }

    try{
      // まずGitHub Pages側に対象Buildが存在することを再確認。
      const serverCheck = await verifyServerBuild(targetBuild);
      if(!serverCheck.ok){
        throw new Error(`公開中Buildを確認できません。現在: ${serverCheck.serverBuild || '不明'}`);
      }

      await clearAppCaches();
      await forceServiceWorkerUpdate();

      // HTML自身も必ず新しいURLで取り直す。
      const url = new URL('./index.html', location.href);
      url.searchParams.set('_refresh', Date.now());
      url.searchParams.set('_targetBuild', targetBuild);
      location.replace(url.toString());
    }catch(err){
      console.error('最新版取得に失敗しました。', err);
      if(btn){
        btn.disabled = false;
        btn.textContent = 'キャッシュを更新して最新版を取得';
      }
      alert(`最新版を取得できませんでした。\n${err?.message || err}`);
    }
  }

  function showSuccess(build){
    document.getElementById('appUpdateSuccess')?.remove();

    const box = document.createElement('div');
    box.id = 'appUpdateSuccess';
    box.className = 'app-update-success';
    box.setAttribute('role','status');
    box.innerHTML = `<strong>最新版に更新しました。</strong><span>Build ${build}</span>`;
    document.body.prepend(box);

    window.setTimeout(()=>{
      box.classList.add('is-hiding');
      window.setTimeout(()=>box.remove(),300);
    },5000);
  }

  async function finalizePendingUpdate(){
    const url = new URL(location.href);
    const targetBuild = url.searchParams.get('_targetBuild');
    if(!targetBuild) return false;

    const currentBuild = String(meta.build || '');

    if(compareBuild(currentBuild, targetBuild) >= 0){
      removeNotice();
      showSuccess(currentBuild);

      url.searchParams.delete('_targetBuild');
      url.searchParams.delete('_refresh');
      history.replaceState(null, '', url.pathname + (url.search ? url.search : '') + url.hash);
      return true;
    }

    // 新しいHTML/JSをまだ読めていない場合は成功扱いにせず、通知を残す。
    showNotice(targetBuild);
    const btn = document.querySelector('#appUpdateNotice button');
    if(btn) btn.textContent = `再試行：Build ${targetBuild} を取得`;
    return false;
  }

  async function ensureServiceWorker(){
    if(!('serviceWorker' in navigator)) return;
    try{
      await forceServiceWorkerUpdate();
    }catch(err){
      console.warn('Service Workerの更新確認に失敗しました。', err);
    }
  }

  async function checkLatest(){
    try{
      const latest = await fetchLatestMeta();
      const currentBuild = String(meta.build || '');
      const latestBuild = String(latest.build || '');

      if(latestBuild && compareBuild(currentBuild, latestBuild) < 0){
        showNotice(latestBuild);
      }else{
        removeNotice();
      }
    }catch(err){
      console.warn('最新版確認を実行できませんでした。', err);
    }
  }

  window.TaxiPayPhase75 = {
    meta,
    clearAppCaches,
    recover,
    checkLatest,
    ensureServiceWorker
  };

  document.addEventListener('DOMContentLoaded', async ()=>{
    const completed = await finalizePendingUpdate();
    await ensureServiceWorker();
    if(!completed) await checkLatest();
  });

  document.addEventListener('visibilitychange', ()=>{
    if(document.visibilityState === 'visible') checkLatest();
  });

  window.addEventListener('pageshow', ()=>checkLatest());
})();