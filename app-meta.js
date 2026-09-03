(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260904-03',
    environment,
    cacheVersion: 'develop-no-sw-20260904-phase10-03',
    releasedAtJst: '2026/09/04 02:05:00 JST'
  });
})();
