(function(){
  'use strict';

  const meta = window.TAXI_PAY_APP_META || {};
  const PREFIX = 'taxi-pay-';
  const SEEN_KEY = 'taxiPayLatestBuildSeen';
  const UPDATED_KEY = 'taxiPayLatestBuildUpdated';

  function compareBuild(a,b){
    return String(a||'').localeCompare(String(b||''), undefined, {numeric:true, sensitivity:'base'});
  }

  function safeGet(key){
    try { return localStorage.getItem(key) || ''; } catch (_) { return ''; }
  }
  function safeSet(key,val){
    try { localStorage.setItem(key, String(val||'')); } catch (_) {}
  }

  async function clearAppCaches(){
    if('caches' in window){
      const keys = await caches.keys();
      await Promise.all(keys.filter(k=>k.startsWith(PREFIX)).map(k=>caches.delete(k)));
    }
    if('serviceWorker' in navigator){
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r=>r.unregister()));
    }
  }

  async function fetchLatestMeta(){
    const res = await fetch(`app-meta.json?_=${Date.now()}`, {
      cache:'no-store',
      headers:{'Cache-Control':'no-cache, no-store, must-revalidate'}
    });
    if(!res.ok) throw new Error(`app-meta.json ${res.status}`);
    return await res.json();
  }

  function removeNotice(){
    document.getElementById('appUpdateNotice')?.remove();
  }

  async function recover(targetBuild){
    const ok = confirm(
      'アプリの表示データを更新しますか？\n\n' +
      '保存済みの勤務実績・控除設定・利用者情報は削除されません。'
    );
    if(!ok) return;

    const btn = document.querySelector('#appUpdateNotice button');
    if(btn){
      btn.disabled = true;
      btn.textContent = '更新しています…';
    }
    removeNotice();

    // アプリ全体で「このBuildへの更新操作を実行済み」と記録。
    if(targetBuild){
      safeSet(UPDATED_KEY, targetBuild);
      safeSet(SEEN_KEY, targetBuild);
    }

    await clearAppCaches();

    const url = new URL(location.href);
    url.searchParams.set('_refresh', Date.now());
    if(targetBuild) url.searchParams.set('_build', targetBuild);
    location.replace(url.toString());
  }

  function showNotice(latestBuild){
    removeNotice();

    const host =
      document.getElementById('authMessage') ||
      document.querySelector('.app-announcement') ||
      document.querySelector('main') ||
      document.body.firstElementChild;

    const box = document.createElement('div');
    box.id = 'appUpdateNotice';
    box.className = 'app-update-notice';
    box.innerHTML =
      `<strong>新しいバージョンがあります。</strong>` +
      `<span>Build ${latestBuild} を取得してください。</span>` +
      `<button type="button">キャッシュを更新して最新版を取得</button>`;

    box.querySelector('button').addEventListener('click', ()=>recover(latestBuild));

    if(host && host.parentNode){
      host.insertAdjacentElement('afterend', box);
    } else {
      document.body.prepend(box);
    }
  }

  async function checkLatest(){
    try{
      const latest = await fetchLatestMeta();
      const currentBuild = String(meta.build || '');
      const latestBuild = String(latest.build || '');
      const seenBuild = safeGet(SEEN_KEY);
      const updatedBuild = safeGet(UPDATED_KEY);

      // 本体が最新なら、アプリ全体の状態も最新Buildへ揃えて終了。
      if(compareBuild(currentBuild, latestBuild) >= 0){
        safeSet(SEEN_KEY, latestBuild);
        safeSet(UPDATED_KEY, latestBuild);
        removeNotice();
        return;
      }

      // そのBuildへの更新操作を一度でも実行済みなら、
      // 別ページへ遷移しても同じ通知を再表示しない。
      if(compareBuild(updatedBuild, latestBuild) >= 0){
        removeNotice();
        return;
      }

      // 同一Buildの通知をアプリ全体で一度表示済みなら、
      // ページ遷移先で再表示しない。
      if(compareBuild(seenBuild, latestBuild) >= 0){
        removeNotice();
        return;
      }

      // 初回だけ表示し、そのBuildを「表示済み」と記録。
      safeSet(SEEN_KEY, latestBuild);
      showNotice(latestBuild);

    }catch(err){
      console.warn('最新版確認を実行できませんでした。', err);
    }
  }

  window.TaxiPayPhase75 = {
    meta,
    clearAppCaches,
    recover,
    checkLatest
  };

  document.addEventListener('DOMContentLoaded', checkLatest);
})();
