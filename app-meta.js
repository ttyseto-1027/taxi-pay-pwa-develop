(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20261003-02',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20261003-phase12-drive-scope-02',
    releasedAtJst: '2026/10/03 01:21:35 JST'
  });
})();
