(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260904-05',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260904-phase10-cache-update-05',
    releasedAtJst: '2026/09/04 04:12:00 JST'
  });
})();
