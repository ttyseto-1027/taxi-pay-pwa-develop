(function(){
  'use strict';
  const meta=window.TAXI_PAY_APP_META||{};
  const isDevelop=String(location.pathname||'').includes('taxi-pay-pwa-develop');
  const PREFIX='taxi-pay-';
  async function clearAppCaches(){
    if(!('caches' in window)) return;
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith(PREFIX)).map(k=>caches.delete(k)));
  }
  async function disableDevelopServiceWorkers(){
    if(!isDevelop || !('serviceWorker' in navigator)) return;
    try{
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.filter(r=>String(r.scope||'').includes('/taxi-pay-pwa-develop/')).map(r=>r.unregister()));
      await clearAppCaches();
    }catch(err){ console.warn('DEVELOP cache cleanup failed',err); }
  }
  async function fetchLatestMeta(){
    const url=new URL('./app-meta.json',location.href); url.searchParams.set('_',Date.now());
    const res=await fetch(url,{cache:'no-store'}); if(!res.ok) throw new Error(`app-meta.json ${res.status}`); return res.json();
  }
  async function ensureServiceWorker(){
    if(isDevelop){ await disableDevelopServiceWorkers(); return null; }
    if(!('serviceWorker' in navigator)) return null;
    const swUrl=new URL('./sw.js',location.href); swUrl.searchParams.set('_',Date.now());
    let reg=await navigator.serviceWorker.getRegistration('./');
    if(!reg) reg=await navigator.serviceWorker.register(swUrl.toString(),{scope:'./',updateViaCache:'none'}); else await reg.update();
    if(reg.waiting) reg.waiting.postMessage({type:'SKIP_WAITING'});
    return reg;
  }
  window.TaxiPayPhase75={meta,clearAppCaches,fetchLatestMeta,ensureServiceWorker,developNoCache:isDevelop};
  document.addEventListener('DOMContentLoaded',()=>ensureServiceWorker());
})();
