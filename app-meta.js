(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260819-02',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260819-02-cache-update-r6',
    releasedAtJst: '2026/08/19 00:47:15 JST'
  });
})();
