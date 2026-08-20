(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260820-02',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260820-02-drive-lazy-auth',
    releasedAtJst: '2026/08/20 12:31:56 JST'
  });
})();
