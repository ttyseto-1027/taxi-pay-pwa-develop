(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260824-17',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260824-17-phase8-chart-types',
    releasedAtJst: '2026/08/24 23:38:05 JST'
  });
})();
