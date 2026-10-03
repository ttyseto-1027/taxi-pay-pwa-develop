(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20261003-03',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20261003-phase12-drive-error-ja-03',
    releasedAtJst: '2026/10/03 17:49:53 JST'
  });
})();
