(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260820-08',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260820-08-drive-bind-fix',
    releasedAtJst: '2026/08/20 15:11:52 JST'
  });
})();
