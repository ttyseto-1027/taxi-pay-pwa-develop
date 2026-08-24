(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260825-07',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260825-07-batched-ui-chart-fixes',
    releasedAtJst: '2026/08/25 01:56:36 JST'
  });
})();
