(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260905-01',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260905-phase11-01',
    releasedAtJst: '2026/09/05 00:36:00 JST'
  });
})();
