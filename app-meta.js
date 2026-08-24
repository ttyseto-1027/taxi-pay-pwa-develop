(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260825-05',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260825-05-chart-daily-stack-fix',
    releasedAtJst: '2026/08/25 00:55:52 JST'
  });
})();
