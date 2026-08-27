(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260827-01',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260827-01-data-safety',
    releasedAtJst: '2026/08/27 21:30:00 JST'
  });
})();
