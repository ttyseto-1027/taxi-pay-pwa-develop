(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260825-09',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260825-09-monthly-stacked-workdays',
    releasedAtJst: '2026/08/25 02:23:59 JST'
  });
})();
