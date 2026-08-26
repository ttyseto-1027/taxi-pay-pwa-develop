(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260826-17-test',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260826-17-test-unique-assets',
    releasedAtJst: '2026/08/26 23:10:00 JST'
  });
})();
