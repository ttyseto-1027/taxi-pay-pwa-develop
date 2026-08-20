(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260820-05',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260820-05-drive-direct-auth',
    releasedAtJst: '2026/08/20 14:45:40 JST'
  });
})();
