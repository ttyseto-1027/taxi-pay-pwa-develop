(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260820-04',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260820-04-drive-auth-fix',
    releasedAtJst: '2026/08/20 13:24:46 JST'
  });
})();
