(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260819-05',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260819-05-coherent-runtime-release',
    releasedAtJst: '2026/08/19 12:27:27 JST'
  });
})();
