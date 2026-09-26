(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260926-03',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260926-phase13-01',
    releasedAtJst: '2026/09/26 09:30:00 JST'
  });
})();
