(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260825-08',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260825-08-daily-independent',
    releasedAtJst: '2026/08/25 02:05:23 JST'
  });
})();
