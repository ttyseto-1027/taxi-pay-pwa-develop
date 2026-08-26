(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260826-16',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260826-16-data-safety-verify-fix',
    releasedAtJst: '2026/08/26 22:35:00 JST'
  });
})();
