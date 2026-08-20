(function(){
  const path = location.pathname || '';
  const environment = path.includes('taxi-pay-pwa-develop') ? 'DEVELOP' : 'PRODUCTION';
  window.TAXI_PAY_APP_META = Object.freeze({
    version: '1.4β',
    build: '20260820-07',
    environment,
    cacheVersion: 'taxi-pay-v1.4-beta-20260820-07-app-js01-diagnostics',
    releasedAtJst: '2026/08/20 15:05:58 JST'
  });
})();
