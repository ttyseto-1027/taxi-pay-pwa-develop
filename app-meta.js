(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260918-02',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260918-phase11-02',
    releasedAtJst: '2026/09/18 19:10:00 JST'
  });
})();
