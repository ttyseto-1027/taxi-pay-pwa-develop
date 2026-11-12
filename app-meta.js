(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20261113-02',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20261113-dispatch-fee-02',
    releasedAtJst: '2026/11/13 00:59:23 JST'
  });
})();
